import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const codigo = readFileSync(new URL('../public/js/portal-header-scroll.js', import.meta.url), 'utf8');
function preparar(observer = true) {
    let bottom = 100, compacto = false, observar;
    const marcas = [{ hidden: true }, { hidden: true }], eventos = {};
    const faixa = { getBoundingClientRect: () => ({ bottom }) };
    const nav = { classList: { toggle(nome, ativo) { assert.equal(nome, 'portal-header-compact'); compacto = ativo; } } };
    const window = { addEventListener: (nome, handler) => { eventos[nome] = handler; } };
    if (observer) window.IntersectionObserver = class { constructor(handler) { observar = handler; } observe(elemento) { assert.equal(elemento, faixa); } };
    const document = { querySelector: () => faixa, getElementById: () => nav, querySelectorAll: () => marcas };
    runInNewContext(codigo, { document, window });
    return { marcas, eventos, compacto: () => compacto, mover(value) { bottom = value; (observar || eventos.scroll)(); } };
}
test('marcas entram somente após a faixa sair e desaparecem ao retornar ao topo', () => {
    const t = preparar(); assert.equal(t.compacto(), false); assert.ok(t.marcas.every(m => m.hidden));
    t.mover(1); assert.equal(t.compacto(), false);
    t.mover(0); assert.equal(t.compacto(), true); assert.ok(t.marcas.every(m => !m.hidden));
    t.mover(50); assert.equal(t.compacto(), false); assert.ok(t.marcas.every(m => m.hidden));
});
test('fallback de scroll, resize e retorno à página atualizam as marcas', () => {
    const t = preparar(false); t.mover(-20); assert.equal(t.compacto(), true);
    t.eventos.resize(); t.eventos.pageshow(); assert.equal(t.compacto(), true);
});
