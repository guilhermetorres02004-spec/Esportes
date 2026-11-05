package br.gov.betim.esporte.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.nio.file.*;
import java.text.Normalizer;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Component
public class SuporteConhecimento {
    public record Referencia(String id, String topico, String titulo, String url,
                             String palavras, String texto, boolean guia) {}
    private final ObjectMapper json;
    private final Path arquivo;
    private List<Referencia> documentos;
    private long alterado = -1;

    public SuporteConhecimento(ObjectMapper json,
            @Value("${app.suporte.base:../frontend/public/docs/suporte/base.json}") String arquivo) throws IOException {
        this.json = json;
        this.arquivo = Path.of(arquivo);
        try (var stream = new ClassPathResource("suporte/base.json").getInputStream()) {
            documentos = List.of(json.treeToValue(json.readTree(stream).get("documentos"), Referencia[].class));
        }
    }

    public synchronized List<Referencia> todas() {
        try {
            long data = Files.getLastModifiedTime(arquivo).toMillis();
            if (data != alterado) {
                var novas = json.treeToValue(json.readTree(Files.readString(arquivo)).get("documentos"), Referencia[].class);
                if (novas.length > 0) { documentos = List.of(novas); alterado = data; }
            }
        } catch (IOException | RuntimeException ignored) { /* JAR ou atualização em andamento: mantém a última base válida. */ }
        return documentos;
    }

    public static String normalizar(String texto) {
        return Normalizer.normalize(texto == null ? "" : texto, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "").toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", " ").trim();
    }

    private static Set<String> termos(String texto) {
        var termos = new LinkedHashSet<String>();
        String ignoradas = " a o as os de da do das dos em no na nos nas um uma uns umas e eu voce me meu minha "
                + "que qual quais como para por pra pro com ao aos se ser ter fazer posso pode preciso quero gostaria saber "
                + "site portal sobre algo isso isto ele ela ai la tem esta esse essa estou muito favor bom dia boa tarde noite hoje amanha ontem ";
        for (String termo : normalizar(texto).split(" +")) {
            if (termo.length() < 3 || ignoradas.contains(" " + termo + " ")) continue;
            String raiz = termo.endsWith("s") && termo.length() > 4 ? termo.substring(0, termo.length() - 1) : termo;
            termos.add(switch (raiz) {
                case "etaria", "etario", "anos" -> "idade";
                case "hora" -> "horario";
                case "onde", "endereco", "locai", "nucleo", "polo" -> "local";
                default -> raiz;
            });
        }
        return termos;
    }

    public List<Referencia> buscar(String pergunta, String contexto) {
        record Resultado(Referencia referencia, double pontuacao) {}
        Set<String> busca = termos(pergunta);
        var resultados = new ArrayList<Resultado>();
        List<Referencia> base = todas();
        Map<String, Long> frequencias = new HashMap<>();
        for (Referencia ref : base) {
            termos(ref.palavras() + " " + ref.texto()).forEach(t -> frequencias.merge(t, 1L, Long::sum));
        }
        for (Referencia ref : base) {
            Set<String> titulo = termos(ref.titulo()), chaves = termos(ref.palavras()), corpo = termos(ref.texto());
            double pontos = 0;
            for (String termo : busca) {
                double raridade = 1 + Math.log((base.size() + 1.0) / (frequencias.getOrDefault(termo, 0L) + 1.0));
                double valor = titulo.contains(termo) ? 7 : chaves.contains(termo) ? 5 : corpo.contains(termo) ? 2 : 0;
                if (valor == 0 && termo.length() >= 6 && chaves.stream().anyMatch(t -> proximo(termo, t))) valor = 3;
                pontos += valor * raridade;
            }
            if (pontos < 5) continue; // Contexto sozinho não transforma pergunta desconhecida em resposta.
            if (busca.contains("idade") && normalizar(ref.texto()).matches(".*\\b\\d{1,2} (a|e|anos)\\b.*")) pontos += 10;
            if (ref.topico().equals(contexto)) pontos += 15;
            if (ref.guia()) pontos += 1;
            resultados.add(new Resultado(ref, pontos));
        }
        return resultados.stream().sorted(Comparator.comparingDouble(Resultado::pontuacao).reversed())
                .limit(5).map(Resultado::referencia).toList();
    }

    private static boolean proximo(String a, String b) {
        if (Math.abs(a.length() - b.length()) > 1) return false;
        int i = 0, j = 0, erros = 0;
        while (i < a.length() && j < b.length()) {
            if (a.charAt(i) == b.charAt(j)) { i++; j++; continue; }
            if (++erros > 1) return false;
            if (a.length() >= b.length()) i++;
            if (b.length() >= a.length()) j++;
        }
        return erros + a.length() - i + b.length() - j <= 1;
    }
}
