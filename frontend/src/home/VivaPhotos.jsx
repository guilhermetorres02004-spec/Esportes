import React, { useEffect, useState } from 'react';
import { creditoFoto, selecionarFotosViva, INTERVALO_FOTOS_VIVA } from './fotos-utils.js';

const original = { url: '/Imagens/2026/viva-esporte-2026.jpg',
    titulo: 'Participantes do Viva o Esporte em atividade na quadra coberta',
    origem: 'https://www.betim.mg.gov.br/portal/noticias/0/3/14875/viva-o-esporte-retoma-atividades-e-movimenta-quadras-e-campos-em-betim/',
    publicadoEm: '12/02/2026' };

export default function VivaPhotos() {
    const [fotos, setFotos] = useState([]);
    const [invalidas, setInvalidas] = useState(() => new Set());
    const [indice, setIndice] = useState(0);

    const selecao = fotos.filter(foto => !invalidas.has(foto.url));
    const foto = selecao.length ? selecao[indice % selecao.length] : original;

    useEffect(() => {
        let ativo = true, ocupado = false, controller;
        async function atualizar() {
            if (!ativo || ocupado || document.hidden) return;
            ocupado = true; controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000);
            try {
                const resposta = await fetch('/api/fotos/viva-esporte', { cache: 'no-store', signal: controller.signal });
                if (!resposta.ok) return;
                const dados = await resposta.json();
                if (ativo && Array.isArray(dados.fotos)) setFotos(selecionarFotosViva(dados.fotos));
            } catch { /* Preserva a última seleção ou a imagem oficial original. */ }
            finally { clearTimeout(timeout); ocupado = false; }
        }
        atualizar();
        const timer = setInterval(atualizar, 300000);
        document.addEventListener('visibilitychange', atualizar);
        return () => { ativo = false; controller?.abort(); clearInterval(timer); document.removeEventListener('visibilitychange', atualizar); };
    }, []);

    useEffect(() => {
        if (selecao.length < 2) return;
        const timer = setInterval(() => {
            if (!document.hidden) setIndice(anterior => (anterior + 1) % selecao.length);
        }, INTERVALO_FOTOS_VIVA);
        return () => clearInterval(timer);
    }, [selecao.length]);

    return <figure className="viva-photo viva-photo-rotation relative" aria-label="Fotos oficiais do Viva o Esporte">
        <img src={foto.url} alt={foto.titulo} width="800" height="600" loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => { if (foto !== original) setInvalidas(anteriores => new Set([...anteriores, foto.url])); }} />
        <figcaption className="photo-credit"><a href={foto.origem} target="_blank" rel="noopener noreferrer">
            {foto.titulo} · {creditoFoto(foto)}</a></figcaption>
    </figure>;
}
