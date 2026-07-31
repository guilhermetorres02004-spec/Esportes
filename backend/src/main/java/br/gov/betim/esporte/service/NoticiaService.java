package br.gov.betim.esporte.service;

import br.gov.betim.esporte.dto.NoticiaRequest;
import br.gov.betim.esporte.model.Noticia;
import br.gov.betim.esporte.repository.NoticiaRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class NoticiaService {

    private final NoticiaRepository noticiaRepository;

    public NoticiaService(NoticiaRepository noticiaRepository) {
        this.noticiaRepository = noticiaRepository;
    }

    public List<Noticia> listar() {
        return noticiaRepository.findAll();
    }

    public Noticia criar(NoticiaRequest request) {
        Noticia noticia = new Noticia();
        noticia.setTitulo(request.titulo());
        noticia.setResumo(request.resumo());
        noticia.setConteudo(request.conteudo());
        noticia.setImagemUrl(request.imagemUrl());
        noticia.setDataPublicacao(request.dataPublicacao());
        return noticiaRepository.save(noticia);
    }
}
