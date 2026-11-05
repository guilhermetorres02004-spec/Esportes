package br.gov.betim.esporte.model;

public enum EsporteHorto {
    FUTSAL("Futsal"),
    FUTEBOL("Futebol"),
    VOLEIBOL("Voleibol"),
    BASQUETE("Basquete"),
    HANDEBOL("Handebol"),
    TENIS("Tênis"),
    BADMINTON("Badminton"),
    OUTRO("Outro esporte"),
    VOLEI_PRAIA("Vôlei de praia", "AREIA"),
    FUTEVOLEI("Futevôlei", "AREIA"),
    BEACH_TENNIS("Beach tennis", "AREIA"),
    FUTEBOL_AREIA("Futebol de areia", "AREIA"),
    HANDEBOL_AREIA("Handebol de areia", "AREIA");

    private final String nome;
    private final String tipoQuadra;

    EsporteHorto(String nome) { this(nome, "QUADRA"); }

    EsporteHorto(String nome, String tipoQuadra) {
        this.nome = nome;
        this.tipoQuadra = tipoQuadra;
    }

    public String getNome() { return nome; }
    public String getTipoQuadra() { return tipoQuadra; }
}
