package br.gov.betim.esporte.repository;

import br.gov.betim.esporte.model.QuadraHorto;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QuadraHortoRepository extends JpaRepository<QuadraHorto, Integer> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select q from QuadraHorto q where q.numero = :numero")
    Optional<QuadraHorto> buscarParaReserva(@Param("numero") Integer numero);
}
