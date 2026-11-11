import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../public/js/portal-libras.js', import.meta.url), 'utf8');
function tela() {
    const nodes = [], barra = [];
    const document = {
        getElementById: id => [...nodes, ...barra].find(node => node.id === id),
        querySelector: selector => selector === '.portal-accessibility-bar' ? { append: node => barra.push(node) }
            : nodes.find(node => selector.includes(node.src)),
        createElement: tag => ({ tag, setAttribute(name, value) { this[name] = value; } }),
        body: { append: node => nodes.push(node) },
    };
    return { nodes, barra, executar: () => vm.runInNewContext(source, { document }) };
}

test('carrega uma única instância assíncrona do script oficial de Libras', () => {
    const t = tela(); t.executar(); t.executar();
    assert.equal(t.nodes.length, 1);
    assert.equal(t.nodes[0].src, 'https://vlibras.gov.br/app/vlibras-plugin.js');
    assert.equal(t.nodes[0].async, true);
    assert.doesNotMatch(source, /new.*Widget/);
});

test('falha do serviço é informada sem duplicar aviso ou bloquear a página', () => {
    const t = tela(); t.executar(); t.nodes[0].onerror(); t.nodes[0].onerror();
    assert.equal(t.barra.length, 1);
    assert.equal(t.barra[0].role, 'status');
    assert.match(t.barra[0].textContent, /tradutor de Libras não carregou/);
});

test('cabeçalho compartilhado integra Libras também no shell React', () => {
    const header = readFileSync(new URL('../public/js/portal-header.js', import.meta.url), 'utf8');
    assert.match(header, /librasScript.src = '\/js\/portal-libras.js'/);
    const shell = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
    assert.match(shell, /src="\/js\/portal-header.js"/);
});
