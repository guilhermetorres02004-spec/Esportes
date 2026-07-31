package br.gov.betim.esporte.controller;

import br.gov.betim.esporte.dto.InscricaoRequest;
import br.gov.betim.esporte.model.Inscricao;
import br.gov.betim.esporte.service.InscricaoService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/inscricoes")
public class InscricaoController {

    private final InscricaoService inscricaoService;

    public InscricaoController(InscricaoService inscricaoService) {
        this.inscricaoService = inscricaoService;
    }

    @GetMapping
    public List<Inscricao> listar() {
        return inscricaoService.listar();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Inscricao criar(@RequestBody InscricaoRequest request) {
        return inscricaoService.criar(request);
    }
}
