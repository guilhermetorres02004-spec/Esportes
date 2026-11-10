package br.gov.betim.esporte.service;

import br.gov.betim.esporte.dto.ConquistaOficial;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PreDestroy;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.context.ServletWebServerInitializedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

@Service
public class ConquistasService {
    public record Acervo(Instant atualizadoEm, List<ConquistaOficial> conquistas) {}
    private final ObjectMapper json;
    private final FotosHttp http;
    private final ConquistasFonte fonte;
    private final Path pasta;
    private final boolean habilitado;
    private final long intervalo;
    private final AtomicBoolean ocupada = new AtomicBoolean();
    private final ScheduledExecutorService tarefas = Executors.newSingleThreadScheduledExecutor(r -> {
        var t = new Thread(r, "conquistas-oficiais"); t.setDaemon(true); return t;
    });
    private volatile Acervo acervo = new Acervo(null, List.of());
    private volatile Instant tentativa;
    private volatile String aviso = "Aguardando consulta às notícias oficiais.";

    public ConquistasService(ObjectMapper json, FotosHttp http, ConquistasFonte fonte,
            @Value("${app.conquistas.dir:./data/conquistas-oficiais}") String pasta,
            @Value("${app.conquistas.habilitado:true}") boolean habilitado,
            @Value("${app.conquistas.intervalo-segundos:3600}") long intervalo) throws java.io.IOException {
        this.json = json; this.http = http; this.fonte = fonte;
        this.pasta = Path.of(pasta).toAbsolutePath().normalize();
        this.habilitado = habilitado; this.intervalo = Math.max(300, intervalo);
        Files.createDirectories(this.pasta);
        try {
            var salvo = json.readValue(this.pasta.resolve("acervo.json").toFile(), Acervo.class);
            if (salvo != null && salvo.conquistas() != null) {
                acervo = new Acervo(salvo.atualizadoEm(), salvo.conquistas().stream().filter(c ->
                        c.id() != null && c.titulo() != null && c.resumo() != null && c.publicadoEm() != null
                        && c.atletas() != null && FotosFonte.permitida(c.fonte(), false)).toList());
                aviso = "Histórico recuperado. Aguardando próxima consulta.";
            }
        } catch (Exception ignored) { /* Primeira execução ou cache inválido: preserva conteúdo estático no portal. */ }
    }

    @EventListener public void iniciar(ServletWebServerInitializedEvent evento) {
        if (habilitado) tarefas.scheduleWithFixedDelay(this::sincronizar, 5, intervalo, TimeUnit.SECONDS);
    }
    @PreDestroy public void encerrar() { tarefas.shutdownNow(); }
    public Acervo acervo() { return acervo; }
    public Map<String, Object> status() {
        var status = new LinkedHashMap<String, Object>();
        status.put("automatico", habilitado); status.put("intervaloSegundos", intervalo);
        status.put("atualizando", ocupada.get()); status.put("ultimaTentativa", tentativa);
        status.put("atualizadoEm", acervo.atualizadoEm()); status.put("totalConquistas", acervo.conquistas().size());
        status.put("aviso", aviso); return status;
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
    private String baixar(String url) throws Exception {
        return new String(http.baixar(url, 2_000_000), StandardCharsets.UTF_8);
    }

    private void atualizar() {
        tentativa = Instant.now();
        try {
            var links = new LinkedHashSet<String>();
            int paginas = 0, falhas = 0, lidas = 0;
            for (int pagina = 1; pagina <= 3; pagina++) {
                if (Thread.currentThread().isInterrupted()) return;
                try {
                    String html = baixar(FotosFonte.SITE + "/portal/noticias/3/" + pagina + "/18/0/0/0");
                    if (!html.contains("ntc_noticia")) { falhas++; continue; }
                    links.addAll(fonte.links(html)); paginas++;
                } catch (Exception e) { falhas++; }
            }
            if (paginas == 0) { aviso = "Fonte oficial indisponível. Histórico preservado."; return; }
            var registros = new LinkedHashMap<String, ConquistaOficial>();
            acervo.conquistas().forEach(c -> registros.put(c.id(), c));
            for (String link : links.stream().limit(24).toList()) {
                if (Thread.currentThread().isInterrupted()) return;
                try {
                    var conquista = fonte.extrair(link, baixar(link));
                    if (conquista.isPresent()) { registros.put(conquista.get().id(), conquista.get()); lidas++; }
                    else falhas++;
                } catch (Exception e) { falhas++; }
            }
            if (!links.isEmpty() && lidas == 0) { aviso = "Não foi possível validar as notícias. Histórico preservado."; return; }
            var lista = registros.values().stream().sorted(Comparator.comparing(ConquistaOficial::publicadoEm).reversed()
                    .thenComparing(ConquistaOficial::id, Comparator.reverseOrder())).toList();
            var novo = new Acervo(Instant.now(), lista);
            var temporario = pasta.resolve("acervo.tmp");
            json.writeValue(temporario.toFile(), novo);
            try { Files.move(temporario, pasta.resolve("acervo.json"), StandardCopyOption.ATOMIC_MOVE, StandardCopyOption.REPLACE_EXISTING); }
            catch (AtomicMoveNotSupportedException e) { Files.move(temporario, pasta.resolve("acervo.json"), StandardCopyOption.REPLACE_EXISTING); }
            acervo = novo;
            aviso = falhas == 0 ? "Consulta oficial concluída." : "Consulta parcial. Registros anteriores preservados.";
        } catch (Exception e) {
            aviso = "Falha na atualização. Histórico preservado.";
            org.slf4j.LoggerFactory.getLogger(getClass()).warn("Falha ao sincronizar conquistas: {}", e.getClass().getSimpleName());
        }
    }
}
