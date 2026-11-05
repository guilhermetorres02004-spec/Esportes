package br.gov.betim.esporte.service;

import br.gov.betim.esporte.dto.InscricaoRequest;
import br.gov.betim.esporte.model.Inscricao;
import br.gov.betim.esporte.repository.InscricaoRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class InscricaoService {

    private final InscricaoRepository inscricaoRepository;
    private final ObjectMapper json;
    private static final String VERSAO_TERMO_IMAGEM = "2026-11-04";

    public InscricaoService(InscricaoRepository inscricaoRepository, ObjectMapper json) {
        this.inscricaoRepository = inscricaoRepository;
        this.json = json;
    }

    public List<Inscricao> listar() {
        return inscricaoRepository.findAll();
    }

    public Inscricao criar(InscricaoRequest request) {
        if (request.nomeCompleto() == null || request.nomeCompleto().isBlank()
                || request.telefone() == null || request.telefone().isBlank()
                || request.modalidade() == null || request.modalidade().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Preencha nome, telefone e modalidade.");
        }
        if ((request.autorizaUsoImagem() != null || request.termoImagemVersao() != null)
                && !VERSAO_TERMO_IMAGEM.equals(request.termoImagemVersao())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reabra o termo de imagem antes de concluir.");
        }
        Inscricao inscricao = new Inscricao();
        inscricao.setNomeCompleto(request.nomeCompleto());
        inscricao.setCpf(request.cpf());
        inscricao.setEmail(request.email());
        inscricao.setTelefone(request.telefone());
        inscricao.setModalidade(request.modalidade());
        inscricao.setDataInscricao(LocalDate.now());
        inscricao.setAutorizaUsoImagem(request.autorizaUsoImagem());
        inscricao.setTermoImagemVersao(request.termoImagemVersao());
        inscricao.setDecisaoImagemEm(request.autorizaUsoImagem() == null ? null : Instant.now());
        inscricao.setDadosFicha(request.dadosFicha() == null ? null : json.valueToTree(request.dadosFicha()).toString());
        return inscricaoRepository.save(inscricao);
    }
}
