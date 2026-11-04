package br.gov.betim.esporte.service;

import br.gov.betim.esporte.dto.ReservaHortoRequest;
import br.gov.betim.esporte.dto.ReservaHortoResponse;
import br.gov.betim.esporte.dto.ComprovanteHortoResponse;
import br.gov.betim.esporte.model.QuadraHorto;
import br.gov.betim.esporte.model.ReservaHorto;
import br.gov.betim.esporte.repository.QuadraHortoRepository;
import br.gov.betim.esporte.repository.ReservaHortoRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class HortoService {
    private final QuadraHortoRepository quadras;
    private final ReservaHortoRepository reservas;

    public HortoService(QuadraHortoRepository quadras, ReservaHortoRepository reservas) {
        this.quadras = quadras;
        this.reservas = reservas;
    }

    @Transactional(readOnly = true)
    public List<QuadraHorto> listarQuadras() {
        return quadras.findAll(Sort.by("numero"));
    }

    @Transactional(readOnly = true)
    public List<ReservaHortoResponse> listarDia(LocalDate data) {
        return reservas.listarDia(data).stream().map(ReservaHortoResponse::de).toList();
    }

    @Transactional
    public ReservaHortoResponse reservar(ReservaHortoRequest pedido, String usuario) {
        validar(pedido);
        // A trava pertence à quadra, inclusive quando ainda não existe nenhuma reserva.
        // Ela permanece até o commit, serializando a verificação e a gravação.
        QuadraHorto quadra = quadras.buscarParaReserva(pedido.quadra())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quadra não encontrada."));
        if (reservas.existeConflito(pedido.quadra(), pedido.dataReserva(),
                pedido.inicioMinutos(), pedido.fimMinutos())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "A quadra já está reservada nesse período. Escolha outro horário ou outra quadra.");
        }
        ReservaHorto reserva = new ReservaHorto(quadra, pedido.dataReserva(), pedido.inicioMinutos(),
                pedido.fimMinutos(), pedido.responsavel().strip(), usuario, pedido.esporte());
        return ReservaHortoResponse.de(reservas.saveAndFlush(reserva));
    }

    @Transactional(readOnly = true)
    public ComprovanteHortoResponse comprovante(Long id) {
        return ComprovanteHortoResponse.de(reservas.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reserva não encontrada.")));
    }

    private void validar(ReservaHortoRequest pedido) {
        if (pedido == null || pedido.quadra() == null || pedido.dataReserva() == null
                || pedido.inicioMinutos() == null || pedido.fimMinutos() == null
                || pedido.responsavel() == null || pedido.responsavel().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Preencha todos os campos da reserva.");
        }
        if (pedido.esporte() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selecione o tipo de esporte da reserva.");
        }
        int inicio = pedido.inicioMinutos(), fim = pedido.fimMinutos();
        if (inicio < 0 || inicio >= 1440 || fim <= 0 || fim > 1440
                || fim - inicio < 60 || inicio % 60 != 0 || fim % 60 != 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Use horas inteiras, com duração mínima de uma hora, dentro do mesmo dia.");
        }
        String responsavel = pedido.responsavel().strip();
        if (responsavel.length() < 2 || responsavel.length() > 120) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o responsável com 2 a 120 caracteres.");
        }
        ZonedDateTime agora = ZonedDateTime.now(ZoneId.of("America/Sao_Paulo"));
        if (pedido.dataReserva().isBefore(agora.toLocalDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não é permitido agendar em datas anteriores a hoje.");
        }
        if (pedido.dataReserva().equals(agora.toLocalDate())
                && inicio * 60 < agora.toLocalTime().toSecondOfDay()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Escolha um horário que ainda não passou.");
        }
    }
}
