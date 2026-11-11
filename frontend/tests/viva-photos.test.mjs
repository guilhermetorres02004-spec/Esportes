import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { selecionarFotosViva } from '../src/home/fotos-utils.js';

const fotos = Array.from({ length: 7 }, (_, i) => ({ id: String(i).padStart(32, 'a'), titulo: `Viva o Esporte ${i}`,
    origem: `https://www.betim.mg.gov.br/portal/noticias/0/3/${100 + i}/viva-o-esporte/`,
    url: `/api/fotos/imagens/${String(i).padStart(32, 'a')}`, categorias: ['atividades'] }));
const bundle = await build({ entryPoints: [fileURLToPath(new URL('../src/home/VivaPhotos.jsx', import.meta.url))],
    bundle: true, write: false, platform: 'node', format: 'cjs', external: ['react'], logLevel: 'silent' });

function mount(lista) {
    const effects = [], timers = [], updates = [], states = [lista, new Set(), 0];
    const react = { createElement: (type, props, ...children) => ({ type, props, children }),
        useState: () => [states.shift(), value => updates.push(value)], useEffect: fn => effects.push(fn) };
    const document = { hidden: false, addEventListener() {}, removeEventListener() {} };
    const fetch = async () => ({ ok: false });
    const module = { exports: {} };
    new Function('require', 'module', 'exports', 'document', 'fetch', 'setInterval', 'clearInterval', bundle.outputFiles[0].text)(
        () => react, module, module.exports, document, fetch,
        (fn, delay) => { const timer = { fn, delay, cleared: false }; timers.push(timer); return timer; }, timer => { timer.cleared = true; });
    const tree = module.exports.default();
    const cleanups = effects.map(fn => fn());
    return { tree, timers, updates, document, cleanup: () => cleanups.forEach(fn => fn?.()) };
}

test('Viva seleciona no máximo cinco fotos oficiais distintas e rejeita origens externas', () => {
    const selecao = selecionarFotosViva([fotos[0], fotos[0], { ...fotos[1], origem: 'https://exemplo.com' }, ...fotos]);
    assert.equal(selecao.length, 5);
    assert.equal(new Set(selecao.map(f => f.url)).size, 5);
    assert.deepEqual(selecionarFotosViva(null), []);
});

test('fotos avançam a cada nove segundos, voltam ao início e não avançam em aba oculta', () => {
    const view = mount(fotos.slice(0, 5));
    const rotation = view.timers.find(timer => timer.delay === 9000);
    assert.ok(rotation);
    rotation.fn();
    assert.equal(view.updates[0](0), 1);
    assert.equal(view.updates[0](4), 0);
    view.document.hidden = true;
    rotation.fn();
    assert.equal(view.updates.length, 1);
    view.cleanup();
    assert.ok(view.timers.every(timer => timer.cleared));
});

test('sem fotos mantém imagem oficial original e foto única não cria rotação', () => {
    for (const lista of [[], [fotos[0]]]) {
        const view = mount(lista);
        assert.ok(!view.timers.some(timer => timer.delay === 9000));
        if (!lista.length) assert.equal(view.tree.children[0].props.src, '/Imagens/2026/viva-esporte-2026.jpg');
        view.cleanup();
    }
});
