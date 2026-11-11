package br.gov.betim.esporte.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.nio.file.*;
import java.net.URI;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

@Service
public class RegionaisService {
    private final ObjectMapper json;
    private final Path arquivo;
    private volatile JsonNode catalogo;
    private static final Set<String> IDS = Set.of("centro", "norte", "alterosas", "ptb", "icaivera", "citrolandia", "imbirucu", "teresopolis", "petrovale", "vianopolis");
    public RegionaisService(ObjectMapper json, @Value("${app.regionais.dir:./data/regionais}") String pasta) throws IOException {
        this.json = json; arquivo = Path.of(pasta).resolve("catalogo.json");
        try (var stream = new ClassPathResource("regionais/catalogo.json").getInputStream()) { catalogo = json.readTree(stream); }
        if (Files.isRegularFile(arquivo)) { var salvo = json.readTree(arquivo.toFile()); validar(salvo); catalogo = salvo; }
    }
    public JsonNode listar() { return catalogo.deepCopy(); }
    public synchronized JsonNode salvar(JsonNode dados) throws IOException {
        validar(dados);
        Files.createDirectories(arquivo.getParent());
        var temporario = arquivo.resolveSibling("catalogo.tmp");
        json.writerWithDefaultPrettyPrinter().writeValue(temporario.toFile(), dados);
        try { Files.move(temporario, arquivo, StandardCopyOption.ATOMIC_MOVE, StandardCopyOption.REPLACE_EXISTING); }
        catch (AtomicMoveNotSupportedException e) { Files.move(temporario, arquivo, StandardCopyOption.REPLACE_EXISTING); }
        catalogo = dados.deepCopy(); return listar();
    }
    public static void validar(JsonNode dados) {
        exigir(dados != null && dados.isObject() && dados.path("versao").asInt() == 1, "Versão de catálogo inválida.");
        exigir(dados.path("regionais").isArray() && dados.path("regionais").size() == 10, "Informe as dez regionais.");
        var regionais = new HashSet<String>();
        for (var regional : dados.path("regionais")) {
            exigir(IDS.contains(regional.path("id").asText()) && regionais.add(regional.path("id").asText()), "Regional inválida ou repetida.");
            texto(regional, "nome"); fonte(regional.path("fonte").asText());
        }
        exigir(dados.path("limitesGeojson").isMissingNode() || dados.path("limitesGeojson").isNull(), "Limites territoriais dependem de integração oficial validada.");
        for (String grupo : List.of("equipamentos", "programas", "eventos")) {
            exigir(dados.path(grupo).isArray() && dados.path(grupo).size() <= 1000, "Lista inválida: " + grupo);
            var ids = new HashSet<String>();
            for (var item : dados.path(grupo)) {
                String id = item.path("id").asText();
                exigir(id.matches("[a-zA-Z0-9_-]{1,80}") && ids.add(id), "Identificador inválido ou duplicado.");
                texto(item, "nome"); fonte(item.path("fonte").asText());
                exigir(item.path("regionais").isArray() && !item.path("regionais").isEmpty(), "Vincule ao menos uma regional.");
                for (var regional : item.path("regionais")) exigir(IDS.contains(regional.asText()), "Vínculo regional inválido.");
                for (String campo : List.of("modalidades", "programas")) {
                    exigir(item.path(campo).isArray(), "Campo deve ser lista: " + campo);
                    for (var valor : item.path(campo)) exigir(valor.isTextual() && valor.asText().length() <= 200, "Valor inválido.");
                }
                for (String campo : List.of("bairro", "endereco", "tipo", "descricao", "horarios", "acessibilidade", "orientacao", "data"))
                    exigir(item.path(campo).isMissingNode() || item.path(campo).isNull() || (item.path(campo).isTextual() && item.path(campo).asText().length() <= 4000), "Texto inválido: " + campo);
                var foto = item.path("foto");
                exigir(foto.isMissingNode() || foto.isNull() || foto.asText().matches("/Imagens/regionais/[a-zA-Z0-9_-]+\\.(jpg|jpeg|png|webp)"), "Foto deve pertencer ao acervo local de regionais.");
                var coords = item.path("coordenadas");
                if (!coords.isMissingNode() && !coords.isNull()) {
                    exigir(coords.isArray() && coords.size() == 2 && coords.get(0).isNumber() && coords.get(1).isNumber()
                            && Math.abs(coords.get(0).asDouble()) <= 90 && Math.abs(coords.get(1).asDouble()) <= 180, "Coordenadas inválidas.");
                    fonte(item.path("fonteCoordenadas").asText());
                }
            }
        }
    }
    private static void texto(JsonNode node, String campo) { exigir(node.path(campo).isTextual() && !node.path(campo).asText().isBlank() && node.path(campo).asText().length() <= 500, "Texto obrigatório: " + campo); }
    private static void fonte(String valor) {
        try { var uri = URI.create(valor); exigir("https".equals(uri.getScheme()) && Set.of("www.betim.mg.gov.br", "betim.mg.gov.br", "regionais.betim.digital").contains(uri.getHost()) && uri.getUserInfo() == null && uri.getPort() == -1, "Fonte deve ser oficial de Betim."); }
        catch (IllegalArgumentException | NullPointerException e) { throw new IllegalArgumentException("Fonte deve ser oficial de Betim."); }
    }
    private static void exigir(boolean condicao, String mensagem) { if (!condicao) throw new IllegalArgumentException(mensagem); }
}
