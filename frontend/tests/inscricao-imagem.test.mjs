import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../public/js/inscricao-imagem.js', import.meta.url), 'utf8');

function elemento() {
    return { handlers: {}, hidden: true, disabled: false, textContent: '',
        addEventListener(tipo, handler) { this.handlers[tipo] = handler; },
        focus() {}, scrollIntoView() {} };
}

function preparar(responder = async () => ({ ok: true, json: async () => ({ id: 42 }) })) {
    const elementos = Object.fromEntries(['formInscricao', 'termoImagem', 'concluirInscricao',
        'resultadoInscricao', 'erroTermoImagem', 'limparEscolhaImagem'].map(id => [id, elemento()]));
    const ficha = elementos.formInscricao, termo = elementos.termoImagem;
    const escolhas = [{ value: 'sim', checked: false }, { value: 'nao', checked: false }];
    const voltar = elemento(), submit = elemento(), corpo = elemento();
    const pedidos = [];
    let reset = 0;
    ficha.reportValidity = ficha.checkValidity = () => true;
    ficha.querySelector = () => submit;
    ficha.querySelectorAll = () => [];
    ficha.reset = () => { reset++; ficha.handlers.reset(); };
    termo.dataset = { versao: '2026-11-04' };
    termo.showModal = () => { termo.open = true; };
    termo.close = () => { termo.open = false; };
    termo.querySelector = () => corpo;
    termo.querySelectorAll = seletor => seletor.includes('input[name') ? escolhas
        : seletor === '[data-fechar-termo]' ? [voltar] : [voltar, elementos.concluirInscricao, ...escolhas];
    runInNewContext(source, { document: { getElementById: id => elementos[id] },
        FormData: function () { return [['nome', 'Pessoa teste'], ['telefone', '31999999999'],
            ['modalidade', 'volei'], ['nucleo', 'Horto Municipal'], ['nomeResponsavel', 'Responsável teste']]; },
        AbortSignal, fetch: async (url, options) => { pedidos.push({ url, ...options }); return responder(); } });
    const abrir = (defaultPrevented = false) => ficha.handlers.submit({ defaultPrevented, preventDefault() {} });
    return { elementos, ficha, termo, escolhas, voltar, pedidos, abrir, reset: () => reset,
        concluir: () => elementos.concluirInscricao.handlers.click() };
}

test('abre o termo após validação, sem enviar ou pré-selecionar autorização', () => {
    const tela = preparar();
    tela.abrir(true);
    assert.equal(tela.termo.open, undefined);
    tela.abrir();
    assert.equal(tela.termo.open, true);
    assert.equal(tela.pedidos.length, 0);
    assert.ok(tela.escolhas.every(item => !item.checked));
    tela.voltar.handlers.click();
    assert.equal(tela.termo.open, false);
    assert.equal(tela.reset(), 0);
});

for (const [escolha, esperado] of [[0, true], [1, false], [null, null]]) {
    test(`conclui com autorização ${esperado}, preservando a ficha no pedido`, async () => {
        const tela = preparar();
        tela.abrir();
        if (escolha !== null) tela.escolhas[escolha].checked = true;
        await tela.concluir();
        assert.equal(tela.pedidos.length, 1);
        const pedido = JSON.parse(tela.pedidos[0].body);
        assert.equal(pedido.autorizaUsoImagem, esperado);
        assert.equal(pedido.termoImagemVersao, '2026-11-04');
        assert.equal(pedido.dadosFicha.nomeResponsavel, 'Responsável teste');
        assert.equal(pedido.dadosFicha.nucleo, 'Horto Municipal');
        assert.equal(tela.termo.open, false);
        assert.equal(tela.reset(), 1);
        assert.equal(tela.elementos.resultadoInscricao.hidden, false);
    });
}

test('erro de envio mantém ficha, escolha e janela para nova tentativa', async () => {
    const tela = preparar(async () => ({ ok: false, json: async () => ({ mensagem: 'Falha de teste' }) }));
    tela.abrir();
    tela.escolhas[1].checked = true;
    await tela.concluir();
    assert.equal(tela.termo.open, true);
    assert.equal(tela.reset(), 0);
    assert.equal(tela.escolhas[1].checked, true);
    assert.equal(tela.elementos.erroTermoImagem.textContent, 'Falha de teste');
    assert.equal(tela.elementos.concluirInscricao.disabled, false);
});

test('bloqueia envio duplicado e fechamento enquanto aguarda a API', async () => {
    let resolver;
    const tela = preparar(() => new Promise(resolve => { resolver = resolve; }));
    tela.abrir();
    const envio = tela.concluir();
    await tela.concluir();
    let cancelado = false;
    tela.termo.handlers.cancel({ preventDefault() { cancelado = true; } });
    assert.equal(cancelado, true);
    assert.equal(tela.pedidos.length, 1);
    resolver({ ok: true, json: async () => ({ id: 43 }) });
    await envio;
    assert.equal(tela.reset(), 1);
});

test('permite apagar a escolha sem limpar os campos da inscrição', () => {
    const tela = preparar();
    tela.escolhas[0].checked = true;
    tela.elementos.limparEscolhaImagem.handlers.click();
    assert.ok(tela.escolhas.every(item => !item.checked));
    assert.equal(tela.reset(), 0);
});
