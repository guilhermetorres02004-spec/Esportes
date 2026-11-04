import { test } from "node:test";
import assert from "node:assert/strict";
import { agoraLocal, horario, dataCurta, deslocarData, haConflito, periodoPassado } from "../public/js/horto-utils.js";

const reservas = [{ quadra: 1, dataReserva: "2027-01-10", inicioMinutos: 600, fimMinutos: 720 }];

test("bloqueia horários iguais, sobrepostos e que englobam uma reserva", () => {
    for (const [inicio, fim] of [[600, 720], [540, 660], [660, 780], [540, 780], [600, 660]]) {
        assert.equal(haConflito(reservas, 1, "2027-01-10", inicio, fim), true);
    }
});

test("libera horários contíguos, outras quadras e outras datas", () => {
    assert.equal(haConflito(reservas, 1, "2027-01-10", 540, 600), false);
    assert.equal(haConflito(reservas, 1, "2027-01-10", 720, 780), false);
    assert.equal(haConflito(reservas, 2, "2027-01-10", 600, 720), false);
    assert.equal(haConflito(reservas, 1, "2027-01-11", 600, 720), false);
});

test("formata datas sem deslocamento de fuso e permite terminar às 24h", () => {
    assert.equal(dataCurta("2027-01-10"), "10/01/2027");
    assert.equal(horario(0), "00:00");
    assert.equal(horario(1440), "24:00");
    assert.equal(deslocarData("2026-12-31", 1), "2027-01-01");
    assert.equal(deslocarData("2028-03-01", -1), "2028-02-29");
});

test("usa o horário de São Paulo e impede selecionar períodos encerrados", () => {
    const agora = agoraLocal(new Date("2027-01-11T01:30:00Z"));
    assert.deepEqual(agora, { data: "2027-01-10", minutos: 1350 });
    assert.equal(periodoPassado("2027-01-10", 1320, agora), true);
    assert.equal(periodoPassado("2027-01-10", 1380, agora), false);
    assert.equal(periodoPassado("2027-01-09", 1380, agora), true);
    assert.equal(periodoPassado("2027-01-11", 0, agora), false);
});
