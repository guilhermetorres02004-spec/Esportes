package br.gov.betim.esporte.service;

import br.gov.betim.esporte.dto.ConquistaOficial;
import java.time.LocalDate;
import java.text.Normalizer;
import java.util.*;
import java.util.regex.Pattern;
import org.jsoup.Jsoup;
import org.springframework.stereotype.Component;

@Component
public class ConquistasFonte {
    private static final Pattern RESULTADO = Pattern.compile("\\b(conquist(?:a|as|am|ou|aram)|fatur(?:a|am|ou|aram)|vence(?:m|u)?|campe(?:ao|a|oes|as)|medalh(?:a|as)|podio(?:s)?|recorde(?:s)?)\\b");
    private static final Pattern FUTURO = Pattern.compile("\\b(vai|vao|disputara|disputarao|busca|buscam|buscara|buscarao|prepara|preparam|pretende|pretendem|podera|poderao|tera|terao|sera|serao|sedia|recebe)\\b");
    static String normalizar(String texto) {
        return Normalizer.normalize(texto, Normalizer.Form.NFD).replaceAll("\\p{M}", "").toLowerCase(Locale.ROOT);
    }
    static boolean resultado(String titulo) {
        String normal = normalizar(titulo);
        return RESULTADO.matcher(normal).find() && !FUTURO.matcher(normal).find();
    }
    public List<String> links(String html) {
        var doc = Jsoup.parse(html, FotosFonte.SITE);
        var links = new LinkedHashSet<String>();
        for (var card : doc.select(".ntc_noticia")) {
            var titulo = card.selectFirst(".ntc_titulo_noticia");
            var link = card.closest("a[href]");
            if (titulo != null && link != null && resultado(titulo.text()) && FotosFonte.permitida(link.absUrl("href"), false))
                links.add(link.absUrl("href").replaceAll("/$", ""));
        }
        return List.copyOf(links);
    }

    public Optional<ConquistaOficial> extrair(String url, String html) {
        if (!FotosFonte.permitida(url, false)) return Optional.empty();
        var doc = Jsoup.parse(html, FotosFonte.SITE);
        var titulo = doc.selectFirst(".ntc_area_titulo_noticia .ntc_titulo_noticia");
        var data = doc.selectFirst(".ntc_area_titulo_noticia .ntc_data_noticia");
        var corpo = doc.selectFirst(".ntc_area_texto_noticia");
        if (titulo == null || data == null || corpo == null || !resultado(titulo.text())) return Optional.empty();
        var publicada = data(data.text());
        if (publicada == null || publicada.isBefore(LocalDate.of(2025, 1, 1)) || publicada.isAfter(LocalDate.now(java.time.ZoneId.of("America/Sao_Paulo")))) return Optional.empty();
        String texto = corpo.text();
        if (texto.length() < 40) return Optional.empty();
        var primeiro = corpo.select("p").stream().map(p -> p.text()).filter(p -> p.length() >= 40).findFirst().orElse(texto);
        String resumo = primeiro.length() > 500 ? primeiro.substring(0, 497) + "…" : primeiro;
        String id = url.replaceFirst(".*/0/3/(\\d+)/.*", "$1");
        return Optional.of(new ConquistaOficial(id, titulo.text(), resumo, publicada, url.replaceAll("/$", ""), atletas(texto)));
    }

    private static LocalDate data(String texto) {
        var match = Pattern.compile("(\\d{1,2})\\s+(JAN|FEV|MAR|ABR|MAI|JUN|JUL|AGO|SET|OUT|NOV|DEZ)\\s+(20\\d{2})").matcher(texto.toUpperCase(Locale.ROOT));
        if (!match.find()) return null;
        try { return LocalDate.of(Integer.parseInt(match.group(3)), List.of("JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ").indexOf(match.group(2)) + 1, Integer.parseInt(match.group(1))); }
        catch (java.time.DateTimeException e) { return null; }
    }

    private static List<String> atletas(String texto) {
        String normal = normalizar(texto);
        // Apenas aliases confirmados: nomes novos permanecem no título oficial do card.
        var aliases = Map.of("raysa", "raysa mendonca|raysa raiane|raysa raiane silva mendonca",
                "juliana", "juliana da silva|juliana ribeiro da silva", "brunielle", "brunielle romero",
                "lucas", "lucas ribeiro|lucas vince ribeiro", "eduardo", "eduardo monteiro",
                "joao", "joao pedro", "richard", "richard gabriel", "raphael", "raphael assis");
        return aliases.entrySet().stream().filter(e -> Pattern.compile("\\b(?:" + e.getValue() + ")\\b").matcher(normal).find()).map(Map.Entry::getKey).sorted().toList();
    }
}
