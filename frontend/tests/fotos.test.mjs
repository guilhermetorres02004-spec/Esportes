import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fotoValida, fotosDaCategoria, creditoFoto } from '../public/js/fotos-utils.js';
import { fotoValida as fotoValidaReact } from '../src/home/fotos-utils.js';

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

test('React usa módulo de src e mantém a validação das páginas estáticas', () => {
    const componente = readFileSync(new URL('../src/home/OfficialPhotos.jsx', import.meta.url), 'utf8');
    assert.match(componente, /import \{ fotoValida \} from '\.\/fotos-utils\.js'/);
    assert.doesNotMatch(componente, /\/js\/fotos-utils\.js|@vite-ignore/);
    for (const candidata of [foto, null, { ...foto, origem: 'javascript:alert(1)' },
        { ...foto, origem: 'https://exemplo.com/noticia' }, { ...foto, url: '/api/inscricoes' }]) {
        assert.equal(fotoValidaReact(candidata), fotoValida(candidata));
    }
});
test('créditos mantêm a Prefeitura e a data publicada', () => {
    assert.match(creditoFoto(foto), /Prefeitura de Betim.*01 NOV 2026/);
});
test('página principal e modalidades estão ligadas à atualização; Judô tem galeria', () => {
    const inicio = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
    assert.match(inicio, /data-react-home="true"/);
    assert.match(readFileSync(new URL('../src/home/Sections.jsx', import.meta.url), 'utf8'), /<VivaPhotos \/>/);
    assert.match(readFileSync(new URL('../src/home/VivaPhotos.jsx', import.meta.url), 'utf8'), /fetch\('\/api\/fotos\/viva-esporte'/);
    assert.match(readFileSync(new URL('../src/home/OfficialPhotos.jsx', import.meta.url), 'utf8'), /fetch\('\/api\/fotos'/);
    for (const pagina of ['futebol.html', 'volei.html', 'pilates.html', 'esporteteste.html']) {
        assert.match(readFileSync(new URL(`../${pagina}`, import.meta.url), 'utf8'), /data-foto-categoria=/);
    }
    assert.match(readFileSync(new URL('../detalhe-modalidade.html', import.meta.url), 'utf8'), /data-fotos-galeria="judo"/);
    assert.match(readFileSync(new URL('../public/js/portal-header.js', import.meta.url), 'utf8'), /portal-fotos\.js/);
});
