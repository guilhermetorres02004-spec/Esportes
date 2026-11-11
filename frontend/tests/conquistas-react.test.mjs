import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { fileURLToPath } from 'node:url';

const bundle = await build({ entryPoints: [fileURLToPath(new URL('../src/conquistas/ConquistasPage.jsx', import.meta.url))], bundle: true,
    write: false, platform: 'node', format: 'cjs', external: ['react'], loader: { '.css': 'empty' }, logLevel: 'silent' });
const module = { exports: {} };
new Function('require', 'module', 'exports', bundle.outputFiles[0].text)(createRequire(import.meta.url), module, module.exports);
test('página React preserva nove perfis, anos, fontes e botões de trajetória', () => {
    const html = renderToStaticMarkup(React.createElement(module.exports.default));
    assert.equal((html.match(/class="hall-card"/g) || []).length, 9);
    for (const nome of ['Raysa Mendonça', 'Juliana da Silva', 'Eduardo Monteiro', 'Raphael Assis']) assert.ok(html.includes(nome));
    assert.ok(html.includes('id="conquistas-2026"')); assert.ok(html.includes('id="conquistas-2025"'));
    assert.equal((html.match(/aria-haspopup="dialog"/g) || []).length, 9);
    assert.ok(html.includes('role="status"')); assert.ok(html.includes('id="conteudo"'));
    assert.ok(!html.includes('/js/conquistas.js'));
});
test('build publica rota React limpa e redirecionamento do HTML antigo', () => {
    const page = readFileSync(new URL('../dist/conquistas/index.html', import.meta.url), 'utf8');
    const legacy = readFileSync(new URL('../dist/conquistas.html', import.meta.url), 'utf8');
    assert.match(page, /id="root"/); assert.match(page, /\/assets\/index-/);
    assert.match(legacy, /location.replace\("\/conquistas"/);
});
