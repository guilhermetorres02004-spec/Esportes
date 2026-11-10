package br.gov.betim.esporte;

import br.gov.betim.esporte.service.ConquistasService;
import java.util.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = { "spring.datasource.url=jdbc:h2:mem:conquistas_api_test;DB_CLOSE_DELAY=-1",
    "spring.jpa.hibernate.ddl-auto=create-drop", "spring.jpa.show-sql=false", "logging.level.root=WARN", "debug=false" })
@AutoConfigureMockMvc
class ConquistasApiTest {
    @Autowired MockMvc mvc;
    @MockBean ConquistasService conquistas;
    @Test void leituraPublicaNaoLiberaAtualizacao() throws Exception {
        when(conquistas.acervo()).thenReturn(new ConquistasService.Acervo(null, List.of()));
        when(conquistas.status()).thenReturn(Map.of("automatico", true));
        mvc.perform(get("/api/conquistas")).andExpect(status().isOk()).andExpect(jsonPath("$.conquistas").isArray())
                .andExpect(header().string("Cache-Control", "no-store"));
        mvc.perform(get("/api/conquistas/status")).andExpect(status().isOk());
        mvc.perform(post("/api/conquistas/atualizar")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/inscricoes")).andExpect(status().isUnauthorized());
        verify(conquistas, never()).solicitar();
    }
    @Test void administradorPodeSolicitarBusca() throws Exception {
        when(conquistas.solicitar()).thenReturn(true);
        var sessao = (org.springframework.mock.web.MockHttpSession) mvc.perform(post("/login")
                .param("username", "admin").param("password", "admin123"))
                .andExpect(status().isOk()).andReturn().getRequest().getSession(false);
        mvc.perform(post("/api/conquistas/atualizar").session(sessao)).andExpect(status().isAccepted());
        verify(conquistas).solicitar();
    }
}
