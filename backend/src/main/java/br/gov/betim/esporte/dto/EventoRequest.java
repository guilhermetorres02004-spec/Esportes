package br.gov.betim.esporte.dto;

import java.time.LocalDate;

public record EventoRequest(
        String nome,
        String descricao,
        LocalDate dataEvento,
        String local
) {
}
