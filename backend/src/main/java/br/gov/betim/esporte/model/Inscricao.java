package br.gov.betim.esporte.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import java.time.Instant;
import java.time.LocalDate;

@Entity
public class Inscricao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nomeCompleto;
    private String cpf;
    private String email;
    private String telefone;
    private String modalidade;
    private LocalDate dataInscricao;
    private Boolean autorizaUsoImagem;
    private String termoImagemVersao;
    private Instant decisaoImagemEm;
    @Lob
    private String dadosFicha;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomeCompleto() {
        return nomeCompleto;
    }

    public void setNomeCompleto(String nomeCompleto) {
        this.nomeCompleto = nomeCompleto;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getModalidade() {
        return modalidade;
    }

    public void setModalidade(String modalidade) {
        this.modalidade = modalidade;
    }

    public LocalDate getDataInscricao() {
        return dataInscricao;
    }

    public void setDataInscricao(LocalDate dataInscricao) {
        this.dataInscricao = dataInscricao;
    }

    public Boolean getAutorizaUsoImagem() { return autorizaUsoImagem; }
    public void setAutorizaUsoImagem(Boolean autorizaUsoImagem) { this.autorizaUsoImagem = autorizaUsoImagem; }
    public String getTermoImagemVersao() { return termoImagemVersao; }
    public void setTermoImagemVersao(String termoImagemVersao) { this.termoImagemVersao = termoImagemVersao; }
    public Instant getDecisaoImagemEm() { return decisaoImagemEm; }
    public void setDecisaoImagemEm(Instant decisaoImagemEm) { this.decisaoImagemEm = decisaoImagemEm; }
    public String getDadosFicha() { return dadosFicha; }
    public void setDadosFicha(String dadosFicha) { this.dadosFicha = dadosFicha; }
}
