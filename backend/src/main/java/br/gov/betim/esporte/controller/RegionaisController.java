package br.gov.betim.esporte.controller;

import br.gov.betim.esporte.service.RegionaisService;
import com.fasterxml.jackson.databind.JsonNode;
import java.io.IOException;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/regionais/catalogo")
public class RegionaisController {
    private final RegionaisService service;
    public RegionaisController(RegionaisService service) { this.service = service; }
    @GetMapping public ResponseEntity<JsonNode> listar() { return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(service.listar()); }
    @PostMapping public JsonNode salvar(@RequestBody JsonNode dados) throws IOException {
        try { return service.salvar(dados); }
        catch (IllegalArgumentException e) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage()); }
    }
}
