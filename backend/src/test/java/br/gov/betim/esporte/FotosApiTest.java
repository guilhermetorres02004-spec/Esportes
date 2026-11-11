package br.gov.betim.esporte;

import br.gov.betim.esporte.service.FotosService;
import br.gov.betim.esporte.dto.FotoOficial;
import java.util.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = { "spring.datasource.url=jdbc:h2:mem:fotos_api_test;DB_CLOSE_DELAY=-1",
        "spring.jpa.hibernate.ddl-auto=create-drop", "spring.jpa.show-sql=false", "logging.level.root=WARN", "debug=false" })
@AutoConfigureMockMvc
class FotosApiTest {
    @Autowired MockMvc mvc;
    @MockBean FotosService fotos;
    @BeforeEach void preparar() {
        when(fotos.acervo()).thenReturn(new FotosService.Acervo(null, List.of()));
        when(fotos.status()).thenReturn(Map.of("totalFotos", 0, "automatico", true));
    }
    @Test void leituraPublicaSemLiberarAtualizacaoOuOutrosDados() throws Exception {
        mvc.perform(get("/api/fotos")).andExpect(status().isOk()).andExpect(jsonPath("$.fotos").isArray())
                .andExpect(header().string("Cache-Control", "no-store"));
        mvc.perform(get("/api/fotos/status")).andExpect(status().isOk()).andExpect(jsonPath("$.automatico").value(true));
        mvc.perform(post("/api/fotos/atualizar")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/inscricoes")).andExpect(status().isUnauthorized());
        verify(fotos, never()).solicitar();
    }
    @Test void administradorPodeSolicitarAtualizacao() throws Exception {
        when(fotos.solicitar()).thenReturn(true);
        var sessao = (org.springframework.mock.web.MockHttpSession) mvc.perform(post("/login")
                .param("username", "admin").param("password", "admin123"))
                .andExpect(status().isOk()).andReturn().getRequest().getSession(false);
        mvc.perform(post("/api/fotos/atualizar").session(sessao)).andExpect(status().isAccepted());
        verify(fotos).solicitar();
    }
    @Test void fotoDesconhecidaRetorna404() throws Exception {
        mvc.perform(get("/api/fotos/imagens/00000000000000000000000000000000")).andExpect(status().isNotFound());
    }
    @Test void vivaEsportePublicoLimitaCincoFotosSemRepeticoes() throws Exception {
        var itens = new ArrayList<FotoOficial>();
        itens.add(new FotoOficial("fora", "Futebol", "origem", "imagem", "/fora", "", List.of("futebol")));
        for (int i = 0; i < 7; i++) {
            var foto = new FotoOficial("foto" + i, "Atividade " + i, "origem", "imagem", "/foto" + i, "", List.of("atividades"));
            itens.add(foto); itens.add(foto);
        }
        when(fotos.acervo()).thenReturn(new FotosService.Acervo(null, itens));
        mvc.perform(get("/api/fotos/viva-esporte")).andExpect(status().isOk())
                .andExpect(header().string("Cache-Control", "no-store"))
                .andExpect(jsonPath("$.intervaloSegundos").value(9))
                .andExpect(jsonPath("$.fotos.length()").value(5))
                .andExpect(jsonPath("$.fotos[0].id").value("foto0"))
                .andExpect(jsonPath("$.fotos[4].id").value("foto4"));
    }
    @Test void vivaEsporteSemFotosRetornaListaVazia() throws Exception {
        mvc.perform(get("/api/fotos/viva-esporte")).andExpect(status().isOk())
                .andExpect(jsonPath("$.fotos").isEmpty()).andExpect(jsonPath("$.intervaloSegundos").value(9));
    }
}
