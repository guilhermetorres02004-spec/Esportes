package br.gov.betim.esporte.controller;

import br.gov.betim.esporte.service.FotosService;
import java.nio.file.Files;
import java.time.Duration;
import java.util.Map;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fotos")
public class FotosController {
    private final FotosService fotos;
    public FotosController(FotosService fotos) { this.fotos = fotos; }
    @GetMapping public ResponseEntity<FotosService.Acervo> listar() {
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(fotos.acervo());
    }
    @GetMapping("/status") public Map<String, Object> status() { return fotos.status(); }
    @PostMapping("/atualizar") public ResponseEntity<Map<String, String>> atualizar() {
        boolean iniciada = fotos.solicitar();
        return ResponseEntity.accepted().body(Map.of("mensagem", iniciada ? "Atualização iniciada." : "Atualização já em andamento."));
    }
    @GetMapping("/imagens/{id}") public ResponseEntity<?> imagem(@PathVariable String id) throws java.io.IOException {
        var arquivo = fotos.imagem(id);
        if (arquivo == null) return ResponseEntity.notFound().build();
        byte[] inicio;
        try (var stream = Files.newInputStream(arquivo)) { inicio = stream.readNBytes(12); }
        String tipo = inicio.length >= 2 && inicio[0] == (byte) 0xff && inicio[1] == (byte) 0xd8 ? "image/jpeg"
                : inicio.length >= 4 && inicio[0] == (byte) 0x89 && inicio[1] == 'P' ? "image/png" : "image/webp";
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(tipo))
                .cacheControl(CacheControl.maxAge(Duration.ofDays(30)).cachePublic())
                .header("X-Content-Type-Options", "nosniff").body(new FileSystemResource(arquivo));
    }
}
