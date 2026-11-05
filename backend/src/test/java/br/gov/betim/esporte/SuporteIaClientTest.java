package br.gov.betim.esporte;

import br.gov.betim.esporte.dto.SuporteRequest;
import br.gov.betim.esporte.service.*;
import com.fasterxml.jackson.databind.*;
import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.List;
import org.junit.jupiter.api.*;
import static org.assertj.core.api.Assertions.*;

class SuporteIaClientTest {
    final ObjectMapper json = new ObjectMapper();
    final List<SuporteConhecimento.Referencia> refs = List.of(new SuporteConhecimento.Referencia(
            "areia", "quadras", "Areia", "agendamento-quadras.html", "areia", "Quadras 6 e 7 de areia.", true));
    HttpServer servidor;
    String retorno;
    JsonNode enviado;
    int codigo;
    String autorizacao;

    @BeforeEach void iniciar() throws Exception {
        codigo = 200;
        servidor = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        servidor.createContext("/responses", troca -> {
            enviado = json.readTree(troca.getRequestBody());
            autorizacao = troca.getRequestHeaders().getFirst("Authorization");
            byte[] dados = retorno.getBytes(StandardCharsets.UTF_8);
            troca.sendResponseHeaders(codigo, dados.length);
            troca.getResponseBody().write(dados); troca.close();
        });
        servidor.start();
    }
    @AfterEach void encerrar() { servidor.stop(0); }

    SuporteIaClient cliente() {
        return new SuporteIaClient(json, "chave-ficticia", "modelo-teste",
                "http://127.0.0.1:" + servidor.getAddress().getPort() + "/responses");
    }
    void resposta(String conteudo, List<String> fontes) throws Exception {
        retorno = json.writeValueAsString(java.util.Map.of("status", "completed", "output", List.of(
                java.util.Map.of("type", "message", "content", List.of(java.util.Map.of("type", "output_text",
                        "text", json.writeValueAsString(java.util.Map.of("resposta", conteudo, "fontes", fontes))))))));
    }
    SuporteRequest pergunta() {
        return new SuporteRequest("Quadras de areia? CPF 123.456.789-00 e senha: segredo123",
                "/agendamento-quadras.html", "quadras", List.of(new SuporteRequest.Turno("user", "meu email teste@exemplo.com")));
    }

    @Test void enviaContextoRedigidoERetornaApenasFontesConhecidas() throws Exception {
        resposta("As quadras 6 e 7 são de areia.", List.of("areia"));
        var resultado = cliente().responder(pergunta(), refs).orElseThrow();
        assertThat(resultado.modo()).isEqualTo("ia");
        assertThat(resultado.fontes().get(0).url()).isEqualTo("agendamento-quadras.html");
        assertThat(enviado.path("store").asBoolean()).isFalse();
        assertThat(enviado.path("text").path("format").path("strict").asBoolean()).isTrue();
        assertThat(enviado.path("input").asText()).contains("referencias", "historico", "[oculto]")
                .doesNotContain("123.456.789-00", "segredo123", "teste@exemplo.com");
        assertThat(autorizacao).isEqualTo("Bearer chave-ficticia");
    }

    @Test void rejeitaFonteInventada() throws Exception {
        resposta("Texto sem base", List.of("fonte-inventada"));
        assertThat(cliente().responder(pergunta(), refs)).isEmpty();
    }
    @Test void pedeEsclarecimentoQuandoModeloNaoEncontraBase() throws Exception {
        resposta("Não sei", List.of());
        assertThat(cliente().responder(pergunta(), refs).orElseThrow().modo()).isEqualTo("esclarecimento");
    }
    @Test void falhaDoProvedorPermiteConsultaLocal() {
        codigo = 429; retorno = "{\"error\":{\"message\":\"limite ficticio\"}}";
        assertThat(cliente().responder(pergunta(), refs)).isEmpty();
    }
    @Test void respostaIncompletaNaoViraRespostaFinal() {
        retorno = "{\"status\":\"incomplete\",\"output\":[]}";
        assertThat(cliente().responder(pergunta(), refs)).isEmpty();
    }
    @Test void jsonInvalidoNaoDerrubaOSuporte() {
        retorno = "formato inválido";
        assertThat(cliente().responder(pergunta(), refs)).isEmpty();
    }
    @Test void semChaveNaoFazChamadaExterna() {
        var cliente = new SuporteIaClient(json, "", "modelo", "http://127.0.0.1:1/responses");
        assertThat(cliente.configurada()).isFalse();
        assertThat(cliente.responder(pergunta(), refs)).isEmpty();
    }
}
