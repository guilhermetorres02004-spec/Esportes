package br.gov.betim.esporte.dto;

import java.time.LocalDate;

public record NoticiaRequest(
        String titulo,
        String resumo,
        String conteudo,
        String imagemUrl,
        LocalDate dataPublicacao
) {
}
