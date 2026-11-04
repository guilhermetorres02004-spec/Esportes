package br.gov.betim.esporte.model;

public enum EsporteHorto {
    FUTSAL("Futsal"),
    FUTEBOL("Futebol"),
    VOLEIBOL("Voleibol"),
    BASQUETE("Basquete"),
    HANDEBOL("Handebol"),
    TENIS("Tênis"),
    BADMINTON("Badminton"),
    OUTRO("Outro esporte");

    private final String nome;

    EsporteHorto(String nome) { this.nome = nome; }

    public String getNome() { return nome; }
}
