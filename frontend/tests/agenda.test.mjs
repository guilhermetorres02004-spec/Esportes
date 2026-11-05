import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';

const html = readFileSync(new URL('../agenda.html', import.meta.url), 'utf8');
const codigo = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
    .find(item => item[1].includes('function gerarCalendario'))[1];

function preparar(instante = '2026-11-04T15:00:00Z') {
    let agora = instante;
    class DataControlada extends Date {
        constructor(...args) { super(...(args.length ? args : [agora])); }
        static now() { return new Date(agora).getTime(); }
    }
    const elementos = new Map(), eventosDocumento = {}, eventosJanela = {}, intervalos = [];
    function elemento() {
        return { children: [], dataset: {}, atributos: {}, classList: { add() {}, remove() {} },
            set innerHTML(valor) { this.children = []; this.conteudo = valor; },
            appendChild(filho) { this.children.push(filho); },
            setAttribute(nome, valor) { this.atributos[nome] = valor; },
            addEventListener() {} };
    }
    const documento = { hidden: false,
        getElementById(id) { if (!elementos.has(id)) elementos.set(id, elemento()); return elementos.get(id); },
        createElement: elemento, addEventListener(tipo, handler) { eventosDocumento[tipo] = handler; } };
    const dadosSalvos = JSON.stringify({ '2026-04-15': [{ id: 1, titulo: 'Evento histórico' }] });
    const contexto = createContext({ Date: DataControlada, document: documento,
        window: { addEventListener(tipo, handler) { eventosJanela[tipo] = handler; } },
        localStorage: { getItem() { return dadosSalvos; }, setItem() { throw new Error('Não deve alterar eventos existentes'); } },
        setInterval(handler, tempo) { intervalos.push({ handler, tempo }); } });
    runInContext(codigo, contexto);
    return { contexto, documento, eventosDocumento, eventosJanela, intervalos,
        elemento: id => documento.getElementById(id),
        mes: () => runInContext('`${dataAtual.getFullYear()}-${String(dataAtual.getMonth()+1).padStart(2,"0")}`', contexto),
        mudarHora(valor) { agora = valor; } };
}

test('inicia no mês atual e destaca hoje no horário de São Paulo', () => {
    const agenda = preparar('2026-11-05T02:30:00Z');
    assert.equal(agenda.mes(), '2026-11');
    assert.equal(agenda.elemento('hojeAgenda').textContent, 'HOJE: 04/11/2026');
    const hoje = agenda.elemento('calendario').children.filter(item => item.atributos['aria-current'] === 'date');
    assert.equal(hoje.length, 1);
    assert.equal(hoje[0].dataset.data, '2026-11-04');
});

test('dias passados ficam apagados e sem cliques, inclusive nos eventos', () => {
    const agenda = preparar();
    runInContext('eventosData["2026-11-03"] = [{ id: 2, titulo: "Evento encerrado" }]; gerarCalendario();', agenda.contexto);
    const dias = agenda.elemento('calendario').children;
    for (const data of ['2026-11-01', '2026-11-02', '2026-11-03']) {
        const dia = dias.find(item => item.dataset.data === data);
        assert.ok(dia.className.includes('calendar-day-past'));
        assert.equal(dia.atributos['aria-disabled'], 'true');
        assert.equal(dia.onclick, undefined);
        assert.ok(dia.children.every(evento => evento.onclick === undefined));
    }
    for (const data of ['2026-11-04', '2026-11-05']) {
        const dia = dias.find(item => item.dataset.data === data);
        assert.equal(typeof dia.onclick, 'function');
        assert.ok(!dia.className.includes('calendar-day-past'));
    }
});

test('virada do dia desativa ontem e bloqueia clique em uma célula ainda não atualizada', () => {
    const agenda = preparar('2026-11-05T02:59:59Z');
    const ontem = agenda.elemento('calendario').children.find(item => item.dataset.data === '2026-11-04');
    agenda.mudarHora('2026-11-05T03:00:00Z');
    ontem.onclick();
    assert.equal(agenda.elemento('dataEvento').value, undefined);
    const atualizado = agenda.elemento('calendario').children.find(item => item.dataset.data === '2026-11-04');
    assert.equal(atualizado.onclick, undefined);
    assert.equal(atualizado.atributos['aria-disabled'], 'true');
});

