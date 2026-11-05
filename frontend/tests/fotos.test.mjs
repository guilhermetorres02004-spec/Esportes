import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fotoValida, fotosDaCategoria, creditoFoto } from '../public/js/fotos-utils.js';

const foto = { id: 'a'.repeat(32), titulo: 'Judô municipal', origem: 'https://www.betim.mg.gov.br/portal/noticias/0/3/123/judo/',
    url: '/api/fotos/imagens/' + 'a'.repeat(32), categorias: ['principal', 'judo'], publicadoEm: '01 NOV 2026' };
test('cada modalidade recebe somente fotos identificadas para ela', () => {
    assert.deepEqual(fotosDaCategoria([foto], 'judo'), [foto]);
    assert.deepEqual(fotosDaCategoria([foto], 'pilates'), []);
    assert.deepEqual(fotosDaCategoria([foto], 'futebol'), []);
    assert.equal(fotosDaCategoria([foto], 'principal').length, 1);
});
test('fontes externas e caminhos de arquivos arbitrários são rejeitados', () => {
    assert.equal(fotoValida(foto), true);
    for (const origem of ['javascript:alert(1)', 'https://exemplo.com/portal/noticias/0/3/123/a/', 'http://www.betim.mg.gov.br/portal/noticias/0/3/123/a/'])
        assert.equal(fotoValida({ ...foto, origem }), false);
    assert.equal(fotoValida({ ...foto, url: '/api/inscricoes' }), false);
});
test('créditos mantêm a Prefeitura e a data publicada', () => {
    assert.match(creditoFoto(foto), /Prefeitura de Betim.*01 NOV 2026/);
});
test('página principal e modalidades estão ligadas à atualização; Judô tem galeria', () => {
    for (const pagina of ['index.html', 'futebol.html', 'volei.html', 'pilates.html', 'esporteteste.html']) {
        assert.match(readFileSync(new URL(`../${pagina}`, import.meta.url), 'utf8'), /data-foto-categoria=/);
    }
    assert.match(readFileSync(new URL('../detalhe-modalidade.html', import.meta.url), 'utf8'), /data-fotos-galeria="judo"/);
    assert.match(readFileSync(new URL('../public/js/portal-header.js', import.meta.url), 'utf8'), /portal-fotos\.js/);
});
