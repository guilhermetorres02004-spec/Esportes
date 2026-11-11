package br.gov.betim.esporte;

import br.gov.betim.esporte.service.RegionaisService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {"spring.datasource.url=jdbc:h2:mem:regionais_api_test;DB_CLOSE_DELAY=-1", "spring.jpa.hibernate.ddl-auto=create-drop", "logging.level.root=WARN", "debug=false"})
@AutoConfigureMockMvc
class RegionaisApiTest {
    @Autowired MockMvc mvc;
    @MockBean RegionaisService service;
    @Test void leituraPublicaEAtualizacaoProtegida() throws Exception {
        when(service.listar()).thenReturn(new ObjectMapper().readTree("{\"versao\":1,\"regionais\":[]}"));
        mvc.perform(get("/api/regionais/catalogo")).andExpect(status().isOk()).andExpect(jsonPath("$.versao").value(1));
        mvc.perform(post("/api/regionais/catalogo").contentType("application/json").content("{}")) .andExpect(status().isUnauthorized());
        verify(service, never()).salvar(any());
    }
    @Test void adminPodeEditarMasDadosInvalidosRetornam400() throws Exception {
        var sessao = (org.springframework.mock.web.MockHttpSession) mvc.perform(post("/login").param("username", "admin").param("password", "admin123"))
                .andExpect(status().isOk()).andReturn().getRequest().getSession(false);
        when(service.salvar(any())).thenReturn(new ObjectMapper().readTree("{\"versao\":1}"));
        mvc.perform(post("/api/regionais/catalogo").session(sessao).contentType("application/json").content("{}")) .andExpect(status().isOk());
        when(service.salvar(any())).thenThrow(new IllegalArgumentException("Dados inválidos"));
        mvc.perform(post("/api/regionais/catalogo").session(sessao).contentType("application/json").content("{}")) .andExpect(status().isBadRequest());
    }
}
