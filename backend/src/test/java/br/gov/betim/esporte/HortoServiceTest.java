package br.gov.betim.esporte;

import br.gov.betim.esporte.dto.ReservaHortoRequest;
import br.gov.betim.esporte.dto.ReservaHortoResponse;
import br.gov.betim.esporte.model.EsporteHorto;
import br.gov.betim.esporte.repository.ReservaHortoRepository;
import br.gov.betim.esporte.service.HortoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import static org.assertj.core.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:horto_test;DB_CLOSE_DELAY=-1",
        "spring.jpa.hibernate.ddl-auto=create-drop", "spring.jpa.show-sql=false",
        "debug=false", "logging.level.root=WARN"
})
@AutoConfigureMockMvc
class HortoServiceTest {
    @Autowired HortoService horto;
    @Autowired ReservaHortoRepository reservas;
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    private final LocalDate data = LocalDate.now(ZoneId.of("America/Sao_Paulo")).plusDays(10);

    @BeforeEach
    void limparReservasDeTeste() { reservas.deleteAll(); }

    private ReservaHortoRequest pedido(int quadra, LocalDate dia, int inicio, int fim) {
        return new ReservaHortoRequest(quadra, dia, inicio, fim, "Responsável de teste",
                quadra == 6 || quadra == 7 ? EsporteHorto.VOLEI_PRAIA : EsporteHorto.FUTSAL);
    }

    private void rejeita(ReservaHortoRequest pedido, int status) {
        assertThatThrownBy(() -> horto.reservar(pedido, "admin"))
                .isInstanceOfSatisfying(ResponseStatusException.class,
                        erro -> assertThat(erro.getStatusCode().value()).isEqualTo(status));
    }

    @Test
    void cadastraSeteQuadrasComDuasDeAreiaEUmaCoberta() {
        var quadras = horto.listarQuadras();
        assertThat(quadras).extracting("numero").containsExactly(1, 2, 3, 4, 5, 6, 7);
        assertThat(quadras.get(0).isCoberta()).isTrue();
        assertThat(quadras).filteredOn(quadra -> quadra.getTipo().equals("AREIA"))
                .extracting("numero").containsExactly(6, 7);
        assertThat(quadras.stream().filter(quadra -> quadra.isCoberta()).count()).isEqualTo(1);
    }

    @Test
    void impedeDuplicidadeESobreposicoes() {
        horto.reservar(pedido(1, data, 600, 720), "admin");
        for (int[] intervalo : List.of(new int[]{600, 720}, new int[]{600, 660},
                new int[]{540, 660}, new int[]{660, 780}, new int[]{540, 780})) {
            rejeita(pedido(1, data, intervalo[0], intervalo[1]), 409);
        }
        assertThat(reservas.count()).isEqualTo(1);
    }

    @Test
    void permitePeriodosConsecutivosOutrasQuadrasEOutrosDias() {
        horto.reservar(pedido(1, data, 600, 720), "admin");
        horto.reservar(pedido(1, data, 540, 600), "admin");
        horto.reservar(pedido(1, data, 720, 780), "admin");
        horto.reservar(pedido(2, data, 600, 720), "admin");
        horto.reservar(pedido(1, data.plusDays(1), 600, 720), "admin");
        assertThat(reservas.count()).isEqualTo(5);
        assertThat(horto.listarDia(data)).hasSize(4)
                .extracting(ReservaHortoResponse::inicioMinutos).containsExactly(540, 600, 600, 720);
    }

    @Test
    void exigeHorasInteirasMinimoUmaHoraEDataFutura() {
        for (int[] intervalo : List.of(new int[]{600, 630}, new int[]{630, 690},
                new int[]{600, 600}, new int[]{720, 600}, new int[]{-60, 60},
                new int[]{1380, 1500}, new int[]{Integer.MAX_VALUE, Integer.MIN_VALUE})) {
            rejeita(pedido(1, data, intervalo[0], intervalo[1]), 400);
        }
        rejeita(pedido(1, data.minusDays(11), 600, 660), 400);
        rejeita(new ReservaHortoRequest(1, null, 600, 660, "Pessoa", EsporteHorto.FUTSAL), 400);
        rejeita(new ReservaHortoRequest(1, data, 600, 660, "  ", EsporteHorto.FUTSAL), 400);
        rejeita(new ReservaHortoRequest(1, data, 600, 660, "A".repeat(121), EsporteHorto.FUTSAL), 400);
        rejeita(new ReservaHortoRequest(1, data, 600, 660, "Pessoa", null), 400);
        rejeita(pedido(8, data, 600, 660), 404);
        assertThat(reservas.count()).isZero();
        horto.reservar(pedido(1, data, 1380, 1440), "admin");
        assertThat(reservas.count()).isEqualTo(1);
    }

    @Test
    void quadrasDeAreiaRejeitamEsportesDePiso() {
        for (int quadra : List.of(6, 7)) {
            for (EsporteHorto esporte : EsporteHorto.values()) {
                if (esporte.getTipoQuadra().equals("AREIA")) continue;
                rejeita(new ReservaHortoRequest(quadra, data, 600, 660, "Pessoa", esporte), 400);
            }
        }
        assertThat(reservas.count()).isZero();
    }

