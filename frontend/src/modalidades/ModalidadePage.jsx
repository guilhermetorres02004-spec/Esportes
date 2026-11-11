import React, { useEffect, useRef } from 'react';
import content from './content.json';
import { OfficialPhotosProvider, OfficialImage, useOfficialPhotos } from '../home/OfficialPhotos.jsx';

import '../home/home.css';

function Gallery({ categoria, className }) {
    const fotos = useOfficialPhotos(categoria).slice(0, 3);
    return <div className={className || 'modalidade-gallery'}>
        {fotos.length ? fotos.map(foto => <figure key={foto.id}><OfficialImage src={foto.url} alt={foto.titulo}
            data-foto-categoria={categoria} data-foto-indice={fotos.indexOf(foto)} loading="lazy" />
            <figcaption><a href={foto.origem} target="_blank" rel="noopener noreferrer">{foto.titulo} · Prefeitura de Betim</a></figcaption></figure>)
            : <p>As fotos oficiais desta modalidade serão exibidas quando estiverem disponíveis.</p>}
    </div>;
}

function FootballMap({ locations }) {
    const element = useRef(null);
    useEffect(() => {
        if (!window.L || !locations.length) return;
        const map = window.L.map(element.current, { scrollWheelZoom: false });
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
        for (const item of locations) {
            const popup = document.createElement('div');
            const name = document.createElement('strong'); name.textContent = item.nome;
            const address = document.createElement('p'); address.textContent = `${item.local} · ${item.endereco} · Educador: ${item.educador}`;
            const link = document.createElement('a'); link.textContent = 'Abrir no Google Maps'; link.target = '_blank'; link.rel = 'noopener noreferrer';
            link.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.local + ', ' + item.endereco)}`;
            popup.append(name, address, link); window.L.marker(item.coords).addTo(map).bindPopup(popup);
        }
        map.fitBounds(locations.map(item => item.coords), { padding: [30, 30] });
        return () => map.remove();
    }, [locations]);
    return <div id="mapaFutebol" ref={element} style={{ height: 640, width: '100%', borderRadius: 24 }} aria-label="Mapa dos núcleos de futebol" />;
}

function renderNode(node, key, page) {
    if (typeof node === 'string') return node;
    const props = { key };
    const names = { class: 'className', tabindex: 'tabIndex', for: 'htmlFor', srcset: 'srcSet', crossorigin: 'crossOrigin' };
    for (const [name, value] of Object.entries(node.props)) props[names[name] || name] = value;
    if (node.props.id === 'mapaFutebol') return <FootballMap key={key} locations={page.locations} />;
    if (node.props['data-fotos-galeria']) return <Gallery key={key} categoria={node.props['data-fotos-galeria']} className={props.className} />;
    if (node.props['data-inscricao']) props.onClick = () => { window.location.href = node.props['data-inscricao']; };
    if (node.tag === 'main' && !props.id) { props.id = 'conteudo'; props.tabIndex = -1; }
    const children = node.children.map((child, index) => renderNode(child, index, page));
    if (node.tag === 'img' && node.props['data-foto-categoria']) return <OfficialImage {...props} />;
    if (node.props.id === 'marquee-track') children.push(<div className="marquee-copy" aria-hidden="true" key="copy">{children.map((child, index) => React.isValidElement(child) ? React.cloneElement(child, { key: index }) : child)}</div>);
    return React.createElement(node.tag, props, ...(children.length ? children : []));
}

export default function ModalidadePage({ modalidade }) {
    const page = content[modalidade.id];
    useEffect(() => { document.title = page.title; }, [page.title]);
    return <OfficialPhotosProvider>{page.nodes.map((node, index) => renderNode(node, index, page))}</OfficialPhotosProvider>;
}
