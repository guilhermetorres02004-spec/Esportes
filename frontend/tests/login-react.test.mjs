import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { autenticar, destinoDoLogin } from '../src/login/login-service.js';

test('login mantém contrato do Spring e codifica as credenciais sem perder caracteres', async () => {
    const signal = new AbortController().signal;
    await autenticar('usuário+teste', 'senha&= teste', { signal, fetcher: async (url, options) => {
        assert.equal(url, '/login'); assert.equal(options.method, 'POST'); assert.equal(options.credentials, 'include');
        assert.equal(options.signal, signal); assert.equal(options.headers['Content-Type'], 'application/x-www-form-urlencoded');
        assert.equal(new URLSearchParams(options.body).get('username'), 'usuário+teste');
        assert.equal(new URLSearchParams(options.body).get('password'), 'senha&= teste');
        return { ok: true };
    } });
});
test('login distingue credenciais inválidas e falha de servidor e permite nova tentativa', async () => {
    await assert.rejects(autenticar('a', 'b', { fetcher: async () => ({ ok: false, status: 401 }) }), /Usuário ou senha inválidos/);
    await assert.rejects(autenticar('a', 'b', { fetcher: async () => ({ ok: false, status: 503 }) }), /acessar o servidor/);
    await assert.rejects(autenticar('a', 'b', { fetcher: async () => { throw new TypeError('offline'); } }), TypeError);
    await autenticar('a', 'b', { fetcher: async () => ({ ok: true }) });
});
test('login sempre retorna à página principal, inclusive com parâmetro de continuação', () => {
    assert.equal(destinoDoLogin('?proxima=agendamento-quadras.html'), '/');
    for (const query of ['', '?proxima=https://example.org', '?proxima=//example.org', '?proxima=javascript:alert(1)'])
        assert.equal(destinoDoLogin(query), '/');
});
test('login React renderiza campos acessíveis e rodapé compartilhado; build preserva entrada antiga', async () => {
    const bundle = await build({ entryPoints: [fileURLToPath(new URL('../src/login/LoginPage.jsx', import.meta.url))], bundle: true,
        write: false, platform: 'node', format: 'cjs', external: ['react'], loader: { '.css': 'empty' }, logLevel: 'silent' });
    const module = { exports: {} };
    new Function('require', 'module', 'exports', bundle.outputFiles[0].text)(createRequire(import.meta.url), module, module.exports);
    const html = renderToStaticMarkup(React.createElement(module.exports.default));
    assert.match(html, /id="conteudo"/); assert.match(html, /for="username"/); assert.match(html, /autoComplete="current-password"/);
    assert.match(html, /Rodapé institucional/); assert.match(html, /type="submit"/); assert.doesNotMatch(html, /error-msg/);
    assert.match(readFileSync(new URL('../dist/entrar/index.html', import.meta.url), 'utf8'), /id="root"/);
    assert.match(readFileSync(new URL('../dist/login.html', import.meta.url), 'utf8'), /location.replace\("\/entrar"/);
});
