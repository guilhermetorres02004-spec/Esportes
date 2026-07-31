package br.gov.betim.esporte.controller;

import br.gov.betim.esporte.dto.NoticiaRequest;
import br.gov.betim.esporte.model.Noticia;
import br.gov.betim.esporte.service.NoticiaService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/noticias")
public class NoticiaController {

    private final NoticiaService noticiaService;

    public NoticiaController(NoticiaService noticiaService) {
        this.noticiaService = noticiaService;
    }

    @GetMapping
    public List<Noticia> listar() {
        return noticiaService.listar();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Noticia criar(@RequestBody NoticiaRequest request) {
        return noticiaService.criar(request);
    }
}
