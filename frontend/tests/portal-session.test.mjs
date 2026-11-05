import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const codigo = readFileSync(new URL('../public/js/portal-session.js', import.meta.url), 'utf8');
const conta = { username: 'admin', authorities: [{ authority: 'ROLE_ADMIN' }] };
function preparar(respostas = [conta]) {
    const elementos = Object.fromEntries(['portal-session-user', 'portal-session-login', 'sair', 'portal-session-status'].map(id =>
        [id, { hidden: true, textContent: '', handlers: {}, setAttribute() {}, addEventListener(tipo, handler) { this.handlers[tipo] = handler; } }]));
    elementos['portal-session-status'].hidden = false;
    const pedidos = [], eventos = {}, docEventos = {};
    const window = { location: { href: '' }, addEventListener(tipo, handler) { eventos[tipo] = handler; } };
    const document = { hidden: false, getElementById: id => elementos[id], addEventListener(tipo, handler) { docEventos[tipo] = handler; } };
    const fetch = async (url, opcoes) => {
        pedidos.push({ url, ...opcoes });
        const resposta = respostas.shift();
        if (resposta instanceof Error) throw resposta;
        if (typeof resposta === 'function') return resposta();
        return { ok: !resposta?.status, status: resposta?.status || 200, json: async () => resposta };
    };
    runInNewContext(codigo, { document, window, fetch, AbortSignal });
    return { elementos, pedidos, eventos, docEventos, window };
}
const pronto = () => new Promise(resolve => setImmediate(resolve));

test('reconhece o admin pela sessão do servidor e envia o cookie em toda página', async () => {
    const t = preparar(); await pronto();
    assert.equal(t.elementos['portal-session-user'].textContent, 'Conectado: admin');
    assert.equal(t.elementos['portal-session-login'].hidden, true);
    assert.equal(t.elementos.sair.hidden, false);
    assert.equal(t.pedidos[0].credentials, 'include');
    assert.equal(t.pedidos[0].cache, 'no-store');
});

test('visitante vê Login e a sessão expirada é reconhecida ao retornar à aba', async () => {
    const t = preparar([conta, { status: 401 }]); await pronto();
    t.docEventos.visibilitychange(); await pronto();
    assert.equal(t.elementos['portal-session-login'].hidden, false);
    assert.equal(t.elementos.sair.hidden, true);
    assert.equal(t.elementos['portal-session-user'].hidden, true);
});

test('falha de conexão não apaga um usuário já identificado', async () => {
    const t = preparar([conta, new TypeError('offline')]); await pronto();
    t.eventos.focus(); await pronto();
    assert.equal(t.elementos['portal-session-user'].textContent, 'Conectado: admin');
    assert.equal(t.elementos.sair.hidden, false);
    assert.match(t.elementos['portal-session-status'].textContent, /verificar/);
});

test('Sair encerra a sessão pelo servidor antes de redirecionar', async () => {
    const t = preparar([conta, {}]); await pronto();
    await t.elementos.sair.handlers.click();
    assert.equal(t.pedidos[1].url, '/logout');
    assert.equal(t.pedidos[1].method, 'POST');
    assert.equal(t.pedidos[1].credentials, 'include');
    assert.equal(t.window.location.href, 'login.html');
    assert.equal(t.elementos['portal-session-user'].hidden, true);
});

test('falha ao sair mantém a conta visível e permite nova tentativa', async () => {
    const t = preparar([conta, { status: 503 }]); await pronto();
    await t.elementos.sair.handlers.click();
    assert.equal(t.window.location.href, '');
    assert.equal(t.elementos['portal-session-user'].hidden, false);
    assert.equal(t.elementos.sair.disabled, false);
});

test('resposta antiga não restaura o login depois de Sair', async () => {
    let concluir;
    const t = preparar([conta, () => new Promise(resolve => { concluir = resolve; }), {}]); await pronto();
    t.eventos.pageshow();
    await t.elementos.sair.handlers.click();
    concluir({ ok: true, status: 200, json: async () => conta }); await pronto();
    assert.equal(t.elementos['portal-session-user'].hidden, true);
});

test('sessão é compartilhada pelas vinte páginas sem decidir acesso pelo nome da página', () => {
    const header = readFileSync(new URL('../public/js/portal-header.js', import.meta.url), 'utf8');
    assert.match(header, /portal-session\.js/);
    assert.doesNotMatch(header, /const administrative|onclick="sair/);
    const paginas = readdirSync(new URL('../', import.meta.url)).filter(p => p.endsWith('.html'))
        .filter(p => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8').includes('/js/portal-header.js'));
    assert.equal(paginas.length, 20);
});
