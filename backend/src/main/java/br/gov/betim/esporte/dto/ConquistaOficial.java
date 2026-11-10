package br.gov.betim.esporte.dto;

import java.time.LocalDate;
import java.util.List;

public record ConquistaOficial(String id, String titulo, String resumo, LocalDate publicadoEm,
        String fonte, List<String> atletas) {}
