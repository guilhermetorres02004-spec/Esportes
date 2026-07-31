package br.gov.betim.esporte.service;

import br.gov.betim.esporte.dto.EventoRequest;
import br.gov.betim.esporte.model.Evento;
import br.gov.betim.esporte.repository.EventoRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class EventoService {

    private final EventoRepository eventoRepository;

    public EventoService(EventoRepository eventoRepository) {
        this.eventoRepository = eventoRepository;
    }

    public List<Evento> listar() {
        return eventoRepository.findAll();
    }

    public Evento criar(EventoRequest request) {
        Evento evento = new Evento();
        evento.setNome(request.nome());
        evento.setDescricao(request.descricao());
        evento.setDataEvento(request.dataEvento());
        evento.setLocal(request.local());
        return eventoRepository.save(evento);
    }
}
