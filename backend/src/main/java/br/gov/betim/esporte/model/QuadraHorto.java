package br.gov.betim.esporte.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "horto_quadras")
public class QuadraHorto {
    @Id
    private Integer numero;
    @Column(length = 20)
    private String tipo;
    private Boolean coberta;

    protected QuadraHorto() {}

    public QuadraHorto(Integer numero) {
        this.numero = numero;
    }

    public Integer getNumero() { return numero; }
    public String getNome() { return "Quadra " + numero; }
    public String getTipo() { return tipo == null ? "QUADRA" : tipo; }
    public boolean isCoberta() { return Boolean.TRUE.equals(coberta); }

    public void definirCaracteristicas(String tipo, boolean coberta) {
        this.tipo = tipo;
        this.coberta = coberta;
    }
}
