package br.gov.betim.esporte.repository;

import br.gov.betim.esporte.model.Evento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventoRepository extends JpaRepository<Evento, Long> {
}
