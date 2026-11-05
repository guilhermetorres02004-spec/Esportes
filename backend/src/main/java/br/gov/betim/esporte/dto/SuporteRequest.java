package br.gov.betim.esporte.dto;

import java.util.List;

public record SuporteRequest(String mensagem, String pagina, String topico, List<Turno> historico) {
    @Override public String toString() { return "SuporteRequest[conteudo=oculto]"; }
    public record Turno(String papel, String texto) {}
}
