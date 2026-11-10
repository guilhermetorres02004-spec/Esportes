import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { campeoes, fontes } from '../public/js/conquistas-dados.js';

const html = readFileSync(new URL('../conquistas.html', import.meta.url), 'utf8');
const codigo = readFileSync(new URL('../public/js/conquistas.js', import.meta.url), 'utf8').replace(/^import .*;\r?\n/gm, '');
class Elemento {
    constructor() { this.children = []; this.handlers = {}; this.style = {}; this.hidden = false; }
    append(...items) { this.children.push(...items); }
    replaceChildren(...items) { this.children = items; }
    setAttribute(key, value) { this[key] = value; }
    addEventListener(type, fn) { this.handlers[type] = fn; }
    focus() { this.focado = true; }
    showModal() { this.open = true; }
    close() { this.open = false; this.handlers.close(); }
    getBoundingClientRect() { return { left: 20, right: 800, top: 20, bottom: 700 }; }
}
function preparar() {
    const elementos = Object.fromEntries([...html.matchAll(/id="(campeao-[^"]+)"/g)].map(([, id]) => [id, new Elemento()]));
    const dialog = elementos['campeao-dialog']; dialog.id = 'campeao-dialog';
    const fechar = new Elemento(); dialog.querySelector = () => fechar;
    const cards = [...html.matchAll(/<article class="hall-card" data-campeao="([^"]+)">([\s\S]*?)<\/article>/g)].map(([, id, trecho]) => {
        const card = new Elemento(); card.dataset = { campeao: id };
        card.querySelector = seletor => ({ textContent: seletor === 'h3' ? trecho.match(/<h3>(.*?)<\/h3>/)[1] : seletor === '.hall-sport' ? 'Atletismo' : seletor === '.hall-result' ? 'Resultado' : 'Resumo' });
        return card;
    });
    const document = { body: { style: { overflow: 'auto' } }, getElementById: id => elementos[id], createElement: () => new Elemento(), querySelectorAll: () => cards };
    runInNewContext(codigo, { campeoes, fontes, document, iniciarAtualizacao() {} });
    return { elementos, dialog, fechar, cards, document };
}

test('todos os cards têm perfil e marcos com fontes válidas', () => {
    const t = preparar(); assert.equal(t.cards.length, 9);
    for (const card of t.cards) {
        const perfil = campeoes[card.dataset.campeao];
        assert.ok(perfil.marcos.length > 0);
        perfil.marcos.forEach(marco => assert.ok(fontes[marco.fonte]?.startsWith('https://www.betim.mg.gov.br/')));
        assert.equal(card.children[0]['aria-haspopup'], 'dialog');
    }
});

test('cada botão abre os dados corretos e o fechamento restaura foco e rolagem', () => {
    const t = preparar();
    for (const card of t.cards) {
        const perfil = campeoes[card.dataset.campeao], botao = card.children[0];
        botao.handlers.click();
        assert.equal(t.dialog.open, true);
        assert.equal(t.elementos['campeao-nome'].textContent, card.querySelector('h3').textContent);
        assert.equal(t.elementos['campeao-descricao'], undefined);
        assert.equal(t.elementos['campeao-timeline'].children.length, perfil.marcos.length);
        assert.equal(t.document.body.style.overflow, 'hidden');
        t.fechar.handlers.click();
        assert.equal(t.dialog.open, false); assert.equal(botao.focado, true);
        assert.equal(t.document.body.style.overflow, 'auto');
    }
});

test('fundo fecha a janela e clique interno mant?m a timeline aberta', () => {
    const t = preparar(); t.cards[0].children[0].handlers.click();
    const dentro = { target: t.dialog, clientX: 100, clientY: 100 };
    t.dialog.handlers.pointerdown(dentro); t.dialog.handlers.click(dentro);
    assert.equal(t.dialog.open, true);
    const fora = { target: t.dialog, clientX: 0, clientY: 0 };
    t.dialog.handlers.pointerdown(fora); t.dialog.handlers.click(fora);
    assert.equal(t.dialog.open, false);
    t.cards[1].children[0].handlers.click();
});

test('janela cont?m timeline sem fotos ou legendas', () => {
    const janela = html.match(/<dialog[\s\S]*?<\/dialog>/)[0];
    assert.doesNotMatch(janela, /<img|<figure|<figcaption|campeao-foto/);
    assert.match(janela, /id="campeao-timeline"/);
});

test('descrições dos nove perfis ficam ocultas nos cards', () => {
    const cards = [...html.matchAll(/<article class="hall-card"[\s\S]*?<\/article>/g)];
    assert.equal(cards.length, 9);
    for (const [card] of cards) assert.match(card, /<p class="hall-description" hidden>[^<]+<\/p>/);
});
