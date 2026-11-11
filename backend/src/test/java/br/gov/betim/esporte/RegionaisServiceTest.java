package br.gov.betim.esporte;

import br.gov.betim.esporte.service.RegionaisService;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.node.*;
import java.nio.file.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import static org.assertj.core.api.Assertions.*;

class RegionaisServiceTest {
    @TempDir Path pasta;
    final ObjectMapper json = new ObjectMapper();
    @Test void catalogoOficialValidoEPersistenciaSemPerda() throws Exception {
        var service = new RegionaisService(json, pasta.toString());
        var inicial = service.listar();
        RegionaisService.validar(inicial);
        assertThat(inicial.path("regionais").size()).isEqualTo(10);
        service.salvar(inicial);
        var reiniciado = new RegionaisService(json, pasta.toString());
        assertThat(reiniciado.listar()).isEqualTo(inicial);
    }
    @Test void rejeitaDadosSemFonteOficialECoordenadasInvalidas() throws Exception {
        var service = new RegionaisService(json, pasta.toString());
        var dados = service.listar();
        ((ObjectNode) dados.path("equipamentos").get(0)).put("fonte", "https://exemplo.com");
        assertThatThrownBy(() -> service.salvar(dados)).isInstanceOf(IllegalArgumentException.class);
        var coords = service.listar();
        ((ObjectNode) coords.path("equipamentos").get(0)).set("coordenadas", json.readTree("[999, 0]"));
        assertThatThrownBy(() -> service.salvar(coords)).isInstanceOf(IllegalArgumentException.class);
        assertThat(service.listar().path("equipamentos").get(0).path("fonte").asText()).startsWith("https://regionais.betim.digital/");
    }
    @Test void rejeitaRegionalDesconhecidaEImagemExterna() throws Exception {
        var service = new RegionaisService(json, pasta.toString());
        var dados = service.listar();
        ((ArrayNode) dados.path("equipamentos").get(0).path("regionais")).add("inexistente");
        assertThatThrownBy(() -> service.salvar(dados)).isInstanceOf(IllegalArgumentException.class);
        var imagem = service.listar();
        ((ObjectNode) imagem.path("equipamentos").get(0)).put("foto", "https://placehold.co/600x400");
        assertThatThrownBy(() -> service.salvar(imagem)).isInstanceOf(IllegalArgumentException.class);
    }
}
