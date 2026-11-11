import React, { useEffect, useMemo, useRef, useState } from 'react';
import cards from './cards.json';
import { campeoes, fontes } from '../../public/js/conquistas-dados.js';
import { validarAcervo, selecionarPorAno, acrescentarMarcos } from '../../public/js/conquistas-sync.js';
import '../../public/css/conquistas.css';
import Footer from '../home/Footer.jsx';
import './conquistas.css';

function Trajetoria({ perfil, onClose }) {
    const dialog = useRef(null);
    useEffect(() => {
        const origem = document.activeElement, overflow = document.body.style.overflow;
        dialog.current.showModal(); document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = overflow; origem?.focus({ preventScroll: true }); };
    }, []);
    return <dialog ref={dialog} id="campeao-dialog" className="champion-dialog conquistas-dialog" aria-labelledby="campeao-nome" onClose={onClose}
        onClick={event => { const r = event.currentTarget.getBoundingClientRect(); if (event.target === event.currentTarget && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) onClose(); }}>
        <button className="champion-close" type="button" aria-label="Fechar perfil" autoFocus onClick={onClose}>×</button>
        <div className="champion-layout"><div className="champion-content"><h2 id="campeao-nome">{perfil.titulo}</h2>
            <h3 className="champion-timeline-title">Linha do tempo</h3><ol className="champion-timeline">{perfil.marcos.map((marco, index) => <li key={index}>
                <span className="champion-date">{marco.data}</span><div><h4>{marco.titulo}</h4>{marco.texto && <p>{marco.texto}</p>}
                    <a href={fontes[marco.fonte] || marco.fonte} target="_blank" rel="noopener noreferrer">Fonte: Prefeitura de Betim ↗</a></div></li>)}</ol>
            <p className="champion-note">Marcos documentados nas fontes indicadas; a trajetória pode incluir outras conquistas.</p>
        </div></div></dialog>;
}

export default function ConquistasPage() {
    const [acervo, setAcervo] = useState([]), [status, setStatus] = useState('Consultando novas conquistas na Prefeitura…'), [perfil, setPerfil] = useState(null);
    useEffect(() => { document.title = 'Conquistas e Hall da Fama — Esporte de Betim'; }, []);
    useEffect(() => {
        let ativo = true, ocupada = false, controller;
        async function atualizar() {
            if (ocupada || document.hidden) return;
            ocupada = true; controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000);
            try {
                const response = await fetch('/api/conquistas', { cache: 'no-store', signal: controller.signal });
                if (!response.ok) throw new Error();
                const dados = await response.json(); if (!validarAcervo(dados)) throw new Error();
                if (ativo) { setAcervo(dados.conquistas); setStatus(dados.atualizadoEm ? 'Seleção automática: até 6 destaques por ano. Última consulta: ' + new Date(dados.atualizadoEm).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : 'Aguardando a busca automática. Os destaques já cadastrados continuam disponíveis.'); }
            } catch { if (ativo) setStatus('Atualização automática indisponível no momento. As conquistas já carregadas continuam disponíveis.'); }
            finally { clearTimeout(timeout); ocupada = false; }
        }
        atualizar(); const timer = setInterval(atualizar, 60000); document.addEventListener('visibilitychange', atualizar);
        return () => { ativo = false; clearInterval(timer); controller?.abort(); document.removeEventListener('visibilitychange', atualizar); };
    }, []);
    const perfis = useMemo(() => { const copia = structuredClone(campeoes); acrescentarMarcos(copia, fontes, acervo.slice().reverse()); return copia; }, [acervo]);
    const anos = useMemo(() => {
        const origens = new Set(cards.map(card => card.fonte.replace(/\/$/, '')));
        return selecionarPorAno([...cards.map(card => ({ ...card, resumo: card.categoria + ' ' + card.resultado })), ...acervo.filter(card => !origens.has(card.fonte.replace(/\/$/, '')))]);
    }, [acervo]);
    function abrir(card) { setPerfil({ titulo: card.titulo, marcos: perfis[card.atleta]?.marcos || [{ data: card.publicadoEm.split('-').reverse().join('/'), titulo: 'Publicação do resultado', texto: card.resumo, fonte: card.fonte }] }); }
    return <><main className="hall" id="conteudo" tabIndex={-1}>
        <a className="hall-back" href="/">← Voltar ao início</a>
        <header className="hall-hero"><div><p className="hall-kicker">Conquistas · 2026 e 2025</p><h1>Hall da Fama<br />do esporte de Betim</h1>
            <p>Talentos que levam o nome da nossa cidade ao pódio. Conheça algumas das histórias e conquistas dos nossos atletas e equipes.</p>
            <nav className="hall-years" aria-label="Escolha o ano das conquistas">{[...anos.keys()].map(ano => <a key={ano} href={'#conquistas-' + ano}>Ver {ano} ↓</a>)}</nav></div>
            <figure><img src="/Imagens/conquistas/trofeu-destaque-esportivo-betim.png" alt="Troféu dourado Destaque Esportivo Betim com fitas azuis e brancas" width="1672" height="941" /></figure></header>
        <p className="hall-note">Até seis destaques por ano, selecionados automaticamente pela relevância esportiva: alcance internacional, nacional, estadual e local; depois recordes, títulos e medalhas. Resultados equivalentes priorizam a publicação mais recente. A seleção não representa um ranking oficial de atletas nem o total de medalhas da cidade.</p>
        <p id="conquistas-sync-status" className="hall-note" role="status">{status}</p>
        {[...anos].map(([ano, destaques]) => <section key={ano} id={'conquistas-' + ano} aria-labelledby={'titulo-' + ano}><div className="hall-section-title"><h2 id={'titulo-' + ano}>Conquistas de {ano}</h2><span>{ano === '2025' ? 'Memórias que inspiram' : 'Atletas e equipes em destaque'}</span></div><div className="hall-grid">
            {destaques.map(card => <article key={card.id} className="hall-card" data-campeao={card.atleta}><span className="hall-sport">{card.categoria || 'Conquista oficial'}</span><h3>{card.titulo}</h3>
                <p className="hall-result">{card.resultado || 'Publicado em ' + card.publicadoEm.split('-').reverse().join('/')}</p>
                <a href={card.fonte} target="_blank" rel="noopener noreferrer">Prefeitura · {card.publicadoEm.split('-').reverse().join('/')} ↗<span className="sr-only"> (abre em nova aba)</span></a>
                <button type="button" className="hall-profile-button" aria-haspopup="dialog" aria-controls="campeao-dialog" aria-label={'Ver trajetória de ' + card.titulo} onClick={() => abrir(card)}>Conheça a trajetória →</button></article>)}
        </div></section>)}
        <footer className="hall-footer">Cada conquista tem uma história. Cada atleta faz parte do esporte de Betim. <a href="/">Explorar o portal →</a></footer>
    </main><Footer />{perfil && <Trajetoria perfil={perfil} onClose={() => setPerfil(null)} />}</>;
}
