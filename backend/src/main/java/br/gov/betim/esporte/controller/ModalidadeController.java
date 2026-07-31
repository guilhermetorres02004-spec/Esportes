package br.gov.betim.esporte.controller;

import br.gov.betim.esporte.model.Modalidade;
import br.gov.betim.esporte.service.ModalidadeService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/modalidades")
public class ModalidadeController {

    private final ModalidadeService modalidadeService;

    public ModalidadeController(ModalidadeService modalidadeService) {
        this.modalidadeService = modalidadeService;
    }

    @GetMapping
    public List<Modalidade> listar() {
        return modalidadeService.listar();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Modalidade criar(@RequestBody Modalidade modalidade) {
        return modalidadeService.criar(modalidade);
    }
}
