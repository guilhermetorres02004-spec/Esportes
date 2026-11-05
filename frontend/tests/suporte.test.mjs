import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { carregarConversa, guardarConversa, perguntar, linkSeguro, CHAVE_CONVERSA } from '../public/js/suporte-client.js';
import { prepararDom } from './helpers/suporte-dom.mjs';

function storage() {
    const dados = new Map();
    return { getItem: k => dados.get(k) || null, setItem: (k, v) => dados.set(k, v), removeItem: k => dados.delete(k) };
}

function tela(fetcher, armazenamento = storage()) {
    const dom = prepararDom();
    const codigo = readFileSync(new URL('../public/js/portal-suporte.js', import.meta.url), 'utf8').replace(/^import[^\n]+\n/, '');
    runInNewContext(codigo, { document: dom.document, window: { sessionStorage: armazenamento,
        location: { origin: 'https://portal.exemplo', pathname: '/index.html' } },
        carregarConversa, guardarConversa, perguntar: (m, e, p) => perguntar(m, e, p, fetcher), linkSeguro, CHAVE_CONVERSA, URL });
    return { ...dom, armazenamento, enviar: texto => {
        dom.get('input').value = texto;
        return dom.get('form').handlers.submit({ preventDefault() {} });
    } };
}

test('catálogo tem fontes existentes e a mesma versão no frontend e backend', () => {
    const texto = readFileSync(new URL('../public/docs/suporte/base.json', import.meta.url), 'utf8');
    const base = JSON.parse(texto);
    assert.equal(texto, readFileSync(new URL('../../backend/src/main/resources/suporte/base.json', import.meta.url), 'utf8'));
    assert.equal(new Set(base.documentos.map(d => d.id)).size, base.documentos.length);
    assert.ok(base.documentos.length >= 60);
    for (const doc of base.documentos) {
        assert.ok(doc.texto && doc.titulo && doc.topico);
        assert.doesNotMatch(doc.texto, /<script|onclick=|\[cite:/);
        const href = linkSeguro(doc.url, 'https://portal.exemplo');
        assert.ok(href, doc.url);
        if (href.startsWith('https://portal.exemplo/')) {
            const caminho = new URL(href).pathname;
            assert.ok(existsSync(new URL(caminho.startsWith('/docs/') ? `../public${caminho}` : `..${caminho}`, import.meta.url)), doc.url);
        }
    }
});

test('todas as páginas com cabeçalho compartilham o suporte e o chat simulado foi retirado', () => {
    const header = readFileSync(new URL('../public/js/portal-header.js', import.meta.url), 'utf8');
    assert.match(header, /portal-suporte\.js/);
    assert.match(header, /portal-suporte\.css/);
    const paginas = readdirSync(new URL('../', import.meta.url)).filter(p => p.endsWith('.html'))
        .map(p => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8')).filter(p => p.includes('/js/portal-header.js'));
    assert.ok(paginas.length >= 20);
    for (const pagina of paginas) assert.doesNotMatch(pagina, /id="chat-container"|function sendMessage\(/);
    const css = readFileSync(new URL('../public/css/portal-suporte.css', import.meta.url), 'utf8');
    assert.match(css, /overflow-y: scroll/);
    assert.match(css, /min-height: 0/);
    assert.match(css, /scrollbar-color:/);
});

test('histórico continua entre páginas e tolera armazenamento bloqueado', () => {
    const s = storage();
    guardarConversa(s, { mensagens: [{ papel: 'user', texto: 'Como reservar?' }], topico: 'quadras', aberto: true });
    assert.equal(carregarConversa(s).topico, 'quadras');
    assert.equal(carregarConversa(s).aberto, true);
    s.setItem(CHAVE_CONVERSA, '{invalido');
    assert.equal(carregarConversa(s).mensagens.length, 0);
    assert.equal(carregarConversa(null).mensagens.length, 0);
    assert.doesNotThrow(() => guardarConversa(null, { mensagens: [] }));
});

test('fontes bloqueiam links executáveis e permitem páginas e PDFs do portal', () => {
    for (const url of ['javascript:alert(1)', 'data:text/html,test', 'http://externo.test', '/logout', '/api/inscricoes']) assert.equal(linkSeguro(url, 'https://portal.exemplo'), null);
    assert.equal(linkSeguro('Inscricao.html', 'https://portal.exemplo'), 'https://portal.exemplo/Inscricao.html');
    assert.equal(linkSeguro('/docs/guia.pdf', 'https://portal.exemplo'), 'https://portal.exemplo/docs/guia.pdf');
});

test('API recebe a página e somente os últimos oito turnos, sem ler campos do site', async () => {
    let enviado;
    const estado = { topico: 'quadras', mensagens: Array.from({ length: 20 }, (_, i) => ({ papel: 'user', texto: `Pergunta ${i}`, fontes: [] })) };
    const dados = await perguntar('E a areia?', estado, '/agendamento-quadras.html', async (url, opcoes) => {
        assert.equal(url, '/api/suporte/mensagens');
        assert.equal(opcoes.credentials, 'include');
        enviado = JSON.parse(opcoes.body);
        return { ok: true, json: async () => ({ resposta: 'Quadras 6 e 7.', topico: 'quadras' }) };
    });
    assert.equal(enviado.historico.length, 8);
    assert.equal(enviado.historico[0].texto, 'Pergunta 12');
    assert.equal(enviado.pagina, '/agendamento-quadras.html');
    assert.deepEqual(Object.keys(enviado.historico[0]), ['papel', 'texto']);
    assert.equal(dados.resposta, 'Quadras 6 e 7.');
});

test('erros de rede e excesso de perguntas não viram respostas falsas', async () => {
    const estado = { topico: '', mensagens: [] };
    await assert.rejects(perguntar('oi', estado, '/', async () => ({ ok: false, status: 429 })), /um minuto/);
    await assert.rejects(perguntar('oi', estado, '/', async () => { throw new TypeError('offline'); }), /offline/);
    await assert.rejects(perguntar('oi', estado, '/', async () => ({ ok: true, json: async () => ({}) })), /indisponível/);
});

test('interface abre, fecha com Escape e renderiza mensagens como texto seguro com rolagem ao final', async () => {
    const t = tela(async () => ({ ok: true, json: async () => ({ resposta: '<script>alert(1)</script>', fontes: [
        { titulo: 'Ataque', url: 'javascript:alert(1)' }, { titulo: 'Quadras', url: 'agendamento-quadras.html' }], modo: 'consulta', topico: 'quadras' }) }));
    t.get('.suporte-abrir').handlers.click();
    assert.equal(t.get('.suporte-painel').hidden, false);
    await t.enviar('<img src=x onerror=alert(1)>');
    const log = t.get('.suporte-mensagens');
    assert.equal(log.scrollTop, log.scrollHeight);
    assert.equal(log.children.at(-1).children[1].textContent, '<script>alert(1)</script>');
    assert.equal(log.children.at(-2).children[1].textContent, '<img src=x onerror=alert(1)>');
    assert.equal(log.children.at(-1).children.filter(n => n.tag === 'a').length, 1);
    assert.equal(t.get('[type="submit"]').disabled, false);
    t.document.handlers.keydown({ key: 'Escape', preventDefault() {} });
    assert.equal(t.get('.suporte-painel').hidden, true);
    const outra = tela(undefined, t.armazenamento);
    assert.equal(outra.get('.suporte-mensagens').children.length, 3);
});

test('falha permite tentar de novo e bloqueia envios duplicados durante a consulta', async () => {
    let concluir, pedidos = 0;
    const t = tela(() => { pedidos++; return new Promise(resolve => { concluir = resolve; }); });
    const envio = t.enviar('Como reservar?');
    await t.enviar('Pergunta duplicada');
    assert.equal(pedidos, 1);
    concluir({ ok: false, status: 503 }); await envio;
    assert.equal(t.get('[type="submit"]').disabled, false);
    assert.match(t.get('.suporte-status').textContent, /Tente novamente/);
    assert.equal(carregarConversa(t.armazenamento).mensagens.length, 0);
    assert.equal(t.get('.suporte-mensagens').children.length, 1);
});
