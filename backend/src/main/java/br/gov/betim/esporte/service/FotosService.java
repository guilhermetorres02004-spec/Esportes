package br.gov.betim.esporte.service;

import br.gov.betim.esporte.dto.FotoOficial;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PreDestroy;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.context.ServletWebServerInitializedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

@Service
public class FotosService {
    public record Acervo(Instant atualizadoEm, List<FotoOficial> fotos) {}
    private final ObjectMapper json;
    private final FotosFonte fonte;
    private final FotosHttp http;
    private final Path pasta;
    private final boolean habilitado;
    private final long intervalo;
    private final AtomicBoolean ocupada = new AtomicBoolean();
    private final ScheduledExecutorService tarefas = Executors.newSingleThreadScheduledExecutor(r -> {
        var thread = new Thread(r, "fotos-oficiais"); thread.setDaemon(true); return thread;
    });
    private volatile Acervo acervo = new Acervo(null, List.of());
    private volatile Instant tentativa;
    private volatile String aviso = "Aguardando primeira sincronização.";

    public FotosService(ObjectMapper json, FotosFonte fonte, FotosHttp http,
            @Value("${app.fotos.dir:./data/fotos-oficiais}") String pasta,
            @Value("${app.fotos.habilitado:true}") boolean habilitado,
            @Value("${app.fotos.intervalo-segundos:7200}") long intervalo) throws java.io.IOException {
        this.json = json; this.fonte = fonte; this.http = http; this.pasta = Path.of(pasta).toAbsolutePath().normalize();
        this.habilitado = habilitado; this.intervalo = Math.max(300, intervalo);
        Files.createDirectories(this.pasta);
        try {
            var salvo = json.readValue(this.pasta.resolve("acervo.json").toFile(), Acervo.class);
            if (salvo != null && salvo.fotos() != null) acervo = salvo;
        }
        catch (Exception ignored) { /* Sem cache: mantém as fotos originais até sincronizar. */ }
    }

    @EventListener
    public void iniciar(ServletWebServerInitializedEvent evento) {
        if (habilitado) tarefas.scheduleWithFixedDelay(this::sincronizar, 5, intervalo, TimeUnit.SECONDS);
    }
    @PreDestroy public void encerrar() { tarefas.shutdownNow(); }
    public Acervo acervo() { return acervo; }
    public Map<String, Object> status() {
        var resultado = new LinkedHashMap<String, Object>();
        resultado.put("automatico", habilitado); resultado.put("intervaloSegundos", intervalo);
        resultado.put("atualizando", ocupada.get()); resultado.put("ultimaTentativa", tentativa);
        resultado.put("atualizadoEm", acervo.atualizadoEm()); resultado.put("totalFotos", acervo.fotos().size());
        resultado.put("aviso", aviso);
        return resultado;
    }
    public boolean solicitar() {
        if (!ocupada.compareAndSet(false, true)) return false;
        tarefas.execute(() -> { try { atualizar(); } finally { ocupada.set(false); } });
        return true;
    }
    public void sincronizar() {
        if (!ocupada.compareAndSet(false, true)) return;
        try { atualizar(); } finally { ocupada.set(false); }
    }
    public Path imagem(String id) {
        if (!id.matches("[a-f0-9]{32}") || acervo.fotos().stream().noneMatch(f -> f.id().equals(id))) return null;
        Path imagem = pasta.resolve(id);
        return Files.isRegularFile(imagem) ? imagem : null;
    }

    private void atualizar() {
        tentativa = Instant.now();
        var candidatas = new LinkedHashMap<String, FotoOficial>();
        int falhas = 0;
        for (String caminho : List.of("/portal/noticias/3/1/18/0/0/0", "/portal/noticias/3/2/18/0/0/0",
                "/portal/noticias/3/1/18/0/0/futebol", "/portal/noticias/3/1/18/0/0/voleibol",
                "/portal/noticias/3/1/18/0/0/jud%C3%B4", "/portal/noticias/3/1/18/0/0/pilates")) {
            if (Thread.currentThread().isInterrupted()) return;
            try {
                String html = new String(http.baixar(FotosFonte.SITE + caminho, 2_000_000), StandardCharsets.UTF_8);
                var extraidas = fonte.extrair(html);
                if (extraidas.isEmpty()) falhas++;
                extraidas.forEach(f -> candidatas.putIfAbsent(f.id(), f));
            } catch (Exception e) { falhas++; }
        }
        var validas = new LinkedHashMap<String, FotoOficial>();
        var contagem = new HashMap<String, Integer>();
        // IDs de notícia crescentes priorizam publicações recentes, inclusive nas buscas por modalidade.
        var ordenadas = candidatas.values().stream().sorted(Comparator.comparingLong(FotosService::numeroNoticia).reversed()).toList();
        for (FotoOficial foto : ordenadas) {
            if (foto.categorias().stream().noneMatch(c -> contagem.getOrDefault(c, 0) < (c.equals("principal") ? 12 : 6))) continue;
            try {
                Path arquivo = pasta.resolve(foto.id());
                if (!Files.isRegularFile(arquivo)) {
                    byte[] dados = http.baixar(foto.imagemOriginal(), 10_000_000);
                    FotosHttp.validarImagem(dados);
                    gravar(arquivo, dados);
                }
                validas.put(foto.id(), foto);
                foto.categorias().forEach(c -> contagem.merge(c, 1, Integer::sum));
            } catch (Exception e) { falhas++; }
        }
        publicar(validas, contagem, falhas);
    }

    private void publicar(Map<String, FotoOficial> validas, Map<String, Integer> contagem, int falhas) {
        if (validas.isEmpty()) { aviso = "Não foi possível consultar novas fotos. Último acervo preservado."; return; }
        for (FotoOficial antiga : acervo.fotos()) {
            if (antiga.categorias().stream().anyMatch(c -> contagem.getOrDefault(c, 0) < (c.equals("principal") ? 12 : 6))
                    && !validas.containsKey(antiga.id()) && Files.isRegularFile(pasta.resolve(antiga.id()))) {
                validas.put(antiga.id(), antiga); antiga.categorias().forEach(c -> contagem.merge(c, 1, Integer::sum));
            }
        }
        try {
            var novo = new Acervo(Instant.now(), List.copyOf(validas.values()));
            gravar(pasta.resolve("acervo.json"), json.writeValueAsBytes(novo));
            acervo = novo;
            aviso = falhas == 0 ? "Fontes oficiais consultadas com sucesso." : "Atualização parcial; fotos anteriores preservadas quando necessário.";
            LoggerFactory.getLogger(getClass()).info("Acervo oficial atualizado: {} fotos, {} fontes/arquivos indisponíveis.", validas.size(), falhas);
        } catch (Exception e) { aviso = "Não foi possível salvar a atualização. Último acervo preservado."; }
    }
    private static long numeroNoticia(FotoOficial foto) {
        try { return Long.parseLong(foto.origem().split("/")[7]); }
        catch (Exception e) { return 0; }
    }
    private static void gravar(Path destino, byte[] dados) throws java.io.IOException {
        Path temporario = destino.resolveSibling(destino.getFileName() + ".tmp");
        Files.write(temporario, dados);
        try { Files.move(temporario, destino, StandardCopyOption.ATOMIC_MOVE, StandardCopyOption.REPLACE_EXISTING); }
        catch (AtomicMoveNotSupportedException e) { Files.move(temporario, destino, StandardCopyOption.REPLACE_EXISTING); }
    }
}
