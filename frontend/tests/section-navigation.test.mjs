import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const codigo = readFileSync(new URL('../public/js/section-navigation.js', import.meta.url), 'utf8');

function preparar(type, hash = '') {
    const listeners = new Map(), sections = [], scrolls = [];
    const document = { readyState: 'loading', getElementById(id) { sections.push(id); return null; }, querySelector() { return null; } };
    const window = { location: { hash }, history: { scrollRestoration: 'auto', pushState() {} },
        performance: { getEntriesByType: () => [{ type }] }, scrollTo: (...args) => scrolls.push(args),
        addEventListener: (event, listener) => listeners.set(event, listener) };
    const context = { document, window };
    runInNewContext(codigo, context);
    return { context, document, listeners, sections, window, scrolls };
}

test('recarga inicia no topo e preserva fragmentos após o carregamento inicial', () => {
    const page = preparar('reload', '#noticias');
    assert.equal(page.window.history.scrollRestoration, 'manual');
    assert.equal(page.scrolls.length, 1);
    assert.equal(page.scrolls[0][1], 0);

    page.context.scrollToCurrentSection();
    page.document.readyState = 'complete';
    page.listeners.get('load')();
    assert.deepEqual(page.sections, []);
    assert.equal(page.window.history.scrollRestoration, 'auto');
    assert.equal(page.scrolls.at(-1)[0], 0);
    assert.equal(page.scrolls.at(-1)[1], 0);

    page.window.location.hash = '#escola';
    page.listeners.get('hashchange')();
    assert.deepEqual(page.sections, ['escola']);
});

test('navegação normal continua resolvendo o fragmento na carga', () => {
    const page = preparar('navigate', '#noticias');
    page.listeners.get('load')();
    assert.deepEqual(page.sections, ['noticias']);
    assert.equal(page.window.history.scrollRestoration, 'auto');
});
