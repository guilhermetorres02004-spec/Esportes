package br.gov.betim.esporte.service;

import br.gov.betim.esporte.dto.SuporteRequest;
import br.gov.betim.esporte.dto.SuporteResponse;
import br.gov.betim.esporte.dto.SuporteResponse.Fonte;
import br.gov.betim.esporte.service.SuporteConhecimento.Referencia;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import static br.gov.betim.esporte.service.SuporteConhecimento.normalizar;

@Service
public class SuporteService {
    private final SuporteConhecimento conhecimento;
    private final SuporteIaClient ia;
    private static final List<String> SUGESTOES = List.of("Como me inscrever?", "Como reservar uma quadra?", "Onde ficam os arquivos?");

    public SuporteService(SuporteConhecimento conhecimento, SuporteIaClient ia) {
        this.conhecimento = conhecimento;
        this.ia = ia;
    }

    public Map<String, Object> status() {
        return Map.of("iaConfigurada", ia.configurada(), "referencias", conhecimento.todas().size());
    }

    public SuporteResponse responder(SuporteRequest pedido) {
        validar(pedido);
        String pergunta = normalizar(pedido.mensagem());
        if (pergunta.matches("(oi|ola|bom dia|boa tarde|boa noite|obrigad[oa]|valeu|tudo bem)")) {
            return new SuporteResponse("Olá! Sou o assistente do Portal do Esporte. Posso orientar sobre modalidades, inscrição, quadras, agenda, documentos e acesso. Qual é sua dúvida?", "portal", "consulta", List.of(), SUGESTOES);
        }
        String contexto = contexto(pedido);
        List<Referencia> referencias = conhecimento.buscar(pedido.mensagem(), contexto);
        if (referencias.isEmpty()) return esclarecer();
        if (pergunta.matches(".*\\b(dor|lesao|doenca|gravida|gravidez|cirurgia|medicacao)\\b.*")
                && pergunta.matches(".*\\b(posso|devo|tenho|sinto|tratar|tratamento)\\b.*")) {
            return new SuporteResponse("Não consigo avaliar condições de saúde nem confirmar se uma atividade é adequada para você. O portal disponibiliza o questionário PAR-Q e informa os requisitos de atestado nas modalidades. Leve sua dúvida ao profissional de saúde responsável antes de tomar essa decisão.",
                    "downloads", "consulta", List.of(new Fonte("downloads", "Documentação e PAR-Q", "downloads.html")), SUGESTOES);
        }
        if (pergunta.matches(".*\\b(custa|preco|valor|taxa|gratuito|gratuita)\\b.*")
                && referencias.stream().filter(r -> r.topico().equals(contexto)).noneMatch(r ->
                normalizar(r.texto()).matches(".*\\b(preco|valor|taxa|gratuito|gratuita)\\b.*"))) return esclarecer();
        if (!contexto.equals("quadras") && pergunta.matches(".*\\b(vaga|vagas|lotada|lotado)\\b.*")) {
            var ref = conhecimento.todas().stream().filter(r -> r.id().equals("vagas")).findFirst().orElseThrow();
            return new SuporteResponse(ref.texto(), contexto, "consulta", List.of(fonte(ref)), SUGESTOES);
        }
        var gerada = ia.responder(pedido, referencias);
        if (gerada.isPresent()) return gerada.get();
        Referencia principal = referencias.get(0);
        return new SuporteResponse(principal.texto(), principal.topico(), "consulta",
                List.of(fonte(principal)), SUGESTOES);
    }

    private SuporteResponse esclarecer() {
        return new SuporteResponse("Não encontrei informação suficiente no portal para responder com segurança. Você pode dizer qual área, modalidade ou etapa está tentando acessar? Para confirmação de vagas ou atendimento pessoal, consulte a Secretaria de Esportes.",
                "", "esclarecimento", List.of(new Fonte("contato", "Atendimento da Secretaria",
                "https://www.betim.mg.gov.br/portal/secretarias/13/secretaria-municipal-de-esportes")), SUGESTOES);
    }

    static Fonte fonte(Referencia ref) { return new Fonte(ref.id(), ref.titulo(), ref.url()); }

    private static String explicito(String texto) {
        String p = normalizar(texto);
        for (var regra : List.of(
                Map.entry("areia|praia|beach|futevolei|quadras?|reserv[ae]|agendamento", "quadras"),
                Map.entry("senha|login|credencia|sessao|acesso administrativo", "acesso"),
                Map.entry("autoriz|consent|uso de imagem|cpf", "inscricao"),
                Map.entry("futebol|soccer", "futebol"), Map.entry("volei|voleibol", "volei"),
                Map.entry("judo", "detalhe-modalidade"), Map.entry("pilates", "pilates"),
                Map.entry("arquivo|importar|upload|armazenar", "arquivos"),
                Map.entry("calendario|agenda|evento", "agenda"),
                Map.entry("almoxarifado|retirada|devolucao|estoque|requisicao", "almoxarifado"),
                Map.entry("manual|regimento|etica|portaria|edita[l|i]|contrato|lei de incentivo|administrativ", "administrativo"),
                Map.entry("download|baixar|par q|parq|tac", "downloads"),
                Map.entry("presenca|frequencia|chamada|relatorio", "presenca"),
                Map.entry("inscri|inscre|matricul|cadastr|ficha", "inscricao"))) {
            if (java.util.regex.Pattern.compile("\\b(?:" + regra.getKey() + ")").matcher(p).find()) return regra.getValue();
        }
        return "";
    }

    private String contexto(SuporteRequest pedido) {
        String explicito = explicito(pedido.mensagem());
        if (!explicito.isEmpty()) return explicito;
        if (pedido.topico() != null && conhecimento.todas().stream().anyMatch(r -> r.topico().equals(pedido.topico()))) return pedido.topico();
        if (pedido.historico() != null) {
            for (int i = pedido.historico().size() - 1; i >= 0; i--) {
                var turno = pedido.historico().get(i);
                if ("user".equals(turno.papel()) && !explicito(turno.texto()).isEmpty()) return explicito(turno.texto());
            }
        }
        String pagina = pedido.pagina() == null ? "" : pedido.pagina().split("[?#]", 2)[0].replaceFirst("^/", "");
        return conhecimento.todas().stream().filter(r -> r.url().equalsIgnoreCase(pagina)).map(Referencia::topico).findFirst().orElse("");
    }

    private static void validar(SuporteRequest pedido) {
        if (pedido == null || pedido.mensagem() == null || pedido.mensagem().isBlank()
                || pedido.mensagem().length() > 1200 || (pedido.pagina() != null && pedido.pagina().length() > 200)
                || (pedido.topico() != null && pedido.topico().length() > 60)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Envie uma pergunta com até 1.200 caracteres.");
        }
        if (pedido.historico() == null) return;
        if (pedido.historico().size() > 8 || pedido.historico().stream().anyMatch(t -> t == null
                || !("user".equals(t.papel()) || "assistant".equals(t.papel()))
                || t.texto() == null || t.texto().length() > 3000)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Histórico de conversa inválido.");
        }
    }
}
