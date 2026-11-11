import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { consultarSessao } from '../src/admin/admin-session.js';
import { documentosAdministrativos } from '../public/js/admin-documentos-data.js';

async function componente(arquivo) {
    const bundle = await build({ entryPoints: [fileURLToPath(new URL('../src/admin/' + arquivo, import.meta.url))], bundle: true,
        write: false, platform: 'node', format: 'cjs', external: ['react'], loader: { '.css': 'empty' }, logLevel: 'silent' });
    const module = { exports: {} };
    new Function('require', 'module', 'exports', bundle.outputFiles[0].text)(createRequire(import.meta.url), module, module.exports);
    return module.exports.default;
}
test('guarda exige sessão válida, envia cookie e não usa cache', async () => {
    const signal = new AbortController().signal;
    const conta = await consultarSessao({ signal, fetcher: async (url, options) => {
        assert.equal(url, '/api/auth/me'); assert.equal(options.credentials, 'include');
        assert.equal(options.cache, 'no-store'); assert.equal(options.signal, signal);
        return { ok: true, json: async () => ({ username: 'teste' }) };
    } });
    assert.equal(conta.username, 'teste');
    for (const data of [null, {}, { username: '' }, { username: ' ' }, { username: 123 }])
        await assert.rejects(consultarSessao({ fetcher: async () => ({ ok: true, json: async () => data }) }));
    await assert.rejects(consultarSessao({ fetcher: async () => ({ ok: false, status: 401 }) }));
});
test('painel não mostra informações administrativas antes da verificação de sessão', async () => {
    const Page = await componente('AdminPage.jsx');
    const html = renderToStaticMarkup(React.createElement(Page));
    assert.match(html, /Verificando acesso/); assert.doesNotMatch(html, /664\.797|Quadro de Cargos|data-documento/);
});
test('conteúdo preserva doze documentos, tabelas e agendamento; cada botão envia o ID correto', async () => {
    const Content = await componente('AdminContent.jsx'); const ids = [];
    const tree = Content({ onDocument: id => ids.push(id) });
    function visitar(node) { if (!React.isValidElement(node)) return;
        if (node.props['data-documento']) node.props.onClick();
        React.Children.forEach(node.props.children, visitar);
    }
    visitar(tree); assert.equal(ids.length, 12); ids.forEach(id => assert.ok(documentosAdministrativos[id]));
    const html = renderToStaticMarkup(tree);
    for (const texto of ['Gestão Administrativa', '664.797,00', '582.372,18', 'Quadro de Cargos', '/agendamento-quadras.html']) assert.ok(html.includes(texto));
    assert.equal((html.match(/<h1/g) || []).length, 1); assert.match(html, /scope="col"/);
});
test('documentos preservam PDF e resumo conforme disponibilidade e ações internas na mesma aba', async () => {
    const Document = await componente('AdminDocument.jsx');
    for (const dados of Object.values(documentosAdministrativos)) {
        const html = renderToStaticMarkup(React.createElement(Document, { dados, onClose() {} }));
        assert.ok(html.includes(dados.titulo)); assert.match(html, /aria-labelledby="adminDocumentoTitulo"/);
        if (dados.pdf) { assert.match(html, /<iframe/); assert.ok(html.includes(dados.pdf)); }
        else { assert.doesNotMatch(html, /<iframe/); assert.match(html, /Resumo de consulta/); }
        if (dados.acao) assert.match(html, /href="\/almoxarifado.html"/);
    }
});
test('build publica entrada limpa e redirecionamento compatível', () => {
    assert.match(readFileSync(new URL('../dist/administrativo/index.html', import.meta.url), 'utf8'), /id="root"/);
    assert.match(readFileSync(new URL('../dist/administrativo.html', import.meta.url), 'utf8'), /location.replace\("\/administrativo"/);
});