    @Test
    void modalidadesDeAreiaSaoAceitasSomenteNasQuadrasDeAreia() {
        int inicio = 600;
        for (EsporteHorto esporte : List.of(EsporteHorto.VOLEI_PRAIA, EsporteHorto.FUTEVOLEI,
                EsporteHorto.BEACH_TENNIS, EsporteHorto.FUTEBOL_AREIA, EsporteHorto.HANDEBOL_AREIA)) {
            for (int quadra : List.of(6, 7)) {
                var reserva = horto.reservar(new ReservaHortoRequest(quadra, data, inicio,
                        inicio + 60, "Pessoa", esporte), "admin");
                assertThat(reserva.esporte()).isEqualTo(esporte);
            }
            for (int quadra : List.of(1, 2, 3, 4, 5)) {
                rejeita(new ReservaHortoRequest(quadra, data, inicio, inicio + 60, "Pessoa", esporte), 400);
            }
            inicio += 60;
        }
        assertThat(reservas.count()).isEqualTo(10);
    }

    @Test
    void preservaEsporteDeReservasAntigasNasQuadrasDeAreia() {
        var quadra = horto.listarQuadras().get(5);
        reservas.saveAndFlush(new br.gov.betim.esporte.model.ReservaHorto(
                quadra, data, 600, 660, "Pessoa", "admin", EsporteHorto.VOLEIBOL));
        assertThat(horto.listarDia(data)).extracting(ReservaHortoResponse::esporte)
                .containsExactly(EsporteHorto.VOLEIBOL);
    }

    @Test
    void quadrasDeAreiaAceitamReservasIndependentesEBloqueiamDuplicidade() {
        horto.reservar(pedido(6, data, 600, 660), "admin");
        horto.reservar(pedido(7, data, 600, 660), "admin");
        rejeita(pedido(6, data, 600, 660), 409);
        assertThat(horto.listarDia(data)).extracting(ReservaHortoResponse::quadra).containsExactly(6, 7);
    }

    @Test
    void rejeitaQualquerDataAnteriorAHojeSemGravarReserva() {
        LocalDate hoje = LocalDate.now(ZoneId.of("America/Sao_Paulo"));
        for (LocalDate passada : List.of(hoje.minusDays(1), hoje.minusMonths(1), hoje.minusYears(1))) {
            rejeita(pedido(1, passada, 600, 660), 400);
        }
        assertThat(reservas.count()).isZero();
    }

    @Test
    void confirmaSomenteUmaDeDuasReservasSimultaneas() throws Exception {
        var executor = Executors.newFixedThreadPool(2);
        var prontas = new CountDownLatch(2);
        var iniciar = new CountDownLatch(1);
        java.util.concurrent.Callable<Integer> reservar = () -> {
            prontas.countDown();
            if (!iniciar.await(5, TimeUnit.SECONDS)) throw new IllegalStateException("Timeout na largada");
            try { horto.reservar(pedido(3, data, 600, 720), "admin"); return 201; }
            catch (ResponseStatusException erro) { return erro.getStatusCode().value(); }
        };
        try {
            var primeira = executor.submit(reservar);
            var segunda = executor.submit(reservar);
            assertThat(prontas.await(5, TimeUnit.SECONDS)).isTrue();
            iniciar.countDown();
            assertThat(List.of(primeira.get(10, TimeUnit.SECONDS), segunda.get(10, TimeUnit.SECONDS)))
                    .containsExactlyInAnyOrder(201, 409);
            assertThat(reservas.count()).isEqualTo(1);
        } finally { executor.shutdownNow(); }
    }

    @Test
    void apiExigeAutenticacaoERegistraResponsavel() throws Exception {
        mvc.perform(get("/api/horto/quadras")).andExpect(status().isUnauthorized());
        mvc.perform(post("/api/horto/reservas").contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsBytes(pedido(1, data, 600, 660))))
                .andExpect(status().isUnauthorized());
        var acesso = mvc.perform(post("/login").param("username", "admin").param("password", "admin123"))
                .andExpect(status().isOk()).andReturn();
        var sessao = (MockHttpSession) acesso.getRequest().getSession(false);
        mvc.perform(post("/api/horto/reservas").session(sessao).contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsBytes(pedido(1, data, 600, 720))))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.quadra").value(1))
                .andExpect(jsonPath("$.responsavel").value("Responsável de teste"))
                .andExpect(jsonPath("$.esporte").value("FUTSAL"))
                .andExpect(jsonPath("$.agendadoPor").value("admin"))
                .andExpect(jsonPath("$.registradoEm").exists());
        mvc.perform(post("/api/horto/reservas").session(sessao).contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsBytes(pedido(1, data, 660, 780))))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.mensagem").isNotEmpty());
        mvc.perform(get("/api/horto/reservas").session(sessao).param("data", data.toString()))
                .andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].esporte").value("FUTSAL"));
        mvc.perform(post("/api/horto/reservas").session(sessao).contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsBytes(pedido(2, data.minusDays(11), 600, 660))))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.mensagem").isNotEmpty());
        mvc.perform(post("/api/horto/reservas").session(sessao).contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(pedido(2, data, 600, 660)).replace("FUTSAL", "INEXISTENTE")))
                .andExpect(status().isBadRequest());
        mvc.perform(get("/api/horto/esportes").session(sessao))
                .andExpect(status().isOk()).andExpect(jsonPath("$[0].codigo").value("FUTSAL"))
                .andExpect(jsonPath("$[0].tipoQuadra").value("QUADRA"))
                .andExpect(jsonPath("$[8].codigo").value("VOLEI_PRAIA"))
                .andExpect(jsonPath("$[8].tipoQuadra").value("AREIA"))
                .andExpect(jsonPath("$.length()").value(13));
        assertThat(reservas.count()).isEqualTo(1);
    }
}
