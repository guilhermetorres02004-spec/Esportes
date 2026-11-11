import React, { useEffect, useRef, useState } from 'react';
import data from './form-data.json';
import Footer from '../home/Footer.jsx';
import ImageConsent from './ImageConsent.jsx';
import { maskCPF, isValidCPF, montarPedido, enviarInscricao, menorDeIdade, dataLocal } from './inscricao-service.js';
import './inscricao.css';

export function valoresIniciais(search = '') {
    const valores = Object.fromEntries(data.sections.flatMap(s => s.campos).map(c => [c.name, c.options?.[0]?.value || '']));
    const modalidade = new URLSearchParams(search).get('modalidade');
    valores.modalidade = Object.hasOwn(data.config, modalidade) ? modalidade : ''; valores.nucleo = ''; valores.dataDeclaracao = dataLocal(); return valores;
}
export default function InscricaoPage({ initialSearch = window.location.search } = {}) {
    const [valores, setValores] = useState(() => valoresIniciais(initialSearch)), [invalidos, setInvalidos] = useState([]);
    const [termo, setTermo] = useState(false), [escolha, setEscolha] = useState(''), [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState(''), [resultado, setResultado] = useState('');
    const [registro, setRegistro] = useState(null);
    const form = useRef(null), pedido = useRef(null), ativo = useRef(true), mensagem = useRef(null);
    const contexto = data.config[valores.modalidade];
    const menor = menorDeIdade(valores.dataNascimento);
    useEffect(() => { ativo.current = true; document.title = 'Inscrição · Programa Viva Esportes — Betim'; return () => { ativo.current = false; pedido.current?.abort(); }; }, []);
    useEffect(() => { if (resultado) mensagem.current?.focus(); }, [resultado]);
    function alterar(name, value) {
        setValores(v => ({ ...v, [name]: name === 'cpf' || name === 'cpfResponsavel' ? maskCPF(value) : value, ...(name === 'modalidade' ? { nucleo: '' } : {}) }));
        setInvalidos(ids => ids.filter(id => id !== name));
    }
    function limpar() { setValores(valoresIniciais(initialSearch)); setInvalidos([]); setEscolha(''); setErro(''); setResultado(''); setRegistro(null); }
    function validarCPF() {
        const ids = ['cpf', 'cpfResponsavel'].filter(id => valores[id].trim() && !isValidCPF(valores[id]));
        setInvalidos(ids); if (ids.length) form.current.elements.namedItem(ids[0]).focus(); return !ids.length;
    }
    function abrir(event) { event.preventDefault(); if (pedido.current || !validarCPF()) return; setErro(''); setResultado(''); setTermo(true); }
    async function concluir() {
        if (pedido.current) return;
        if (!form.current.checkValidity() || !validarCPF()) { setTermo(false); form.current.reportValidity(); return; }
        const controller = new AbortController(); pedido.current = controller; setEnviando(true); setErro('');
        const timeout = setTimeout(() => controller.abort(), 20000), decisao = escolha;
        try {
            const inscricao = await enviarInscricao(montarPedido(valores, decisao), { signal: controller.signal });
            if (ativo.current) { setTermo(false); limpar(); setRegistro(inscricao); setResultado(`Inscrição concluída! Protocolo ${inscricao.id}. Uso de imagem: ${decisao === 'sim' ? 'autorizado' : decisao === 'nao' ? 'não autorizado' : 'não informado'}.`); }
        } catch (falha) {
            if (ativo.current) setErro(falha.name === 'AbortError' || falha.name === 'TimeoutError' ? 'O servidor demorou para responder. Confirme se a inscrição foi registrada antes de reenviar.'
                : falha.name === 'TypeError' ? 'Não foi possível conectar ao servidor. Seus dados foram mantidos.' : falha.message);
        } finally { clearTimeout(timeout); pedido.current = null; if (ativo.current) setEnviando(false); }
    }
    function campo(c) {
        const obrigatorio = c.required || (menor && ['nomeResponsavel', 'parentesco', 'telefoneResponsavel'].includes(c.name));
        const props = { id: c.name, name: c.name, required: obrigatorio, value: valores[c.name], onChange: e => alterar(c.name, e.target.value),
            'aria-invalid': invalidos.includes(c.name) || undefined, 'aria-describedby': invalidos.includes(c.name) ? c.name + '-erro' : undefined };
        const options = c.name === 'nucleo' ? [{ value: '', text: 'Selecione…' }, ...(contexto?.nucleos || []).map(text => ({ value: text, text }))] : c.options;
        if (c.type === 'checkbox') return <div key={c.name} className="inscricao-declaration"><label htmlFor={c.name}><input id={c.name} name={c.name} type="checkbox" required checked={valores[c.name] === 'sim'} onChange={e => alterar(c.name, e.target.checked ? 'sim' : '')} /><span>{c.label}<span aria-hidden="true"> *</span></span></label></div>;
        return <div key={c.name} className={'inscricao-field inscricao-field-' + c.name}><label htmlFor={c.name}>{c.label}{obrigatorio && <span aria-hidden="true"> *</span>}</label>
            {c.type === 'select' ? <select {...props}>{options.map(o => <option key={o.value} value={o.value}>{o.text}</option>)}</select>
                : c.type === 'textarea' ? <textarea {...props} rows={3} /> : <input {...props} type={c.type} placeholder={c.placeholder} inputMode={c.inputMode} maxLength={c.maxLength}
                    max={c.name === 'dataNascimento' ? dataLocal() : undefined} list={['modalidade', 'nucleo'].includes(c.name) ? c.name + '-sugestoes' : undefined}
                    onBlur={() => { if (['cpf', 'cpfResponsavel'].includes(c.name) && valores[c.name].trim() && !isValidCPF(valores[c.name])) setInvalidos(ids => [...new Set([...ids, c.name])]); }} />}
            {invalidos.includes(c.name) && <p id={c.name + '-erro'} className="inscricao-field-error">CPF inválido.</p>}</div>;
    }
    return <><main id="conteudo" className="inscricao-page" tabIndex={-1}><a className="inscricao-back" href={contexto?.voltarHref || '/'}>← {contexto?.voltarTexto || 'Voltar para o Portal'}</a>
        <header className="inscricao-heading"><span className="inscricao-eyebrow">Portal do Esporte · Betim</span><h1>Ficha de inscrição<br />Programa Viva Esportes</h1><p>Preencha os dados para solicitar sua participação.</p><p className="inscricao-required">Campos com * são obrigatórios. Para menores de 18 anos, o responsável deve assinar.</p></header>
        <form ref={form} id="formInscricao" onSubmit={abrir} onReset={event => { event.preventDefault(); if (!pedido.current) limpar(); }} aria-busy={enviando}>
            <fieldset className="inscricao-form-fields" disabled={enviando}>{data.sections.map((section, index) => <fieldset className="inscricao-section" key={section.titulo}><legend><span className="inscricao-section-number" aria-hidden="true">{index + 1}</span><span><span className="sr-only">Etapa {index + 1}: </span>{section.titulo.replace(/^\d+\.\s*/, '')}</span></legend><div className="inscricao-grid">{section.campos.map(campo)}</div>
                {index === 1 && <p className="inscricao-notice">{menor ? 'Participante menor de 18 anos: informe o responsável legal.' : 'Preencha esta seção quando o participante for menor de 18 anos.'}</p>}
                {index === 4 && <p className="inscricao-notice">Informe o nome completo de quem assina a declaração. Para menores de 18 anos, deve ser o responsável legal. Este campo não substitui uma assinatura na ficha física, quando solicitada pela Secretaria.</p>}</fieldset>)}
            <datalist id="modalidade-sugestoes">{Object.entries(data.config).map(([value, item]) => <option key={value} value={value}>{item.titulo.replace('Ficha de Inscrição - ', '')}</option>)}</datalist>
            <datalist id="nucleo-sugestoes">{(contexto?.nucleos || []).map(nome => <option key={nome} value={nome} />)}</datalist>
            <section className="inscricao-office" aria-labelledby="inscricao-office-title"><h2 id="inscricao-office-title">6. Uso exclusivo da Secretaria Municipal de Esportes</h2>
                <p>Estes dados são preenchidos pela Secretaria após o recebimento da ficha.</p><dl><div><dt>Nº de inscrição</dt><dd>{registro?.id || 'Gerado após o envio'}</dd></div>
                    <div><dt>Data de recebimento</dt><dd>{registro?.dataInscricao ? registro.dataInscricao.split('-').reverse().join('/') : 'Registrada no recebimento'}</dd></div>
                    <div><dt>Situação</dt><dd>A preencher pela Secretaria</dd></div><div><dt>Servidor responsável</dt><dd>A preencher pela Secretaria</dd></div></dl></section>
            <p className="inscricao-privacy">Dados pessoais: uso restrito às finalidades de inscrição, organização e acompanhamento do programa.</p>
            {resultado && <p ref={mensagem} tabIndex={-1} className="inscricao-success" role="status">{resultado}</p>}
            <div className="inscricao-actions"><button type="reset" className="inscricao-secondary">Limpar campos</button><button type="submit">Finalizar e enviar</button></div></fieldset>
        </form></main><Footer />{termo && <ImageConsent escolha={escolha} onChoice={setEscolha} enviando={enviando} erro={erro} onClose={() => { if (!pedido.current) setTermo(false); }} onConfirm={concluir} />}</>;
}
