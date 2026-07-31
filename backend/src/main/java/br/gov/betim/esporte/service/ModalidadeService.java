package br.gov.betim.esporte.service;

import br.gov.betim.esporte.model.Modalidade;
import br.gov.betim.esporte.repository.ModalidadeRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ModalidadeService {

    private final ModalidadeRepository modalidadeRepository;

    public ModalidadeService(ModalidadeRepository modalidadeRepository) {
        this.modalidadeRepository = modalidadeRepository;
    }

    public List<Modalidade> listar() {
        return modalidadeRepository.findAll();
    }

    public Modalidade criar(Modalidade modalidade) {
        return modalidadeRepository.save(modalidade);
    }
}
