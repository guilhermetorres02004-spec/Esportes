package br.gov.betim.esporte.dto;

import java.util.List;

public record FotoOficial(String id, String titulo, String origem, String imagemOriginal,
                          String url, String publicadoEm, List<String> categorias) {}
