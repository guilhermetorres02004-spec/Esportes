import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeHomeUrl } from '../src/home/canonical-url.js';

test('index.html vira / preservando parâmetros, seção e estado do histórico', () => {
    const state = { pagina: 'inicio' };
    const history = { state, replaceState(...args) { this.args = args; } };
    normalizeHomeUrl({ pathname: '/index.html', search: '?origem=portal', hash: '#noticias' }, history);
    assert.deepEqual(history.args, [state, '', '/?origem=portal#noticias']);
});
test('outras páginas e a raiz mantêm seus endereços', () => {
    for (const pathname of ['/', '/conquistas.html', '/login.html']) {
        normalizeHomeUrl({ pathname }, { replaceState() { assert.fail('Endereço não deve mudar'); } });
    }
});
