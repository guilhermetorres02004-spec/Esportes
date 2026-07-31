package br.gov.betim.esporte.dto;

public record InscricaoRequest(
        String nomeCompleto,
        String cpf,
        String email,
        String telefone,
        String modalidade
) {
}
