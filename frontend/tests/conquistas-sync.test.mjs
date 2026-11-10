import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { validarAcervo, acrescentarMarcos, selecionarPorAno, relevancia } from '../public/js/conquistas-sync.js';

const noticia = { id: '15700', titulo: 'Atleta conquista medalha', resumo: 'Resultado oficial da competição.',
    publicadoEm: '2026-11-05', fonte: 'https://www.betim.mg.gov.br/portal/noticias/0/3/15700/atleta-conquista-medalha', atletas: ['raysa'] };

test('rejeita origem externa, javascript e resposta malformada', () => {
    assert.equal(validarAcervo({ conquistas: [noticia] }), true);
    assert.equal(validarAcervo({ conquistas: [{ ...noticia, fonte: 'javascript:alert(1)' }] }), false);
    assert.equal(validarAcervo({ conquistas: [{ ...noticia, fonte: 'https://outra.example/noticia' }] }), false);
    assert.equal(validarAcervo({ conquistas: [{ ...noticia, atletas: null }] }), false);
    assert.throws(() => validarAcervo({}));
});

test('acrescenta marcos sem duplicar fontes nem atribuir resultados a nomes desconhecidos', () => {
    const campeoes = { raysa: { marcos: [] } };
    acrescentarMarcos(campeoes, {}, [noticia, noticia]);
    assert.equal(campeoes.raysa.marcos.length, 1);
    assert.match(campeoes.raysa.marcos[0].texto, /menciona este atleta/);
    const historico = { raysa: { marcos: [{ fonte: 'open' }] } };
    acrescentarMarcos(historico, { open: noticia.fonte + '/' }, [noticia]);
    assert.equal(historico.raysa.marcos.length, 1);
    acrescentarMarcos(campeoes, {}, [{ ...noticia, atletas: ['nao-cadastrado'] }]);
    assert.equal(campeoes['nao-cadastrado'], undefined);
});

test('consulta periódica cria card, evita duplicação e preserva os dados se API falhar', async () => {
    class Elemento {
        constructor() { this.children = []; this.hidden = true; }
        append(...itens) { for (const item of itens) { this.children = this.children.filter(c => c !== item); this.children.push(item); } }
        setAttribute() {}
        replaceChildren(...itens) { this.children = itens; }
        querySelector() { return this.grade; }
        insertBefore() {}
    }
    const painel = new Elemento(), secao = new Elemento(), lista = new Elemento(); secao.grade = lista;
    const elementos = { 'conquistas-sync-status': painel, 'conquistas-2026': secao };
    let timer, falhar = false, vinculos = 0, contador = 0;
    const codigo = readFileSync(new URL('../public/js/conquistas-sync.js', import.meta.url), 'utf8').replace(/export /g, '');
    const contexto = { document: { hidden: false, getElementById: id => elementos[id], createElement: () => new Elemento(), querySelector: () => new Elemento(), querySelectorAll: () => [], addEventListener() {} },
        window: { addEventListener() {} }, AbortSignal, setInterval(fn, intervalo) { assert.equal(intervalo, 60000); timer = fn; return 1; }, clearInterval() {},
        fetch: async () => { contador++; if (falhar) throw new Error('offline'); return { ok: true, json: async () => ({ atualizadoEm: '2026-11-10T12:00:00Z', conquistas: [noticia] }) }; },
        campeoes: { raysa: { marcos: [] } }, fontes: {}, vincularCard(card, perfil) {
            vinculos++;
            assert.equal(perfil.marcos.filter(m => m.texto === noticia.resumo).length, 1);
            assert.equal(perfil.marcos[0].titulo, 'Publicação do resultado');
            assert.equal(perfil.marcos[0].fonte, noticia.fonte);
        } };
    runInNewContext(codigo + '\niniciarAtualizacao({campeoes, fontes, vincularCard});', contexto);
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(lista.children.length, 1);
    const descricao = lista.children[0].children.find(c => c.className === 'hall-description');
    assert.equal(descricao.hidden, true);
    assert.equal(descricao.textContent, noticia.resumo);
    assert.equal(contexto.campeoes.raysa.marcos.length, 1);
    await timer(); assert.equal(lista.children.length, 1); assert.equal(vinculos, 1);
    falhar = true; await timer();
    assert.equal(lista.children.length, 1); assert.match(painel.textContent, /indisponível/);
    assert.equal(contador, 3);
});

test('seleciona no máximo seis cards por ano, separa os anos e remove duplicados', () => {
    const candidatos = [2025, 2026].flatMap(ano => Array.from({ length: 9 }, (_, i) => ({ ...noticia,
        id: `${ano}-${i}`, publicadoEm: `${ano}-10-${String(i + 1).padStart(2, '0')}` })));
    const selecao = selecionarPorAno([...candidatos, candidatos[0]]);
    assert.deepEqual([...selecao.keys()], ['2026', '2025']);
    for (const [ano, cards] of selecao) {
        assert.equal(cards.length, 6);
        assert.ok(cards.every(c => c.publicadoEm.startsWith(ano)));
        assert.equal(cards[0].publicadoEm, `${ano}-10-09`);
    }
});

test('nova notícia relevante substitui a sexta; ordem usa alcance, resultado e recência', () => {
    const locais = Array.from({ length: 6 }, (_, i) => ({ ...noticia, id: `${i}`, publicadoEm: `2026-10-0${i + 1}` }));
    const internacional = { ...noticia, id: 'mundial', titulo: 'Ouro no campeonato mundial', publicadoEm: '2026-01-01' };
    const atualizada = selecionarPorAno([...locais, internacional]).get('2026');
    assert.equal(atualizada.length, 6);
    assert.equal(atualizada[0].id, 'mundial');
    assert.ok(!atualizada.some(c => c.id === '0'));
    const nacional = { titulo: 'Ouro no Brasileiro', resumo: '' };
    const estadual = { titulo: 'Ouro no JEMG Paralímpico', resumo: '' };
    assert.ok(relevancia(internacional) > relevancia(nacional));
    assert.ok(relevancia(nacional) > relevancia(estadual));
    assert.ok(relevancia({ titulo: 'Ouro no Brasileiro' }) > relevancia({ titulo: 'Prata no Brasileiro' }));
    assert.deepEqual(selecionarPorAno([]).size, 0);
});
