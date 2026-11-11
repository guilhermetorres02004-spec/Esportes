import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { filtrosVazios, filtrarEquipamentos, comoChegar, catalogoValido } from '../src/regionais/regionais-utils.js';

const data = JSON.parse(readFileSync(new URL('../public/data/regionais.json', import.meta.url)));
const bundle = await build({ entryPoints: [fileURLToPath(new URL('../src/regionais/RegionaisPage.jsx', import.meta.url))], bundle: true,
    write: false, platform: 'node', format: 'cjs', external: ['react'], loader: { '.css': 'empty' }, logLevel: 'silent' });
const module = { exports: {} };
new Function('require', 'module', 'exports', bundle.outputFiles[0].text)(createRequire(import.meta.url), module, module.exports);

test('catálogo contém dez regionais, apenas fotos reais locais e nenhuma fronteira inventada', () => {
    assert.ok(catalogoValido(data));
    assert.equal(new Set(data.regionais.map(item => item.id)).size, 10);
    assert.equal(data.limitesGeojson, null);
    assert.equal(data.equipamentos.length, 30);
    for (const item of data.equipamentos) {
        assert.ok(item.regionais.every(id => data.regionais.some(regional => regional.id === id)));
        assert.match(item.fonte, /^https:\/\/regionais\.betim\.digital\//);
        if (item.foto) assert.ok(existsSync(new URL(`../public${item.foto}`, import.meta.url)), item.nome);
        assert.equal(item.coordenadas, null);
    }
    assert.doesNotMatch(JSON.stringify(data), /placehold\.co|unsplash/);
});

test('os cinco filtros funcionam isolados e combinados e aceitam resultado vazio', () => {
    assert.equal(filtrarEquipamentos(data.equipamentos, filtrosVazios).length, 30);
    const item = data.equipamentos.find(item => item.programas.length && item.modalidades.length)
        || { ...data.equipamentos[0], modalidades: ['Caminhada'], programas: ['Programa verificado'] };
    const items = [item, { ...item, id: 'outro', bairro: 'Outro bairro', modalidades: [], programas: [] }];
    const filtros = { regional: item.regionais[0], bairro: item.bairro, modalidade: item.modalidades[0], tipo: item.tipo, programa: item.programas[0] };
    assert.equal(filtrarEquipamentos(items, filtros).length, 1);
    for (const key of Object.keys(filtros)) assert.ok(filtrarEquipamentos(items, { ...filtrosVazios, [key]: filtros[key] }).length >= 1);
    assert.equal(filtrarEquipamentos(items, { ...filtros, bairro: 'Sem local cadastrado' }).length, 0);
});

test('Como chegar codifica o nome e endereço sem criar coordenadas', () => {
    const item = data.equipamentos[0], url = new URL(comoChegar(item));
    assert.equal(url.hostname, 'www.google.com');
    assert.ok(url.searchParams.get('query').includes(item.endereco));
});

test('página integrada tem seleção das dez regionais, filtros, detalhes e estado pendente', () => {
    const anterior = globalThis.window;
    globalThis.window = { location: { search: '' } };
    try {
        const html = renderToStaticMarkup(React.createElement(module.exports.default, { initialCatalog: data }));
        assert.equal((html.match(/<h1\b/g) || []).length, 1);
        assert.match(html, /O esporte mais perto de você/);
        assert.equal((html.match(/<select\b/g) || []).length, 5);
        assert.match(html, /Mapa territorial pendente/);
        assert.match(html, /Como chegar/);
        assert.match(html, /Programa Viva o Esporte/);
        assert.match(html, /Rodapé institucional/);
        assert.doesNotMatch(html, /Administrar catálogo/);
        const home = readFileSync(new URL('../src/home/Sections.jsx', import.meta.url), 'utf8');
        assert.match(home, /title: 'Núcleos'[^\n]+href: '\/esporte-nas-regionais'/);
    } finally { globalThis.window = anterior; }
});
