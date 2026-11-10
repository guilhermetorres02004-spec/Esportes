package br.gov.betim.esporte.controller;

import br.gov.betim.esporte.service.ConquistasService;
import java.util.Map;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/conquistas")
public class ConquistasController {
    private final ConquistasService conquistas;
    public ConquistasController(ConquistasService conquistas) { this.conquistas = conquistas; }
    @GetMapping public ResponseEntity<ConquistasService.Acervo> listar() {
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(conquistas.acervo());
    }
    @GetMapping("/status") public Map<String, Object> status() { return conquistas.status(); }
    @PostMapping("/atualizar") public ResponseEntity<Map<String, String>> atualizar() {
        boolean iniciada = conquistas.solicitar();
        return ResponseEntity.accepted().body(Map.of("mensagem", iniciada ? "Consulta iniciada." : "Consulta já em andamento."));
    }
}
