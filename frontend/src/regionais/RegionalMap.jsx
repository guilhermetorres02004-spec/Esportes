import React, { useEffect, useRef } from 'react';

export default function RegionalMap({ equipamentos }) {
    const target = useRef(null);
    const pontos = equipamentos.filter(item => Array.isArray(item.coordenadas) && item.coordenadas.length === 2);
    useEffect(() => {
        if (!window.L || !pontos.length) return;
        const map = window.L.map(target.current, { scrollWheelZoom: false });
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
        for (const item of pontos) {
            const label = document.createElement('span'); label.textContent = item.nome;
            window.L.marker(item.coordenadas).addTo(map).bindPopup(label);
        }
        map.fitBounds(pontos.map(item => item.coordenadas), { padding: [30, 30], maxZoom: 15 });
        return () => map.remove();
    }, [equipamentos]);
    return <section className="regional-map-panel" aria-labelledby="regional-map-title">
        <h2 id="regional-map-title">Explore as regionais</h2>
        <p>Selecione uma regional nos cards. Consulte o endereço de cada equipamento e use “Como chegar” para abrir a rota no Google Maps.</p>
        {pontos.length ? <div ref={target} className="regional-map" aria-label="Mapa dos equipamentos com coordenadas verificadas" />
            : <p className="regional-note">Mapa territorial pendente de dados geográficos oficiais. A navegação por regionais está disponível abaixo, sem limites desenhados ou localizações estimadas.</p>}
    </section>;
}
