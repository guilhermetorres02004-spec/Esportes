import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { modalidadesEscola } from '../src/modalidades/catalog.js';
import { resolveModalidade, normalizeModalidadeUrl } from '../src/modalidades/routes.js';
import { readFileSync } from 'node:fs';

const content = JSON.parse(readFileSync(new URL('../src/modalidades/content.json', import.meta.url)));
const bundle = await build({ entryPoints: [fileURLToPath(new URL('../src/modalidades/ModalidadePage.jsx', import.meta.url))],
    bundle: true, write: false, platform: 'node', format: 'cjs', external: ['react'], loader: { '.css': 'empty' }, logLevel: 'silent' });
const module = { exports: {} };
new Function('require', 'module', 'exports', bundle.outputFiles[0].text)(createRequire(import.meta.url), module, module.exports);

test('22 páginas React renderizam título próprio, conteúdo e galeria sem scripts HTML', () => {
    for (const item of modalidadesEscola) {
        const html = renderToStaticMarkup(React.createElement(module.exports.default, { modalidade: item }));
        assert.equal((html.match(/<h1\b/g) || []).length, 1, item.id);
        assert.match(html, /<main[^>]*id="conteudo"/);
        assert.doesNotMatch(html, /<script|onclick=|onerror=/);
        assert.ok(html.includes(item.nome.split(' ')[0]), item.id);
        if (!item.existente) {
            assert.match(html, /modalidade-sidebar/);
            assert.match(html, /fotos oficiais/i);
            if (!item.tipo) assert.match(html, /target="_blank" rel="noopener noreferrer">Consultar participação/);
        }
    }
});

test('rotas antigas e caminhos sem extensão resolvem para a mesma modalidade', () => {
    for (const item of modalidadesEscola) {
        assert.equal(resolveModalidade(item.href), item);
        assert.equal(resolveModalidade(item.href + '/'), item);
        const history = { state: { teste: 1 }, replaceState(...args) { this.args = args; } };
        assert.equal(normalizeModalidadeUrl({ pathname: '/' + item.legacyHref, search: '?origem=menu', hash: '#conteudo' }, history), item);
        assert.deepEqual(history.args, [history.state, '', item.href + '?origem=menu#conteudo']);
    }
    assert.equal(resolveModalidade('/agenda.html'), null);
    assert.equal(resolveModalidade('/inexistente'), null);
});

test('Futebol preserva oito núcleos do mapa e links de inscrição', () => {
    assert.equal(content['futebol-campo'].locations.length, 8);
    assert.ok(content['futebol-campo'].locations.every(item => item.coords.length === 2 && item.coords.every(Number.isFinite)));
    const item = modalidadesEscola.find(item => item.id === 'futebol-campo');
    const html = renderToStaticMarkup(React.createElement(module.exports.default, { modalidade: item }));
    assert.match(html, /id="mapaFutebol"/);
    assert.match(html, /href="\/Inscricao.html\?modalidade=futebol"/);
    assert.match(html, /Bom de Bola/);
});
