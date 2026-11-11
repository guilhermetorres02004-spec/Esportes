import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { tipoDoEquipamento, equipamentosNoMapa, pontoDoEquipamento } from '../src/regionais/equipment-map.js';

const dados = JSON.parse(readFileSync(new URL('../src/regionais/pins-regionais.json', import.meta.url)));
const catalogo = JSON.parse(readFileSync(new URL('../public/data/regionais.json', import.meta.url)));
const bundle = await build({ entryPoints: [fileURLToPath(new URL('../src/regionais/RegionalMap.jsx', import.meta.url))],
    bundle: true, write: false, platform: 'node', format: 'cjs', external: ['react'], logLevel: 'silent' });

function montar(regional, equipamentos = []) {
    const effects = [], markers = [], clicks = [], views = [], fits = [], details = [];
    let removed = false;
    const map = { getZoom: () => 13, fitBounds(points) { fits.push(points); }, setView(...args) { views.push(args); }, remove() { removed = true; } };
    const L = { map: () => map, divIcon: options => options,
        layerGroup: () => ({ addTo() { return this; }, clearLayers() {} }),
        tileLayer: () => ({ addTo: () => ({ on() {} }) }),
        marker: (coords, options) => {
            const marker = { coords, options, handlers: {}, addTo() { markers.push(this); return this; },
                bindTooltip() {}, on(event, fn) { this.handlers[event] = fn; },
                setIcon(icon) { this.options.icon = icon; }, setZIndexOffset() {},
                bindPopup(popup) { this.popup = popup; this.handlers.click = () => { this.open = !this.open; }; return this; }, openPopup() { this.open = true; } };
            return marker;
        } };
    const react = { createElement: () => null, useRef: value => ({ current: value }), useState: value => [value, () => {}], useEffect: fn => effects.push(fn) };
    const module = { exports: {} };
    const document = { createElement: tag => ({ tag, children: [], handlers: {}, setAttribute(name, value) { this[name] = value; },
        append(...nodes) { this.children.push(...nodes); }, addEventListener(event, fn) { this.handlers[event] = fn; } }), createTextNode: text => ({ textContent: text }) };
    new Function('require', 'module', 'exports', 'window', 'document', bundle.outputFiles[0].text)(
        () => react, module, module.exports, { L }, document);
    module.exports.default({ regional, equipamentos, regionais: catalogo.regionais, onSelect: id => clicks.push(id), onDetails: item => details.push(item) });
    const cleanups = effects.map(fn => fn());
    return { markers, clicks, views, fits, details, cleanup: () => cleanups.forEach(fn => fn?.()), removed: () => removed };
}

test('há um ponto verificado por regional e todos têm proveniência OSM', () => {
    assert.equal(dados.pins.length, 10);
    assert.deepEqual(dados.pins.map(p => p.id).sort(), catalogo.regionais.map(p => p.id).sort());
    for (const pin of dados.pins) {
        assert.equal(pin.coordenadas.length, 2);
        assert.ok(pin.coordenadas.every(Number.isFinite));
        assert.match(pin.fonte, /^https:\/\/www.openstreetmap.org\/relation\/\d+$/);
    }
});

test('mapa inicial cria dez pins clicáveis e informa a regional correta ao clicar', () => {
    const view = montar();
    assert.equal(view.markers.length, 10);
    for (const [index, marker] of view.markers.entries()) {
        assert.equal(marker.options.keyboard, true);
        marker.handlers.click();
        assert.equal(view.clicks[index], dados.pins[index].id);
    }
    assert.equal(view.fits[0].length, 10);
    view.cleanup(); assert.equal(view.removed(), true);
});

test('seleção destaca somente o pin da regional escolhida', () => {
    const regional = catalogo.regionais.find(item => item.id === 'norte');
    const view = montar(regional);
    const selected = view.markers.filter(marker => marker.options.icon.className.includes('selected'));
    assert.equal(selected.length, 1);
    assert.deepEqual(selected[0].coords, dados.pins.find(pin => pin.id === regional.id).coordenadas);
    assert.equal(view.views.length, 0);
    assert.equal(view.fits.length, 1);
    view.cleanup();
});

test('local com coordenada abre balão sem alterar zoom; Conhecer espaço recebe o registro correto', () => {
    const regional = catalogo.regionais.find(item => item.id === 'centro');
    const item = catalogo.equipamentos.find(item => item.nome === 'Campo Cidade Verde');
    const view = montar(regional, [item]);
    const marker = view.markers.find(marker => marker.options.icon.className.includes('equipment-map-pin'));
    assert.ok(marker);
    assert.match(marker.options.icon.html, /fa-futbol/);
    marker.handlers.click();
    assert.equal(view.views.length, 0);
    assert.equal(view.fits.length, 1);
    assert.equal(marker.open, true);
    marker.handlers.click();
    assert.equal(marker.open, false, 'segundo clique mantém o fechamento nativo do Leaflet');
    const body = marker.popup.children[1];
    body.children.at(-1).handlers.click();
    assert.equal(view.details[0].id, item.id);
    assert.equal(body.children[0].children[0].textContent, item.nome);
    view.cleanup();
});

test('ícones identificam as categorias e locais sem coordenadas não recebem posição fictícia', () => {
    for (const [nome, tipo] of [['Campo do Horto', 'campo'], ['Quadra Cidade Verde', 'quadra'], ['Praça do Encontro', 'praca'], ['Complexo Esportivo', 'complexo'], ['Pista de Bicicross', 'pista']])
        assert.equal(tipoDoEquipamento({ nome }).id, tipo);
    const item = { id: 'sem-localizacao', nome: 'Quadra sem posição', regionais: ['centro'], coordenadas: null };
    assert.equal(pontoDoEquipamento(item), null);
    assert.deepEqual(equipamentosNoMapa([item], { id: 'centro' }), []);
    assert.deepEqual(equipamentosNoMapa(catalogo.equipamentos, null), []);
});
