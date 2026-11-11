import React, { useEffect, useRef, useState } from 'react';
import pontos from './pins-regionais.json';
import { regionalMapLink } from './mapas-regionais.js';
import { equipamentosNoMapa, pontoDoEquipamento, tipoDoEquipamento, tiposDoMapa, popupDoEquipamento } from './equipment-map.js';

function pinIcon(L, indice, selecionado) {
    return L.divIcon({ className: `regional-map-pin${selecionado ? ' regional-map-pin-selected' : ''}`,
        html: `<span class="regional-pin-shape"><span>${indice + 1}</span></span>`,
        iconSize: [34, 42], iconAnchor: [17, 38], tooltipAnchor: [0, -38] });
}

export default function RegionalMap({ regional, onSelect, equipamentos = [], regionais = [], onDetails }) {
    const target = useRef(null), mapa = useRef(null), marcadores = useRef([]), selecionar = useRef(onSelect);
    const locaisLayer = useRef(null), detalhes = useRef(onDetails);
    const [indisponivel, setIndisponivel] = useState(false);
    selecionar.current = onSelect;
    detalhes.current = onDetails;
    useEffect(() => {
        const L = window.L;
        if (!L) { setIndisponivel(true); return; }
        const map = L.map(target.current, {
            dragging: false, touchZoom: false, doubleClickZoom: false,
            scrollWheelZoom: false, boxZoom: false, keyboard: false, zoomControl: false,
        }); mapa.current = map;
        locaisLayer.current = L.layerGroup().addTo(map);
        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(map);
        tiles.on('tileerror', () => setIndisponivel(true));
        marcadores.current = pontos.pins.map((ponto, indice) => {
            const nome = document.createElement('span'); nome.textContent = ponto.nome;
            const marker = L.marker(ponto.coordenadas, { icon: pinIcon(L, indice, false), keyboard: true, autoPanOnFocus: false,
                title: `Selecionar Regional ${ponto.nome}`, alt: `Pin da Regional ${ponto.nome}`, riseOnHover: true }).addTo(map);
            const direcao = { alterosas: 'left', imbirucu: 'right', teresopolis: 'right', ptb: 'left' }[ponto.id] || 'top';
            marker.bindTooltip(nome, { permanent: true, direction: direcao, className: 'regional-pin-label' });
            marker.on('click', () => selecionar.current?.(ponto.id));
            return { ponto, marker, indice };
        });
        map.fitBounds(pontos.pins.map(ponto => ponto.coordenadas), { padding: [60, 70], maxZoom: 13 });
        return () => { map.remove(); mapa.current = null; marcadores.current = []; locaisLayer.current = null; };
    }, []);
    useEffect(() => {
        if (!mapa.current) return;
        for (const { ponto, marker, indice } of marcadores.current) {
            marker.setIcon(pinIcon(window.L, indice, ponto.id === regional?.id));
            marker.setZIndexOffset(ponto.id === regional?.id ? 1000 : 0);
        }
    }, [regional?.id]);
    useEffect(() => {
        const map = mapa.current, layer = locaisLayer.current, L = window.L;
        if (!map || !layer) return;
        layer.clearLayers();
        const locais = equipamentosNoMapa(equipamentos, regional);
        for (const item of locais) {
            const coords = pontoDoEquipamento(item), tipo = tipoDoEquipamento(item);
            const icon = L.divIcon({ className: `equipment-map-pin equipment-type-${tipo.id}`,
                html: `<span class="equipment-pin-shape"><i class="fas ${tipo.icon}" aria-hidden="true"></i></span>`,
                iconSize: [36, 44], iconAnchor: [18, 42], popupAnchor: [0, -40] });
            const marker = L.marker(coords, { icon, keyboard: true, autoPanOnFocus: false, title: item.nome, alt: `${tipo.nome}: ${item.nome}`, riseOnHover: true }).addTo(layer);
            marker.bindPopup(popupDoEquipamento(item, regionais, value => detalhes.current?.(value)), { className: 'equipment-leaflet-popup', maxWidth: 320, minWidth: 240, autoPan: false });
        }
    }, [regional?.id, equipamentos, regionais]);
    const locais = equipamentosNoMapa(equipamentos, regional);
    const pendentes = regional ? equipamentos.filter(item => item.regionais.includes(regional.id)).length - locais.length : 0;
    return <section className="regional-map-panel" aria-labelledby="regional-map-title">
        <div className="regional-map-heading"><div><h2 id="regional-map-title">{regional ? `Mapa · Regional ${regional.nome}` : 'Escolha uma regional no mapa'}</h2>
            <p>{regional ? 'Clique no ícone de um espaço para abrir sua foto e informações.' : 'Clique em um dos dez pins para conhecer os núcleos da regional. Você também pode usar os botões abaixo.'}</p></div>
            <a href={regionalMapLink(regional)} target="_blank" rel="noopener noreferrer">{regional ? 'Administração no Google Maps' : 'Abrir Betim no Google Maps'} ↗</a></div>
        {indisponivel && <p role="status">Não foi possível carregar o mapa completo. Selecione a regional nos botões abaixo.</p>}
        <div className="regional-map-stage">
            <div ref={target} className="regional-pins-map" aria-label="Mapa interativo com dez pins das regionais de Betim" />
            {regional && <ul className="equipment-map-legend" aria-label="Legenda dos locais no mapa">{tiposDoMapa.slice(0, 5).map(tipo => <li key={tipo.id}><span className={`equipment-legend-icon equipment-type-${tipo.id}`}><i className={`fas ${tipo.icon}`} aria-hidden="true" /></span>{tipo.nome}</li>)}</ul>}
        </div>
        {regional && <p role="status" className="regional-map-caption">{locais.length} locais com posição cadastrada no mapa.{pendentes > 0 && ` ${pendentes} locais aguardam coordenadas confirmadas e continuam disponíveis na lista.`}</p>}
        <p className="regional-map-caption">Pins de referência das regionais segundo o OpenStreetMap. Não indicam sedes exatas nem limites oficiais. <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap</a></p>
    </section>;
}
