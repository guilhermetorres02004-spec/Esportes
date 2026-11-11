import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { modalidadesEscola } from '../src/modalidades/catalog.js';

test('cada modalidade tem um destino local distinto e uma página existente', () => {
    assert.equal(modalidadesEscola.length, 22);
    assert.equal(new Set(modalidadesEscola.map(item => item.href)).size, 22);
    for (const item of modalidadesEscola) {
        assert.match(item.href, /^\/[a-z-]+$/);
        const pagina = new URL(`../${item.legacyHref}`, import.meta.url);
        assert.ok(existsSync(pagina), item.href);
        const html = readFileSync(pagina, 'utf8');
        assert.match(html, /<h1\b/);
        assert.match(html, /\/js\/portal-header.js/);
        if (item.existente) continue;
        assert.match(html, /class="modalidade-hero"/);
        assert.match(html, /class="modalidade-sidebar"/);
        assert.ok(html.includes(`data-fotos-galeria="${item.id}"`));
        assert.match(html, /href="agenda.html"/);
        assert.ok(html.includes(`<h1>${item.nome}</h1>`), item.href);
        assert.ok(html.includes(item.fonte), item.href);
        assert.match(html, /href="\/#escola"/);
        assert.match(html, /id="conteudo"/);
        for (const nucleo of item.nucleos) assert.ok(html.includes(nucleo), `${item.nome}: ${nucleo}`);
        if (item.tipo) assert.match(html, /não representa inscrição ou seletiva aberta atualmente/);
        else assert.match(html, /<a class="modalidade-action" href="[^"]+" target="_blank" rel="noopener noreferrer">Consultar participação<\/a>/);
    }
});
