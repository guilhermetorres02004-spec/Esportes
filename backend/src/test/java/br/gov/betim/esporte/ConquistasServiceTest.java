package br.gov.betim.esporte;

import br.gov.betim.esporte.service.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class ConquistasServiceTest {
    @TempDir Path pasta;
    private static final String URL = "https://www.betim.mg.gov.br/portal/noticias/0/3/15571/betim-conquista-medalhas";
    private static final String LISTA = "<a href='" + URL + "'><div class='ntc_noticia'><div class='ntc_titulo_noticia'>Betim conquista medalhas no atletismo</div></div></a>";
    private static final String NOTICIA = "<div class='ntc_area_titulo_noticia'><div class='ntc_titulo_noticia'>Betim conquista medalhas no atletismo</div><div class='ntc_data_noticia'>07 SET 2026</div></div><div class='ntc_area_texto_noticia'><p>Raysa Raiane Silva Mendonça conquistou duas medalhas de ouro no campeonato de atletismo.</p></div>";
    private final ConquistasFonte fonte = new ConquistasFonte();

    @Test void extraiSomenteResultadosComDataEOrigemOficial() {
        assertEquals(1, fonte.links(LISTA + LISTA).size());
        assertTrue(fonte.links(LISTA.replace("Betim conquista medalhas no atletismo", "Betim vai disputar medalhas no atletismo")).isEmpty());
        assertTrue(fonte.links(LISTA.replace("www.betim.mg.gov.br", "outro.example")).isEmpty());
        var conquista = fonte.extrair(URL, NOTICIA).orElseThrow();
        assertEquals("15571", conquista.id()); assertEquals(2026, conquista.publicadoEm().getYear());
        assertEquals(java.util.List.of("raysa"), conquista.atletas());
        assertTrue(fonte.extrair(URL, NOTICIA.replace("07 SET 2026", "Há 2 dias")).isEmpty());
        assertTrue(fonte.extrair(URL, NOTICIA.replace("07 SET 2026", "07 SET 2099")).isEmpty());
        assertTrue(fonte.extrair(URL, NOTICIA.replace("07 SET 2026", "31 FEV 2026")).isEmpty());
        assertTrue(fonte.extrair("https://outro.example/noticia", NOTICIA).isEmpty());
        assertTrue(fonte.extrair(URL, "<html>Layout alterado</html>").isEmpty());
    }

    @Test void naoAssociaNomesParciaisOuInventados() {
        var noticia = NOTICIA.replace("Raysa Raiane Silva Mendonça", "Uma nova atleta");
        assertTrue(fonte.extrair(URL, noticia).orElseThrow().atletas().isEmpty());
    }

    @Test void sincronizaSemDuplicarPersisteEConservaHistoricoQuandoFonteFalha() throws Exception {
        var http = mock(FotosHttp.class);
        when(http.baixar(anyString(), anyInt())).thenAnswer(i -> {
            String url = i.getArgument(0);
            return (url.contains("/noticias/3/") ? LISTA : NOTICIA).getBytes(StandardCharsets.UTF_8);
        });
        var mapper = new ObjectMapper().findAndRegisterModules();
        var service = new ConquistasService(mapper, http, fonte, pasta.toString(), false, 3600);
        try {
            service.sincronizar(); service.sincronizar();
            assertEquals(1, service.acervo().conquistas().size());
            assertNotNull(service.acervo().atualizadoEm());
            var recarregado = new ConquistasService(mapper, http, fonte, pasta.toString(), false, 3600);
            try { assertEquals(service.acervo(), recarregado.acervo()); } finally { recarregado.encerrar(); }
            var antes = service.acervo();
            when(http.baixar(anyString(), anyInt())).thenThrow(new java.io.IOException("offline"));
            service.sincronizar();
            assertEquals(antes, service.acervo());
            assertEquals(false, service.status().get("atualizando"));
            assertTrue(service.status().get("aviso").toString().contains("preservado"));
        } finally { service.encerrar(); }
    }
}
