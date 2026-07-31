package br.gov.betim.esporte.repository;

import br.gov.betim.esporte.model.Inscricao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InscricaoRepository extends JpaRepository<Inscricao, Long> {
}
