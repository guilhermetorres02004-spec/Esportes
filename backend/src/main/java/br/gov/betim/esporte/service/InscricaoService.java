package br.gov.betim.esporte.service;

import br.gov.betim.esporte.dto.InscricaoRequest;
import br.gov.betim.esporte.model.Inscricao;
import br.gov.betim.esporte.repository.InscricaoRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class InscricaoService {

    private final InscricaoRepository inscricaoRepository;

    public InscricaoService(InscricaoRepository inscricaoRepository) {
        this.inscricaoRepository = inscricaoRepository;
    }

    public List<Inscricao> listar() {
        return inscricaoRepository.findAll();
    }

    public Inscricao criar(InscricaoRequest request) {
        Inscricao inscricao = new Inscricao();
        inscricao.setNomeCompleto(request.nomeCompleto());
        inscricao.setCpf(request.cpf());
        inscricao.setEmail(request.email());
        inscricao.setTelefone(request.telefone());
        inscricao.setModalidade(request.modalidade());
        inscricao.setDataInscricao(LocalDate.now());
        return inscricaoRepository.save(inscricao);
    }
}
