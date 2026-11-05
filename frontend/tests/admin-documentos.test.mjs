import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { documentosAdministrativos, dataConsultaDocumentos } from '../public/js/admin-documentos-data.js';

const pagina = readFileSync(new URL('../administrativo.html', import.meta.url), 'utf8');
const codigo = readFileSync(new URL('../public/js/admin-documentos.js', import.meta.url), 'utf8')
    .replace(/^import[^\n]+\n/, '');

function preparar() {
    const elementos = new Map();
    function elemento() {
        return { handlers: {}, atributos: {}, children: [], hidden: false,
            addEventListener(tipo, handler) { this.handlers[tipo] = handler; },
            setAttribute(nome, valor) { this.atributos[nome] = valor; },
            removeAttribute(nome) { delete this[nome]; },
            replaceChildren() { this.children = []; }, appendChild(filho) { this.children.push(filho); },
            focus() {}, showModal() { this.open = true; },
            close() { this.open = false; this.handlers.close?.(); } };
    }
    const get = id => { if (!elementos.has(id)) elementos.set(id, elemento()); return elementos.get(id); };
    const botoes = Object.keys(documentosAdministrativos).map(id => ({ ...elemento(), dataset: { documento: id } }));
    const fechar = [elemento(), elemento()];
    get('adminDocumento').querySelectorAll = () => fechar;
    const contexto = createContext({ documentosAdministrativos, dataConsultaDocumentos,
        document: { getElementById: get, createElement: elemento, querySelectorAll: () => botoes } });
    runInContext(codigo, contexto);
    return { get, fechar, abrir(id) { botoes.find(botao => botao.dataset.documento === id).handlers.click(); } };
}

test('cada uma das 12 opções abre seu próprio texto, fonte e documento', () => {
    const ids = [...pagina.matchAll(/data-documento="([^"]+)"/g)].map(item => item[1]);
    assert.equal(ids.length, 12);
    assert.equal(new Set(ids).size, 12);
    assert.deepEqual([...ids].sort(), Object.keys(documentosAdministrativos).sort());
    const tela = preparar();
    for (const id of ids) {
        const dados = documentosAdministrativos[id];
        tela.abrir(id);
        assert.equal(tela.get('adminDocumento').open, true);
        assert.equal(tela.get('adminDocumentoTitulo').textContent, dados.titulo);
        assert.equal(tela.get('adminDocumentoSite').href, dados.fonte);
        assert.ok(tela.get('adminDocumentoFonte').textContent.includes(dados.origem));
        assert.ok(tela.get('adminDocumentoFonte').textContent.includes(dataConsultaDocumentos));
        assert.deepEqual(tela.get('adminDocumentoResumo').children.slice(1).map(item => item.textContent), dados.paragrafos);
        if (dados.pdf) {
            assert.ok(tela.get('adminDocumentoLeitor').src.startsWith(dados.pdf + '#page='));
            assert.equal(tela.get('adminDocumentoPdf').hidden, false);
        } else {
            assert.equal(tela.get('adminDocumentoResumo').hidden, false);
            assert.equal(tela.get('adminModoPdf').hidden, true);
        }
        tela.fechar[0].handlers.click();
        assert.equal(tela.get('adminDocumento').open, false);
        assert.equal(tela.get('adminDocumentoLeitor').src, 'about:blank');
    }
});

test('trocar documento não mantém ações ou PDF de outra opção', () => {
    const tela = preparar();
    tela.abrir('pedidos');
    assert.equal(tela.get('adminDocumentoAcao').href, 'almoxarifado.html');
    tela.abrir('codigo-etica');
    assert.equal(tela.get('adminDocumentoAcao').hidden, true);
    assert.equal(tela.get('adminDocumentoAcao').href, undefined);
    tela.abrir('termos');
    assert.equal(tela.get('adminDocumentoLeitor').src, 'about:blank');
    assert.equal(tela.get('adminDocumentoOriginal').hidden, true);
});

test('alternar resumo e PDF mantém o documento correto e fecha ao clicar fora', () => {
    const tela = preparar();
    tela.abrir('lei-incentivo');
    const src = tela.get('adminDocumentoLeitor').src;
    tela.get('adminModoResumo').handlers.click();
    assert.equal(tela.get('adminDocumentoResumo').hidden, false);
    assert.equal(tela.get('adminDocumentoPdf').hidden, true);
    tela.get('adminModoPdf').handlers.click();
    assert.equal(tela.get('adminDocumentoResumo').hidden, true);
    assert.equal(tela.get('adminDocumentoLeitor').src, src);
    const janela = tela.get('adminDocumento');
    janela.handlers.click({ target: janela });
    assert.equal(janela.open, false);
});

test('todos os PDFs são arquivos válidos e todas as fontes estão identificadas', () => {
    const fontes = JSON.parse(readFileSync(new URL('../public/docs/administrativo/fontes.json', import.meta.url), 'utf8'));
    const pdfs = new Set();
    for (const dados of Object.values(documentosAdministrativos)) {
        assert.equal(new URL(dados.fonte).protocol, 'https:');
        assert.ok(dados.documento && dados.abrangencia && dados.paragrafos.length);
        if (dados.pdf) {
            pdfs.add(dados.pdf);
            const caminho = new URL('../public' + dados.pdf, import.meta.url);
            const bytes = readFileSync(caminho);
            assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
            assert.ok(fontes.some(fonte => dados.pdf.endsWith('/' + fonte.arquivo) && fonte.bytes === bytes.length));
        }
        if (dados.acao) assert.ok(existsSync(new URL('../' + dados.acao.href, import.meta.url)));
    }
    assert.equal(pdfs.size, 9);
});


test('Quadras do Horto abre diretamente a pagina de agendamento', () => {
    const card = pagina.match(/<a\b[^>]*href="agendamento-quadras\.html"[^>]*>[\s\S]*?<\/a>/)?.[0];
    assert.ok(card);
    assert.match(card, /Quadras do Horto/);
    assert.match(card, /Agendamento e disponibilidade/);
    assert.doesNotMatch(card, /data-documento|aria-haspopup|<button/);
    assert.ok(existsSync(new URL('../agendamento-quadras.html', import.meta.url)));
});
