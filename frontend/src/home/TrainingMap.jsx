import React, { useEffect, useRef, useState } from 'react';

const unidades = [
    { nome: 'Campo Real', coordenadas: [-19.9550, -44.1880] },
    { nome: 'Bilezão', coordenadas: [-20.0050, -44.2450] },
    { nome: 'Horto Municipal', coordenadas: [-19.9678, -44.1983] },
    { nome: 'Riccardo Medioli', coordenadas: [-19.9450, -44.1350] },
    { nome: 'Bicicross', coordenadas: [-19.9720, -44.1950] },
];
export default function TrainingMap() {
    const elemento = useRef(null);
    const [indisponivel, setIndisponivel] = useState(false);
    useEffect(() => {
        if (!window.L) { setIndisponivel(true); return; }
        const mapa = window.L.map(elemento.current, { scrollWheelZoom: false }).setView([-19.9678, -44.1983], 13);
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapa);
        unidades.forEach(u => window.L.marker(u.coordenadas).addTo(mapa).bindPopup(u.nome));
        return () => mapa.remove();
    }, []);
    return <section id="map-section" className="mb-20">
        <div className="border-l-8 border-yellow-400 pl-6 mb-8"><h3 className="text-3xl font-black text-blue-900 uppercase italic tracking-tighter">Onde Treinar em Betim</h3></div>
        <div id="map" ref={elemento} className="shadow-2xl" aria-label="Mapa dos locais de treino de Betim" />
        {indisponivel && <p role="status">Mapa indisponível no momento. Consulte os locais: {unidades.map(u => u.nome).join(', ')}.</p>}
    </section>;
}
