package br.gov.betim.esporte.dto;

import java.util.Map;

public record InscricaoRequest(
        String nomeCompleto,
        String cpf,
        String email,
        String telefone,
        String modalidade,
        Boolean autorizaUsoImagem,
        String termoImagemVersao,
        Map<String, String> dadosFicha
) {
}
