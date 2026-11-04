package br.gov.betim.esporte.repository;

import br.gov.betim.esporte.model.ReservaHorto;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReservaHortoRepository extends JpaRepository<ReservaHorto, Long> {
    @Query("select r from ReservaHorto r join fetch r.quadra where r.dataReserva = :data "
            + "order by r.inicioMinutos, r.quadra.numero")
    List<ReservaHorto> listarDia(@Param("data") LocalDate data);

    @Query("select (count(r) > 0) from ReservaHorto r where r.quadra.numero = :quadra "
            + "and r.dataReserva = :data and r.inicioMinutos < :fim and r.fimMinutos > :inicio")
    boolean existeConflito(@Param("quadra") Integer quadra, @Param("data") LocalDate data,
                          @Param("inicio") Integer inicio, @Param("fim") Integer fim);
}
