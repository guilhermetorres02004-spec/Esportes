import React, { useEffect, useState } from 'react';
import Footer from '../home/Footer.jsx';
import RegionalMap from './RegionalMap.jsx';
import CatalogAdmin from './CatalogAdmin.jsx';
import { EquipmentCard, EquipmentDetails, LocalPhoto } from './EquipmentCard.jsx';
import { filtrarEquipamentos, filtrosVazios, catalogoValido } from './regionais-utils.js';
import './regionais.css';

const valores = (items, key) => [...new Set(items.flatMap(item => item[key] || []).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
export default function RegionaisPage({ initialCatalog = null } = {}) {
    const [catalogo, setCatalogo] = useState(initialCatalog), [status, setStatus] = useState(initialCatalog ? '' : 'Carregando informações das regionais…');
    const [tentativa, setTentativa] = useState(0), [detalhe, setDetalhe] = useState(null);
    const [filtros, setFiltros] = useState(() => ({ ...filtrosVazios, regional: new URLSearchParams(window.location.search).get('regional') || '' }));
    useEffect(() => { document.title = 'Esporte nas Regionais — Portal do Esporte Betim'; }, []);
    useEffect(() => {
        let controller, ativo = true;
        async function carregar() {
            for (const url of ['/api/regionais/catalogo', '/data/regionais.json']) {
                if (!ativo) return;
                controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 8000);
                try {
                    const response = await fetch(url, { cache: 'no-store', signal: controller.signal });
                    if (!response.ok) continue;
                    const data = await response.json(); if (!catalogoValido(data)) continue;
                    if (ativo) { setCatalogo(data); setStatus(url.startsWith('/data/') ? 'Exibindo a cópia do catálogo oficial consultado. Atualização pela API indisponível no momento.' : ''); }
                    return;
                } catch { /* Tenta a cópia local de dados confirmados. */ }
                finally { clearTimeout(timeout); }
            }
            if (ativo) setStatus('Não foi possível carregar o catálogo. Tente novamente.');
        }
        carregar();
        return () => { ativo = false; controller?.abort(); };
    }, [tentativa]);
    const regionais = catalogo?.regionais || [], equipamentos = catalogo?.equipamentos || [];
    const regional = regionais.find(item => item.id === filtros.regional);
    const resultados = filtrarEquipamentos(equipamentos, filtros);
    const daRegional = equipamentos.filter(item => !regional || item.regionais.includes(regional.id));
    const programas = (catalogo?.programas || []).filter(item => !regional || item.regionais.includes(regional.id));
    const eventos = (catalogo?.eventos || []).filter(item => !regional || item.regionais.includes(regional.id));
    function selecionar(id) {
        setFiltros(anteriores => ({ ...anteriores, regional: id, bairro: '' }));
        const url = new URL(window.location.href); if (id) url.searchParams.set('regional', id); else url.searchParams.delete('regional');
        window.history.replaceState(window.history.state, '', url.pathname + url.search);
    }
    return <><header className="regionais-hero"><div><a href="/">← Portal do Esporte</a><p>Esporte nas Regionais</p><h1>O esporte mais perto de você</h1><p>Encontre locais de prática e conheça as atividades publicadas para as dez regionais de Betim.</p></div></header>
        <main id="conteudo" className="regionais-page" tabIndex={-1}>
            {status && <p role="status" className="regional-note">{status}</p>}
            {!catalogo && <button type="button" onClick={() => setTentativa(value => value + 1)}>Tentar carregar novamente</button>}
            {catalogo && <><RegionalMap equipamentos={resultados} />
                <nav className="regional-selector" aria-label="Selecionar regional"><button type="button" aria-pressed={!regional} onClick={() => selecionar('')}>Todas as regionais</button>
                    {regionais.map(item => <button type="button" key={item.id} aria-pressed={regional?.id === item.id} onClick={() => selecionar(item.id)}>{item.nome}<small>{equipamentos.filter(e => e.regionais.includes(item.id)).length} locais publicados</small></button>)}</nav>
                {regional && <section className="regional-panel" aria-labelledby="regional-title"><p className="regional-eyebrow">Regional selecionada</p><h2 id="regional-title">Regional {regional.nome}</h2>
                    <p>Consulte os equipamentos e as informações esportivas publicados pela plataforma municipal para a Regional {regional.nome}.</p>
                    <p><strong>Modalidades informadas nos locais:</strong> {valores(daRegional, 'modalidades').join(', ') || 'Cadastro de modalidades pendente.'}</p>
                    <a href={regional.fonte} target="_blank" rel="noopener noreferrer">Abrir página oficial da Regional {regional.nome} ↗</a></section>}
                <section aria-labelledby="regionais-results-title"><h2 id="regionais-results-title">Encontre onde praticar</h2>
                    <form className="regional-filters" onSubmit={event => event.preventDefault()}>
                        <label>Regional<select value={filtros.regional} onChange={event => selecionar(event.target.value)}><option value="">Todas</option>{regionais.map(item => <option key={item.id} value={item.id}>{item.nome}</option>)}</select></label>
                        {[['bairro', 'Bairro', 'bairro'], ['modalidade', 'Modalidade', 'modalidades'], ['tipo', 'Tipo de equipamento', 'tipo'], ['programa', 'Programa', 'programas']].map(([key, label, field]) => <label key={key}>{label}<select value={filtros[key]} onChange={event => setFiltros(old => ({ ...old, [key]: event.target.value }))}><option value="">Todos</option>{valores(equipamentos, field).map(value => <option key={value}>{value}</option>)}</select></label>)}
                        <button type="button" onClick={() => { setFiltros(filtrosVazios); selecionar(''); }}>Limpar filtros</button>
                    </form><p role="status">{resultados.length} {resultados.length === 1 ? 'equipamento encontrado' : 'equipamentos encontrados'}</p>
                    {!resultados.length && <div className="regional-note">Nenhum local corresponde a esses filtros. Tente outra combinação. Ausência de cadastro não significa ausência de oferta na regional.</div>}
                    <div className="regional-equipment-grid">{resultados.map(item => <EquipmentCard key={item.id} item={item} regionais={regionais} onDetails={setDetalhe} />)}</div>
                </section>
                <section className="regional-programs" aria-labelledby="regional-programs-title"><h2 id="regional-programs-title">Programas e projetos</h2><p>Orientações publicadas para {regional ? `a Regional ${regional.nome}` : 'as regionais'}. Confirme no canal oficial os núcleos participantes e as vagas atuais.</p>
                    <div className="regional-program-grid">{programas.map(item => <article className="regional-panel" key={item.id}><h3>{item.nome}</h3><p>{item.descricao}</p><p>{item.orientacao}</p><p><strong>Público, modalidades e locais:</strong> consulte a programação por núcleo na fonte oficial.</p><a href={/viva o esporte/i.test(item.nome) ? 'https://www.betim.mg.gov.br/portal/secretarias-paginas/279/programa-viva-o-esporte/' : item.fonte} target="_blank" rel="noopener noreferrer">Consultar programa e participação ↗</a></article>)}</div>
                    {!programas.length && <p>Programas e projetos pendentes de cadastro para esta regional.</p>}</section>
                <section className="regional-panel"><h2>Eventos e competições{regional ? ` · ${regional.nome}` : ''}</h2>{eventos.length ? <ul>{eventos.map(item => <li key={item.id}><a href={item.fonte} target="_blank" rel="noopener noreferrer">{item.nome}</a>{item.data && ` · ${item.data}`}</li>)}</ul> : <p>Ainda não há eventos vinculados à seleção neste catálogo.</p>}<a href="/agenda.html">Consultar a agenda do portal →</a></section>
                <section className="regional-panel"><h2>Fotografias dos locais{regional ? ` · ${regional.nome}` : ''}</h2><div className="regional-gallery">{daRegional.filter(item => item.foto).slice(0, 6).map(item => <figure key={item.id}><LocalPhoto item={item} /><figcaption><a href={item.fonte} target="_blank" rel="noopener noreferrer">{item.nome} · Fonte municipal</a></figcaption></figure>)}</div>{!daRegional.some(item => item.foto) && <p>Galeria pendente de fotografias confirmadas para esta seleção.</p>}</section>
                <p className="regional-source">Dados consultados em {new Date(catalogo.atualizadoEm).toLocaleDateString('pt-BR')}. Horários, acessibilidade, fotos ou endereços ausentes permanecem indicados como não confirmados. <a href="https://regionais.betim.digital/" target="_blank" rel="noopener noreferrer">Fonte: Regionais Conectadas — Prefeitura de Betim.</a></p>
                <CatalogAdmin catalogo={catalogo} onSave={setCatalogo} /><EquipmentDetails item={detalhe} onClose={() => setDetalhe(null)} />
            </>}
        </main><Footer /></>;
}
