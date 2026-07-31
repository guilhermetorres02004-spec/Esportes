package br.gov.betim.esporte.repository;

import br.gov.betim.esporte.model.Modalidade;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModalidadeRepository extends JpaRepository<Modalidade, Long> {
}
