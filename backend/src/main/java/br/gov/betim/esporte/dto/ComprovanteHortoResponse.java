package br.gov.betim.esporte.dto;

import br.gov.betim.esporte.model.ReservaHorto;
import java.time.Instant;
import java.time.LocalDate;

public record ComprovanteHortoResponse(Long reservaId, String protocolo, String local,
        String quadra, LocalDate dataReserva, Integer inicioMinutos, Integer fimMinutos,
        String responsavel, String esporte, Instant registradoEm) {
    public static ComprovanteHortoResponse de(ReservaHorto reserva) {
        var quadra = reserva.getQuadra();
        String detalhe = quadra.getTipo().equals("AREIA") ? " - Areia" : quadra.isCoberta() ? " - Coberta" : "";
        return new ComprovanteHortoResponse(reserva.getId(), "HORTO-%06d".formatted(reserva.getId()),
                "Horto Municipal - Betim", quadra.getNome() + detalhe, reserva.getDataReserva(),
                reserva.getInicioMinutos(), reserva.getFimMinutos(), reserva.getResponsavel(),
                reserva.getEsporte() == null ? "Não informado" : reserva.getEsporte().getNome(),
                reserva.getRegistradoEm());
    }
}
