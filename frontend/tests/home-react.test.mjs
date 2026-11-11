import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const require = createRequire(import.meta.url);
const compilado = await build({ entryPoints: [fileURLToPath(new URL('../Home.jsx', import.meta.url))],
    bundle: true, write: false, platform: 'node', format: 'cjs', jsx: 'automatic',
    external: ['react', 'react-dom'], loader: { '.css': 'empty' }, logLevel: 'silent' });
const modulo = { exports: {} };
new Function('require', 'module', 'exports', compilado.outputFiles[0].text)(require, modulo, modulo.exports);
const html = renderToStaticMarkup(React.createElement(modulo.exports.default));

test('página principal React preserva as seções e os indicadores do portal', () => {
    for (const id of ['home', 'noticias', 'video-destaque', 'atividades-esportivas', 'escola', 'viva-esporte', 'map-section', 'indicadores-finais'])
        assert.match(html, new RegExp(`id="${id}"`));
    assert.doesNotMatch(html, /id="rendimento"|Esporte de Rendimento/);
    assert.match(html, /1\.452 Medalhas/);
    assert.match(html, /href="conquistas.html"/);
    assert.match(html, /Betim respira esporte/);
    assert.match(html, /Conheça as modalidades, encontre onde treinar/);
    assert.match(html, /Prefeitura de Betim/);
});

test('carrossel React mantém três fotos, os créditos e somente um slide acessível', () => {
    assert.equal((html.match(/class="slide(?: active)?"/g) || []).length, 3);
    assert.equal((html.match(/class="slide active"/g) || []).length, 1);
    assert.match(html, /class="slide active" aria-hidden="false"/);
    assert.equal((html.match(/class="slide" aria-hidden="true"/g) || []).length, 2);
    assert.match(html, /class="photo-credit" tabindex="0"/);
    assert.doesNotMatch(html, /dangerouslySetInnerHTML/);
});

test('escola apresenta 22 atividades e setas laterais de navegação', () => {
    const escola = html.match(/<section id="escola"[\s\S]*?<\/section>/)[0];
    const nomes = [...escola.matchAll(/<li class="escola-card"><a[^>]*><i[^>]*><\/i><p>(.*?)<\/p>/g)].map(item => item[1]);
    assert.equal(nomes.length, 22);
    assert.equal(new Set(nomes).size, 22);
    const links = [...escola.matchAll(/<a class="school-card-link" href="([^"]+)"/g)].map(item => item[1]);
    assert.equal(links.length, 22);
    assert.equal(new Set(links).size, 22);
    assert.equal((escola.match(/Equipe competitiva/g) || []).length, 2);
    for (const nome of ['Futsal', 'Judô', 'Bicicross', 'Natação', 'Ginástica Rítmica']) assert.ok(nomes.includes(nome));
    assert.doesNotMatch(escola, /school-carousel-controls/);
    assert.equal((escola.match(/<button/g) || []).length, 2);
    assert.match(escola, /aria-label="Modalidade anterior"/);
    assert.match(escola, /aria-label="Próxima modalidade"/);
    assert.match(escola, /Lista de modalidades/);
    assert.match(escola, /As atividades variam por núcleo/);
});

test('home tem um título principal e os atalhos apontam para conteúdo focável', () => {
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.match(html, /<h1>Betim respira esporte<\/h1>/);
    assert.equal((html.match(/<main\b/g) || []).length, 1);
    assert.match(html, /<main id="conteudo" tabindex="-1">/);
    const entrada = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
    const links = [...entrada.split('<body')[1].matchAll(/<a\b[^>]*href="([^"]*)"/g)].map(link => link[1]);
    assert.deepEqual(links.slice(0, 2), ['#conteudo', '#portal-site-header']);
});

test('entrada React mantém cabeçalho compartilhado e catálogo de suporte com as três seções', () => {
    const entrada = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
    assert.match(entrada, /data-react-home="true"/);
    assert.match(entrada, /id="root"/);
    assert.match(entrada, /src="\/src\/main.jsx"/);
    assert.match(entrada, /src="\/js\/portal-header.js"/);
    assert.doesNotMatch(entrada, /setInterval|innerHTML|L\.map/);
    const base = JSON.parse(readFileSync(new URL('../public/docs/suporte/base.json', import.meta.url), 'utf8'));
    for (const id of ['atividades-esportivas', 'escola', 'viva-esporte'])
        assert.ok(base.documentos.find(d => d.id === `inicio-${id}`)?.texto.length > 100);
});
