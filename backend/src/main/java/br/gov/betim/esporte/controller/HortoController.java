package br.gov.betim.esporte.controller;

import br.gov.betim.esporte.dto.ReservaHortoRequest;
import br.gov.betim.esporte.dto.ReservaHortoResponse;
import br.gov.betim.esporte.model.QuadraHorto;
import br.gov.betim.esporte.model.EsporteHorto;
import br.gov.betim.esporte.service.HortoService;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/horto")
public class HortoController {
    private final HortoService horto;

    public HortoController(HortoService horto) { this.horto = horto; }

    @GetMapping("/quadras")
    public List<QuadraHorto> quadras() { return horto.listarQuadras(); }

    @GetMapping("/esportes")
    public List<Map<String, String>> esportes() {
        return java.util.Arrays.stream(EsporteHorto.values())
                .map(esporte -> Map.of("codigo", esporte.name(), "nome", esporte.getNome())).toList();
    }

    @GetMapping("/reservas")
    public List<ReservaHortoResponse> reservas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        return horto.listarDia(data);
    }

    @PostMapping("/reservas")
    @ResponseStatus(HttpStatus.CREATED)
    public ReservaHortoResponse reservar(@RequestBody ReservaHortoRequest pedido, Principal usuario) {
        return horto.reservar(pedido, usuario.getName());
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> erro(ResponseStatusException erro) {
        return ResponseEntity.status(erro.getStatusCode()).body(Map.of("mensagem", erro.getReason()));
    }
}
