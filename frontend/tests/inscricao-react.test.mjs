import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { maskCPF, isValidCPF, montarPedido, enviarInscricao, menorDeIdade } from '../src/inscricao/inscricao-service.js';

const bundle = await build({ entryPoints: [fileURLToPath(new URL('../src/inscricao/InscricaoPage.jsx', import.meta.url))], bundle: true,
    write: false, platform: 'node', format: 'cjs', external: ['react'], loader: { '.css': 'empty' }, logLevel: 'silent' });
function carregar(react = React, fetcher = fetch) {
    const module = { exports: {} }, require = createRequire(import.meta.url);
    new Function('require', 'module', 'exports', 'fetch', bundle.outputFiles[0].text)(name => name === 'react' ? react : require(name), module, module.exports, fetcher);
    return module.exports;
}
function encontrar(tree, predicate) {
    if (!React.isValidElement(tree)) return null;
    if (predicate(tree)) return tree;
    for (const child of React.Children.toArray(tree.props.children)) { const found = encontrar(child, predicate); if (found) return found; }
    return null;
}
test('CPF mantém máscara, dígitos verificadores e recusa sequências repetidas', () => {
    assert.equal(maskCPF('52998224725'), '529.982.247-25'); assert.equal(isValidCPF('529.982.247-25'), true);
    for (const cpf of ['00000000000', '11111111111', '52998224726', '123']) assert.equal(isValidCPF(cpf), false);
});
test('pedido mantém os três estados do consentimento e todos os campos da ficha', () => {
    for (const [escolha, esperado] of [['sim', true], ['nao', false], ['', null]]) {
        const dados = { nome: 'Teste', cpf: '', telefone: '123', modalidade: 'volei', nomeResponsavel: 'Responsável' };
        const pedido = montarPedido(dados, escolha); assert.equal(pedido.autorizaUsoImagem, esperado);
        assert.equal(pedido.termoImagemVersao, '2026-11-04'); assert.deepEqual(pedido.dadosFicha, dados); assert.equal(pedido.cpf, null);
    }
});
test('serviço envia JSON com cookie e exige protocolo; falhas mantêm o erro informado', async () => {
    const pedido = montarPedido({ nome: 'Teste', telefone: '31900000000', modalidade: 'pilates' }, 'nao');
    const inscricao = await enviarInscricao(pedido, { fetcher: async (url, options) => {
        assert.equal(url, '/api/inscricoes'); assert.equal(options.method, 'POST'); assert.equal(options.credentials, 'include');
        assert.deepEqual(JSON.parse(options.body), pedido); return { ok: true, json: async () => ({ id: 42 }) };
    } }); assert.equal(inscricao.id, 42);
    await assert.rejects(enviarInscricao(pedido, { fetcher: async () => ({ ok: true, json: async () => ({}) }) }), /não confirmou/);
    await assert.rejects(enviarInscricao(pedido, { fetcher: async () => ({ ok: false, json: async () => ({ mensagem: 'Dados inválidos' }) }) }), /Dados inválidos/);
});
test('formulário React segue ficha Viva Esportes com 26 campos, seis blocos e labels', () => {
    const { default: Page, valoresIniciais } = carregar();
    for (const modalidade of ['futebol', 'volei', 'pilates', 'funcional-soccer']) {
        const initialSearch = '?modalidade=' + modalidade;
        assert.equal(valoresIniciais(initialSearch).modalidade, modalidade);
        const html = renderToStaticMarkup(React.createElement(Page, { initialSearch }));
        assert.equal((html.match(/<(?:input|select|textarea)\b/g) || []).length, 26);
        assert.match(html, /for="cpfResponsavel"/); assert.match(html, /Rodapé institucional/);
        assert.doesNotMatch(html, /bootstrap|inscricao-imagem.js/);
        for (const label of ['Programa Viva Esportes', 'Parentesco', 'Contato de emergência', 'Turno de preferência', 'Assinatura', 'Uso exclusivo da Secretaria']) assert.ok(html.includes(label));
        assert.doesNotMatch(html, /Tamanho Camiseta|Tipo Sanguíneo|Número do NIS/);
    }
    assert.equal(valoresIniciais('?modalidade=desconhecida').modalidade, '');
});
test('menoridade respeita aniversário de 18 anos', () => {
    const hoje = new Date(2026, 10, 11);
    assert.equal(menorDeIdade('2008-11-12', hoje), true);
    assert.equal(menorDeIdade('2008-11-11', hoje), false);
    assert.equal(menorDeIdade('', hoje), false);
});
test('e-mail, saúde, declaração e dados do responsável seguem para o backend', () => {
    const dados = { nome: 'Teste', telefone: '31', modalidade: 'Futsal', email: 'teste@example.org', parentesco: 'Mãe', telefoneEmergencia: '32', informacoesSaude: 'Adaptação', aceiteDeclaracao: 'sim', assinatura: 'Responsável', dataDeclaracao: '2026-11-11' };
    const pedido = montarPedido(dados, '');
    assert.equal(pedido.email, dados.email); assert.deepEqual(pedido.dadosFicha, dados); assert.equal(pedido.autorizaUsoImagem, null);
});
test('fluxo React abre termo, bloqueia envio duplicado e confirma protocolo sem autorização implícita', async () => {
    let index = 0, refIndex = 0, requests = 0, resolver;
    const states = [], refs = [];
    const fakeReact = { ...React, useEffect() {}, useState(initial) {
        const id = index++; if (!(id in states)) states[id] = typeof initial === 'function' ? initial() : initial;
        return [states[id], value => { states[id] = typeof value === 'function' ? value(states[id]) : value; }];
    }, useRef(value) { return refs[refIndex++] ||= { current: value }; } };
    const { default: Page } = carregar(fakeReact, async () => { requests++; return new Promise(resolve => { resolver = resolve; }); });
    const render = () => { index = 0; refIndex = 0; return Page({ initialSearch: '?modalidade=volei' }); };
    let tree = render(); const form = encontrar(tree, n => n.type === 'form');
    form.props.ref.current = { checkValidity: () => true, elements: { namedItem: () => ({ focus() {} }) }, reportValidity() {} };
    encontrar(tree, n => n.props.id === 'dataNascimento').props.onChange({ target: { value: '2020-01-01' } }); tree = render();
    for (const id of ['nomeResponsavel', 'parentesco', 'telefoneResponsavel']) assert.equal(encontrar(tree, n => n.props.id === id).props.required, true);
    encontrar(tree, n => n.props.id === 'dataNascimento').props.onChange({ target: { value: '2000-01-01' } }); tree = render();
    assert.equal(encontrar(tree, n => n.props.id === 'nomeResponsavel').props.required, false);
    encontrar(tree, n => n.props.id === 'nome').props.onChange({ target: { value: 'Teste' } }); tree = render();
    encontrar(tree, n => n.type === 'form').props.onSubmit({ preventDefault() {} }); tree = render();
    const termo = encontrar(tree, n => typeof n.props.onConfirm === 'function'); assert.ok(termo);
    const envio = termo.props.onConfirm(); await termo.props.onConfirm(); assert.equal(requests, 1);
    resolver({ ok: true, json: async () => ({ id: 123 }) }); await envio; tree = render();
    assert.equal(encontrar(tree, n => typeof n.props.onConfirm === 'function'), null);
    assert.match(encontrar(tree, n => n.props.role === 'status').props.children, /Protocolo 123.*não informado/);
});
test('build publica rota limpa e entrada legada preservando parâmetro e fragmento', () => {
    assert.match(readFileSync(new URL('../dist/inscricao/index.html', import.meta.url), 'utf8'), /id="root"/);
    assert.match(readFileSync(new URL('../dist/Inscricao.html', import.meta.url), 'utf8'), /location.search\+location.hash/);
});
