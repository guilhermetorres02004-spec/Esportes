import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const codigo = readFileSync(new URL('../public/js/portal-preferencias.js', import.meta.url), 'utf8');

function tela(salvos = {}, bloqueado = false) {
    const eventos = {}, janelas = {}, classes = new Set(), dados = { ...salvos };
    const botoes = ['aumentar', 'diminuir', 'contraste', 'restaurar'].map(acao => ({
        dataset: { portalVisual: acao }, disabled: false, atributos: {},
        setAttribute(nome, valor) { this.atributos[nome] = valor; },
    }));
    const raiz = { style: {}, classList: { toggle(nome, ativo) { ativo ? classes.add(nome) : classes.delete(nome); } } };
    const status = {};
    const document = { documentElement: raiz, querySelectorAll: () => botoes, querySelector: () => status,
        addEventListener: (nome, fn) => { eventos[nome] = fn; } };
    const localStorage = {
        getItem(chave) { if (bloqueado) throw Error('bloqueado'); return dados[chave] ?? null; },
        setItem(chave, valor) { if (bloqueado) throw Error('bloqueado'); dados[chave] = valor; },
    };
    runInNewContext(codigo, { document, localStorage, window: { addEventListener: (nome, fn) => { janelas[nome] = fn; } } });
    eventos.DOMContentLoaded();
    const clicar = acao => eventos.click({ target: { closest: () => botoes.find(b => b.dataset.portalVisual === acao) } });
    return { raiz, classes, dados, botoes, status, clicar, janelas };
}

test('restaura preferências e não sobrescreve o tamanho salvo na montagem', () => {
    const t = tela({ theme: 'dark', fontSize: '140' });
    assert.equal(t.raiz.style.fontSize, '140%');
    assert.ok(t.classes.has('dark'));
    assert.equal(t.botoes[0].disabled, true);
    assert.equal(t.botoes[2].atributos['aria-pressed'], 'true');
    assert.equal(t.dados.fontSize, '140');
});

test('escala respeita limites e restaurar repõe os padrões', () => {
    const t = tela();
    for (let i = 0; i < 12; i++) t.clicar('aumentar');
    assert.equal(t.raiz.style.fontSize, '140%');
    for (let i = 0; i < 12; i++) t.clicar('diminuir');
    assert.equal(t.raiz.style.fontSize, '70%');
    t.clicar('contraste');
    assert.equal(t.dados.theme, 'dark');
    assert.match(t.status.textContent, /70%.*ativado/);
    t.clicar('restaurar');
    assert.equal(t.raiz.style.fontSize, '100%');
    assert.equal(t.classes.has('dark'), false);
    assert.equal(t.dados.theme, 'light');
});

test('valores corrompidos e armazenamento bloqueado não impedem os controles', () => {
    for (const fontSize of ['999', '-10', 'texto', '']) assert.equal(tela({ fontSize }).raiz.style.fontSize, '100%');
    const t = tela({}, true);
    t.clicar('aumentar'); t.clicar('contraste');
    assert.equal(t.raiz.style.fontSize, '110%');
    assert.ok(t.classes.has('dark'));
});

test('sincroniza preferências entre abas', () => {
    const t = tela();
    t.dados.fontSize = '120'; t.dados.theme = 'dark';
    t.janelas.storage({ key: 'theme' });
    assert.equal(t.raiz.style.fontSize, '120%');
    assert.ok(t.classes.has('dark'));
});

test('as 39 páginas compartilhadas carregam preferências no head antes dos estilos', () => {
    const paginas = readdirSync(new URL('../', import.meta.url)).filter(p => p.endsWith('.html'))
        .map(p => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8')).filter(h => h.includes('/js/portal-header.js'));
    assert.equal(paginas.length, 39);
    for (const html of paginas) {
        const head = html.split('</head>')[0];
        assert.equal((head.match(/src="\/js\/portal-preferencias.js"/g) || []).length, 1);
        assert.ok(head.indexOf('/js/portal-preferencias.js') < head.indexOf('/css/portal-base.css'));
        assert.ok(head.includes('/css/portal-acessibilidade.css'));
    }
});
