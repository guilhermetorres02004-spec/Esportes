package br.gov.betim.esporte.controller;

import br.gov.betim.esporte.dto.SuporteRequest;
import br.gov.betim.esporte.dto.SuporteResponse;
import br.gov.betim.esporte.service.SuporteService;
import jakarta.servlet.http.HttpSession;
import java.util.Map;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/suporte")
public class SuporteController {
    private final SuporteService suporte;
    public SuporteController(SuporteService suporte) { this.suporte = suporte; }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> status() {
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(suporte.status());
    }

    @PostMapping("/mensagens")
    public ResponseEntity<SuporteResponse> responder(@RequestBody SuporteRequest pedido, HttpSession sessao) {
        limitar(sessao);
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(suporte.responder(pedido));
    }

    private void limitar(HttpSession sessao) {
        synchronized (sessao) {
            long agora = System.currentTimeMillis();
            Long inicio = (Long) sessao.getAttribute("suporte.inicio");
            if (inicio == null || agora - inicio >= 60_000) {
                sessao.setAttribute("suporte.inicio", agora);
                sessao.setAttribute("suporte.total", 0);
            }
            int total = (int) sessao.getAttribute("suporte.total");
            if (total >= 15) throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    "Aguarde um minuto antes de enviar mais perguntas.");
            sessao.setAttribute("suporte.total", total + 1);
        }
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> erro(ResponseStatusException e) {
        var resposta = ResponseEntity.status(e.getStatusCode()).cacheControl(CacheControl.noStore());
        if (e.getStatusCode().value() == 429) resposta.header("Retry-After", "60");
        return resposta.body(Map.of("mensagem", e.getReason()));
    }
}
