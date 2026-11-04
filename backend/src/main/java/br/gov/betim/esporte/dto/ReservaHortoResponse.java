package br.gov.betim.esporte.dto;

import br.gov.betim.esporte.model.ReservaHorto;
import br.gov.betim.esporte.model.EsporteHorto;
import java.time.Instant;
import java.time.LocalDate;

public record ReservaHortoResponse(Long id, Integer quadra, LocalDate dataReserva,
                                   Integer inicioMinutos, Integer fimMinutos, String responsavel,
                                   String agendadoPor, Instant registradoEm, EsporteHorto esporte) {
    public static ReservaHortoResponse de(ReservaHorto reserva) {
        return new ReservaHortoResponse(reserva.getId(), reserva.getQuadra().getNumero(),
                reserva.getDataReserva(), reserva.getInicioMinutos(), reserva.getFimMinutos(),
                reserva.getResponsavel(), reserva.getAgendadoPor(), reserva.getRegistradoEm(), reserva.getEsporte());
    }
}
