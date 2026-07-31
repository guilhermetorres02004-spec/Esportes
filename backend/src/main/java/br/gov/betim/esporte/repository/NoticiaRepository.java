package br.gov.betim.esporte.repository;

import br.gov.betim.esporte.model.Noticia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticiaRepository extends JpaRepository<Noticia, Long> {
}