test('não permite retroceder antes do mês atual, inclusive por chamadas repetidas', () => {
    const agenda = preparar();
    assert.equal(agenda.elemento('mesAnterior').disabled, true);
    for (let i = 0; i < 12; i++) agenda.contexto.mesAnterior();
    assert.equal(agenda.mes(), '2026-11');
    agenda.contexto.proximoMes();
    assert.equal(agenda.mes(), '2026-12');
    assert.equal(agenda.elemento('mesAnterior').disabled, false);
    agenda.contexto.mesAnterior();
    assert.equal(agenda.mes(), '2026-11');
    assert.equal(agenda.elemento('mesAnterior').disabled, true);
});

test('virada de dia e ano atualiza hoje, mês e limite sem recarregar a página', () => {
    const agenda = preparar('2027-01-01T02:59:59Z');
    assert.equal(agenda.mes(), '2026-12');
    agenda.mudarHora('2027-01-01T03:00:00Z');
    agenda.intervalos[0].handler();
    assert.equal(agenda.mes(), '2027-01');
    assert.equal(agenda.elemento('hojeAgenda').textContent, 'HOJE: 01/01/2027');
    assert.equal(agenda.elemento('mesAnterior').disabled, true);
    agenda.contexto.mesAnterior();
    assert.equal(agenda.mes(), '2027-01');
});

test('preserva navegação em mês futuro e permite retornar a hoje', () => {
    const agenda = preparar('2026-11-30T20:00:00Z');
    agenda.contexto.proximoMes();
    agenda.contexto.proximoMes();
    agenda.mudarHora('2026-12-01T03:00:00Z');
    agenda.eventosJanela.focus();
    assert.equal(agenda.mes(), '2027-01');
    agenda.contexto.irParaHoje();
    assert.equal(agenda.mes(), '2026-12');
});

test('atualiza após suspensão da aba e mantém eventos históricos nas datas originais', () => {
    const agenda = preparar();
    agenda.mudarHora('2027-02-04T15:00:00Z');
    agenda.eventosDocumento.visibilitychange();
    assert.equal(agenda.mes(), '2027-02');
    assert.equal(runInContext('eventosData["2026-04-15"][0].titulo', agenda.contexto), 'Evento histórico');
});

test('calendário mantém 42 células e fevereiro bissexto sem saltar meses', () => {
    const agenda = preparar('2028-01-31T15:00:00Z');
    agenda.contexto.proximoMes();
    assert.equal(agenda.mes(), '2028-02');
    assert.equal(agenda.elemento('calendario').children.length, 42);
    assert.ok(agenda.elemento('calendario').children.some(item => item.dataset.data === '2028-02-29'));
    agenda.contexto.proximoMes();
    assert.equal(agenda.mes(), '2028-03');
});

test('novo evento inicia em hoje sem alterar uma data escolhida no calendário', () => {
    const agenda = preparar('2026-11-05T02:30:00Z');
    agenda.contexto.abrirFormularioNovoEvento();
    assert.equal(agenda.elemento('dataEvento').value, '2026-11-04');
    agenda.contexto.abrirFormularioNovoEvento('2026-12-10');
    assert.equal(agenda.elemento('dataEvento').value, '2026-12-10');
});

for (const selecionada of ['2026-11-04', '2026-12-10']) {
    test(`agenda de quadras ajusta a virada do dia sem perder data futura: ${selecionada}`, async () => {
        const fonte = readFileSync(new URL('../public/js/agendamento-quadras.js', import.meta.url), 'utf8');
        const inicio = fonte.indexOf('async function carregarDia()');
        const fim = fonte.indexOf('function selecionarData(', inicio);
        const consultas = [];
        const dataInput = { value: selecionada };
        const contexto = createContext({ dataInput, agoraLocal: () => ({ data: '2026-11-05', minutos: 0 }),
            estado: { sequencia: 0, reservas: [], quadras: [], esportes: [] },
            elemento: () => ({}), atualizarTela() {}, mensagem() {},
            requisitar: async caminho => { consultas.push(caminho); return []; } });
        runInContext(fonte.slice(inicio, fim), contexto);
        await contexto.carregarDia();
        const esperada = selecionada < '2026-11-05' ? '2026-11-05' : selecionada;
        assert.equal(dataInput.value, esperada);
        assert.ok(consultas.includes(`/api/horto/reservas?data=${esperada}`));
    });
}
