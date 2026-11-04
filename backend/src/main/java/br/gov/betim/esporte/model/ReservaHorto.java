package br.gov.betim.esporte.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "horto_reservas", indexes = {
        @Index(name = "idx_horto_quadra_data", columnList = "quadra_numero,data_reserva")
})
public class ReservaHorto {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false) @JoinColumn(name = "quadra_numero", nullable = false)
    private QuadraHorto quadra;
    @Column(name = "data_reserva", nullable = false)
    private LocalDate dataReserva;
    @Column(nullable = false)
    private Integer inicioMinutos;
    @Column(nullable = false)
    private Integer fimMinutos;
    @Column(nullable = false, length = 120)
    private String responsavel;
    @Enumerated(EnumType.STRING) @Column(length = 30)
    private EsporteHorto esporte;
    @Column(nullable = false, length = 255)
    private String agendadoPor;
    @Column(nullable = false)
    private Instant registradoEm;

    protected ReservaHorto() {}

    public ReservaHorto(QuadraHorto quadra, LocalDate dataReserva, Integer inicioMinutos,
                        Integer fimMinutos, String responsavel, String agendadoPor, EsporteHorto esporte) {
        this.quadra = quadra;
        this.dataReserva = dataReserva;
        this.inicioMinutos = inicioMinutos;
        this.fimMinutos = fimMinutos;
        this.responsavel = responsavel;
        this.esporte = esporte;
        this.agendadoPor = agendadoPor;
        this.registradoEm = Instant.now();
    }

    public Long getId() { return id; }
    public QuadraHorto getQuadra() { return quadra; }
    public LocalDate getDataReserva() { return dataReserva; }
    public Integer getInicioMinutos() { return inicioMinutos; }
    public Integer getFimMinutos() { return fimMinutos; }
    public String getResponsavel() { return responsavel; }
    public EsporteHorto getEsporte() { return esporte; }
    public String getAgendadoPor() { return agendadoPor; }
    public Instant getRegistradoEm() { return registradoEm; }
}
