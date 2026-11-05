package br.gov.betim.esporte.dto;

import java.util.List;

public record SuporteResponse(String resposta, String topico, String modo,
                              List<Fonte> fontes, List<String> sugestoes) {
    @Override public String toString() { return "SuporteResponse[modo=" + modo + "]"; }
    public record Fonte(String id, String titulo, String url) {}
}
