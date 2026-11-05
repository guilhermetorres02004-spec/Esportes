package br.gov.betim.esporte;

import br.gov.betim.esporte.service.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.file.*;
import java.io.*;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.io.TempDir;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;

class FotosServiceTest {
    @TempDir Path pasta;
    final FotosFonte fonte = new FotosFonte();
    final ObjectMapper json = new ObjectMapper().findAndRegisterModules();
    final FotosHttp http = mock(FotosHttp.class);
    FotosService servico;
    static String card(int numero, String titulo, String imagem) {
        return "<a href='/portal/noticias/0/3/" + numero + "/titulo/'><div class='ntc_noticia'>"
                + "<div class='ntc_area_img_noticia'><img src='" + imagem + "'><img src='" + imagem + "'></div>"
                + "<div class='ntc_data_completa_noticia'>01 NOV 2026</div><div class='ntc_titulo_noticia'>"
                + titulo + "</div></div></a>";
    }
    @BeforeEach void iniciar() throws Exception {
        servico = new FotosService(json, fonte, http, pasta.toString(), false, 3600);
        var bytes = new ByteArrayOutputStream();
        ImageIO.write(new BufferedImage(100, 100, BufferedImage.TYPE_INT_RGB), "jpg", bytes);
        when(http.baixar(contains("/fotos/"), anyInt())).thenReturn(bytes.toByteArray());
        when(http.baixar(contains("/portal/"), anyInt())).thenReturn((card(100, "Futebol de Betim", "/fotos/a.jpg")
                + card(200, "Judô de Betim", "/fotos/b.jpg")).getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }
    @AfterEach void encerrar() { servico.encerrar(); }

    @Test void baixaFotosValidasOrdenaPorNoticiaEPreservaCacheEntreReinicios() throws Exception {
        servico.sincronizar();
        var acervo = servico.acervo();
        assertThat(acervo.fotos()).hasSize(2);
        assertThat(acervo.fotos().get(0).titulo()).contains("Judô");
        assertThat(servico.imagem(acervo.fotos().get(0).id())).exists();
        assertThat(acervo.fotos().get(1).categorias()).contains("futebol").doesNotContain("judo");
        try (var outra = new AutoCloseable() {
            final FotosService instancia = new FotosService(json, fonte, http, pasta.toString(), false, 3600);
            public void close() { instancia.encerrar(); }
        }) { assertThat(outra.instancia.acervo().fotos()).hasSize(2); }
        verify(http, times(1)).baixar("https://www.betim.mg.gov.br/fotos/a.jpg", 10_000_000);
    }
    @Test void indisponibilidadeNaoApagaFotosEBaseAnterior() throws Exception {
        servico.sincronizar(); var anterior = servico.acervo();
        when(http.baixar(contains("/portal/"), anyInt())).thenThrow(new IOException("offline"));
        servico.sincronizar();
        assertThat(servico.acervo()).isEqualTo(anterior);
        assertThat(servico.status().get("aviso").toString()).contains("preservado");
    }
    @Test void fonteNaoMisturaModalidadesNemAceitaUrlsExternas() {
        assertThat(FotosFonte.categorias("Final de futsal")).contains("futsal").doesNotContain("futebol", "pilates");
        assertThat(FotosFonte.categorias("Viva o Esporte")).doesNotContain("pilates");
        assertThat(fonte.extrair(card(1, "Teste", "https://exemplo.com/fotos/a.jpg"))).isEmpty();
        for (String url : new String[]{"http://www.betim.mg.gov.br/fotos/a.jpg", "https://localhost/fotos/a.jpg", "https://www.betim.mg.gov.br:8080/fotos/a.jpg"})
            assertThat(FotosFonte.permitida(url, true)).isFalse();
    }
    @Test void noticiaGeralComEtiquetaEsportesNaoEntraSemAssuntoEsportivo() {
        assertThat(fonte.extrair(card(300, "Investimentos contra impactos do El Niño", "/fotos/clima.jpg"))).isEmpty();
    }
    @Test void rejeitaImagemCorrompidaENaoServeCaminhosArbitrarios() throws Exception {
        when(http.baixar(contains("/fotos/"), anyInt())).thenReturn("invalido".getBytes());
        servico.sincronizar();
        assertThat(servico.acervo().fotos()).isEmpty();
        assertThat(servico.imagem("../acervo.json")).isNull();
    }
}
