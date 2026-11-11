import React, { useEffect, useRef, useState } from 'react';

import { modalidadesEscola } from '../modalidades/catalog.js';

export function cardScale(distance, viewportWidth) {
    return 1 - Math.min(Math.abs(distance) / Math.max(viewportWidth / 2, 1), 1) * 0.24;
}

export default function SchoolCarousel() {
    const track = useRef(null);
    const [paused, setPaused] = useState(false);
    const [reduced, setReduced] = useState(true);

    function updateSizes() {
        const node = track.current;
        if (!node) return;
        const center = node.scrollLeft + node.clientWidth / 2;
        for (const card of node.children) {
            const distance = card.offsetLeft + card.offsetWidth / 2 - center;
            card.style.setProperty('--school-card-scale', cardScale(distance, node.clientWidth));
        }
    }

    useEffect(() => {
        updateSizes();
        const observer = new ResizeObserver(updateSizes);
        observer.observe(track.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReduced(preference.matches);
        update();
        preference.addEventListener('change', update);
        return () => preference.removeEventListener('change', update);
    }, []);

    function advance(direction = 1) {
        const node = track.current;
        if (!node) return;
        const step = node.firstElementChild.offsetWidth + 16;
        const end = node.scrollWidth - node.clientWidth;
        const wrap = direction > 0 ? node.scrollLeft >= end - 2 : node.scrollLeft <= 2;
        node.scrollTo({ left: wrap ? (direction > 0 ? 0 : end) : node.scrollLeft + direction * step,
            behavior: reduced || wrap ? 'instant' : 'smooth' });
    }

    useEffect(() => {
        if (paused) return;
        const timer = window.setInterval(() => {
            if (!document.hidden) advance();
        }, 3000);
        return () => window.clearInterval(timer);
    }, [paused, reduced]);

    return <div className="school-carousel" role="region" aria-roledescription="carrossel" aria-label="Modalidades da Escola de Esportes">
        <button className="school-carousel-arrow school-carousel-arrow-prev" type="button" onClick={() => advance(-1)} aria-label="Modalidade anterior" aria-controls="school-modalidades">
            <i className="fas fa-chevron-left" aria-hidden="true" />
        </button>
        <ul ref={track} id="school-modalidades" className="school-carousel-track" tabIndex={0} onScroll={updateSizes} aria-label="Lista de modalidades. Pressione espaço para pausar ou retomar a rotação." onKeyDown={event => { if (event.key === ' ') { event.preventDefault(); setPaused(value => !value); } }}>
            {modalidadesEscola.map(({ nome, icon, tipo, href }) => <li className="escola-card" key={nome}>
                <a className="school-card-link" href={href}>
                <i className={`fas ${icon}`} aria-hidden="true" /><p>{nome}</p>
                {tipo && <small>{tipo}</small>}
                </a>
            </li>)}
        </ul>
        <button className="school-carousel-arrow school-carousel-arrow-next" type="button" onClick={() => advance(1)} aria-label="Próxima modalidade" aria-controls="school-modalidades">
            <i className="fas fa-chevron-right" aria-hidden="true" />
        </button>
    </div>;
}
