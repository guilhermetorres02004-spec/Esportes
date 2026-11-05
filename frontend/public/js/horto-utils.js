export function agoraLocal(instante = new Date()) {
    const partes = Object.fromEntries(new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).formatToParts(instante).map(parte => [parte.type, parte.value]));
    return { data: `${partes.year}-${partes.month}-${partes.day}`, minutos: Number(partes.hour) * 60 + Number(partes.minute) };
}

export function horario(minutos) {
    return `${String(Math.floor(minutos / 60)).padStart(2, "0")}:${String(minutos % 60).padStart(2, "0")}`;
}

export function dataCurta(data) {
    return data.split("-").reverse().join("/");
}

export function deslocarData(data, dias) {
    const instante = new Date(`${data}T12:00:00Z`);
    instante.setUTCDate(instante.getUTCDate() + dias);
    return instante.toISOString().slice(0, 10);
}

export function haConflito(reservas, quadra, data, inicio, fim) {
    return reservas.some(reserva => reserva.quadra === quadra && reserva.dataReserva === data
        && reserva.inicioMinutos < fim && reserva.fimMinutos > inicio);
}

export function periodoPassado(data, inicio, agora = agoraLocal()) {
    return data < agora.data || (data === agora.data && inicio <= agora.minutos);
}

export function esportesParaQuadra(esportes, quadra) {
    return quadra ? esportes.filter(esporte => esporte.tipoQuadra === quadra.tipo) : [];
}
