package br.gov.betim.esporte.controller;

import br.gov.betim.esporte.model.LocalEsportivo;
import br.gov.betim.esporte.repository.LocalEsportivoRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/locais-esportivos")
public class LocalEsportivoController {

    private final LocalEsportivoRepository localEsportivoRepository;

    public LocalEsportivoController(LocalEsportivoRepository localEsportivoRepository) {
        this.localEsportivoRepository = localEsportivoRepository;
    }

    @GetMapping
    public List<LocalEsportivo> listar() {
        return localEsportivoRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LocalEsportivo criar(@RequestBody LocalEsportivo localEsportivo) {
        return localEsportivoRepository.save(localEsportivo);
    }
}
