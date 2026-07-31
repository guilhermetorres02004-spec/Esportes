package br.gov.betim.esporte.repository;

import br.gov.betim.esporte.model.LocalEsportivo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocalEsportivoRepository extends JpaRepository<LocalEsportivo, Long> {
}
