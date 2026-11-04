package br.gov.betim.esporte.dto;

import java.time.LocalDate;
import br.gov.betim.esporte.model.EsporteHorto;

public record ReservaHortoRequest(
        Integer quadra,
        LocalDate dataReserva,
        Integer inicioMinutos,
        Integer fimMinutos,
        String responsavel,
        EsporteHorto esporte
) {}
