package br.gov.betim.esporte.service;

import br.gov.betim.esporte.dto.FotoOficial;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.text.Normalizer;
import java.util.*;
import org.jsoup.Jsoup;
import org.springframework.stereotype.Component;

@Component
public class FotosFonte {
    public static final String SITE = "https://www.betim.mg.gov.br";
    public List<FotoOficial> extrair(String html) {
        var fotos = new LinkedHashMap<String, FotoOficial>();
        for (var card : Jsoup.parse(html, SITE).select(".ntc_noticia")) {
            var link = card.parent(); var img = card.selectFirst(".ntc_area_img_noticia img[src]");
            var titulo = card.selectFirst(".ntc_titulo_noticia");
            if (link == null || img == null || titulo == null) continue;
            var descricao = card.selectFirst(".ntc_descricao_noticia");
            String assunto = normalizar(titulo.text() + " " + (descricao == null ? "" : descricao.text()));
            if (!assunto.matches(".*\\b(esport\\w*|atlet\\w*|futebol|futsal|vole\\w*|judo|pilates|natacao|taekwondo|basquet\\w*|handebol|ginastica|caminhada|corrida|campeonato|copa|jogos|karate|wrestling)\\b.*")) continue;
            String origem = link.absUrl("href"), imagem = img.absUrl("src");
            if (!permitida(origem, false) || !permitida(imagem, true)) continue;
            String id = id(imagem);
            var data = card.selectFirst(".ntc_data_completa_noticia");
            String publicacao = data == null ? "" : data.text();
            if (!publicacao.matches(".*\\b20\\d{2}\\b.*")) publicacao = ""; // Não armazenar datas relativas.
            fotos.putIfAbsent(id, new FotoOficial(id, titulo.text(), origem, imagem,
                    "/api/fotos/imagens/" + id, publicacao, categorias(titulo.text() + " " + img.attr("alt"))));
        }
        return List.copyOf(fotos.values());
    }

    public static boolean permitida(String url, boolean imagem) {
        try {
            URI uri = URI.create(url);
            return "https".equals(uri.getScheme()) && "www.betim.mg.gov.br".equals(uri.getHost())
                    && uri.getPort() == -1 && uri.getUserInfo() == null && uri.getQuery() == null
                    && uri.getPath().matches(imagem ? "/fotos/[a-zA-Z0-9_-]+\\.(?i:jpg|jpeg|png|webp)"
                    : "/portal/noticias/0/3/\\d+/[a-zA-Z0-9-]+/?");
        } catch (IllegalArgumentException e) { return false; }
    }
    static String id(String url) {
        try { return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(url.getBytes(StandardCharsets.UTF_8))).substring(0, 32); }
        catch (Exception e) { throw new IllegalStateException(e); }
    }
    public static List<String> categorias(String titulo) {
        String t = normalizar(titulo);
        var categorias = new ArrayList<String>(List.of("principal"));
        for (var regra : Map.ofEntries(Map.entry("futebol", "futebol|soccer"), Map.entry("futsal", "futsal"),
                Map.entry("volei", "volei|voleibol"), Map.entry("judo", "judo"), Map.entry("pilates", "pilates"),
                Map.entry("atletismo", "atletismo"), Map.entry("natacao", "natacao"), Map.entry("taekwondo", "taekwondo"),
                Map.entry("basquete", "basquete"), Map.entry("escola", "jogos escolares|\\bjeb\\b"),
                Map.entry("atividades", "viva o esporte|ginastica|pilates"), Map.entry("equipamentos", "equipamentos|materiais esportivos")).entrySet()) {
            if (java.util.regex.Pattern.compile(regra.getValue()).matcher(t).find()) categorias.add(regra.getKey());
        }
        return List.copyOf(categorias);
    }
    private static String normalizar(String texto) {
        return Normalizer.normalize(texto, Normalizer.Form.NFD).replaceAll("\\p{M}", "").toLowerCase(Locale.ROOT);
    }
}
