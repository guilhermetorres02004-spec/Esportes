import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';

const bundle = await build({ entryPoints: [fileURLToPath(new URL('../src/home/SchoolCarousel.jsx', import.meta.url))],
    bundle: true, write: false, platform: 'node', format: 'cjs', external: ['react'], logLevel: 'silent' });

function mount({ paused = false, reduced = false } = {}) {
    const effects = [], moves = [], states = [paused, reduced];
    const node = { scrollLeft: 0, scrollWidth: 2200, clientWidth: 600,
        children: [], firstElementChild: { offsetWidth: 184 },
        scrollTo: options => { moves.push(options); node.scrollLeft = options.left; } };
    const react = { createElement: () => null, useRef: () => ({ current: node }),
        useState: () => [states.shift(), () => {}], useEffect: fn => effects.push(fn) };
    const document = { hidden: false };
    let tick, delay, cleared = false;
    const window = { matchMedia: () => ({ matches: reduced, addEventListener() {}, removeEventListener() {} }),
        setInterval: (fn, ms) => { tick = fn; delay = ms; return 7; }, clearInterval: id => { cleared = id === 7; } };
    const module = { exports: {} };
    const ResizeObserver = class { observe() {} disconnect() {} };
    new Function('require', 'module', 'exports', 'window', 'document', 'ResizeObserver', bundle.outputFiles[0].text)(
        () => react, module, module.exports, window, document, ResizeObserver);
    module.exports.default();
    const cleanups = effects.map(fn => fn());
    return { node, moves, document, tick, delay, scale: module.exports.cardScale, cleanup: () => cleanups.forEach(fn => fn?.()), wasCleared: () => cleared };
}

test('card central fica maior e as duas laterais diminuem simetricamente', () => {
    const view = mount();
    assert.equal(view.scale(0, 1000), 1);
    assert.equal(view.scale(-250, 1000), view.scale(250, 1000));
    assert.ok(view.scale(250, 1000) > view.scale(500, 1000));
    assert.equal(view.scale(500, 1000), 0.76);
    assert.equal(view.scale(2000, 1000), 0.76);
    view.cleanup();
});

test('escola avança um card a cada três segundos, volta ao início e limpa o temporizador', () => {
    const view = mount();
    assert.equal(view.delay, 3000);
    view.tick();
    assert.deepEqual(view.moves[0], { left: 200, behavior: 'smooth' });
    view.node.scrollLeft = 1600;
    view.tick();
    assert.deepEqual(view.moves[1], { left: 0, behavior: 'instant' });
    view.cleanup();
    assert.equal(view.wasCleared(), true);
});

test('pausa manual interrompe a rotação', () => {
    const view = mount({ paused: true });
    assert.equal(view.tick, undefined);
    view.cleanup();
});

test('movimento reduzido mantém o avanço automático sem animação', () => {
    const view = mount({ reduced: true });
    assert.equal(view.delay, 3000);
    view.tick();
    assert.deepEqual(view.moves[0], { left: 200, behavior: 'instant' });
    view.cleanup();
});

test('aba oculta não avança o carrossel', () => {
    const view = mount();
    view.document.hidden = true;
    view.tick();
    assert.deepEqual(view.moves, []);
    view.cleanup();
});
