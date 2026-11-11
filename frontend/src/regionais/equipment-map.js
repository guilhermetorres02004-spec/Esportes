import localizacoes from './equipamentos-pins.json' with { type: 'json' };

export const tiposDoMapa = [
    { id: 'campo', nome: 'Campo de Futebol', icon: 'fa-futbol' },
    { id: 'quadra', nome: 'Quadra Esportiva', icon: 'fa-basketball-ball' },
    { id: 'praca', nome: 'Praça / Área de Lazer', icon: 'fa-tree' },
    { id: 'complexo', nome: 'Complexo Esportivo', icon: 'fa-building' },
    { id: 'pista', nome: 'Pista Esportiva', icon: 'fa-person-running' },
    { id: 'espaco', nome: 'Espaço Esportivo', icon: 'fa-location-dot' },
];
export function tipoDoEquipamento(item) {
    const nome = item.nome.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
    const id = /quadra/.test(nome) ? 'quadra' : /campo|estadio/.test(nome) ? 'campo'
        : /praca|parque|area de lazer|orla/.test(nome) ? 'praca' : /pista|bicicross/.test(nome) ? 'pista'
        : /ginasio|complexo|nucleo|galpao|anexo/.test(nome) ? 'complexo' : 'espaco';
    return tiposDoMapa.find(tipo => tipo.id === id);
}
export function pontoDoEquipamento(item) {
    const coords = item.coordenadas;
    if (Array.isArray(coords) && coords.length === 2 && coords.every(Number.isFinite)
        && Math.abs(coords[0]) <= 90 && Math.abs(coords[1]) <= 180 && item.fonteCoordenadas) return coords;
    return localizacoes.pins.find(pin => pin.id === item.id)?.coordenadas || null;
}
export function equipamentosNoMapa(equipamentos, regional) {
    return regional ? equipamentos.filter(item => item.regionais.includes(regional.id) && pontoDoEquipamento(item)) : [];
}

export function popupDoEquipamento(item, regionais, onDetails, doc = document) {
    const criar = (tag, classe, texto) => { const node = doc.createElement(tag); node.className = classe; if (texto) node.textContent = texto; return node; };
    const tipo = tipoDoEquipamento(item), popup = criar('article', 'equipment-map-popup');
    const placeholder = () => criar('div', 'equipment-popup-no-photo', 'Fotografia pendente de cadastro');
    if (item.foto) {
        const img = criar('img', 'equipment-popup-photo'); img.src = item.foto; img.alt = item.nome; img.loading = 'lazy';
        img.onerror = () => img.replaceWith(placeholder()); popup.append(img);
    } else popup.append(placeholder());
    const body = criar('div', 'equipment-popup-body'), heading = criar('div', 'equipment-popup-heading');
    heading.append(criar('h3', '', item.nome));
    const badge = criar('span', `equipment-map-badge equipment-type-${tipo.id}`), icon = criar('i', `fas ${tipo.icon}`);
    icon.setAttribute('aria-hidden', 'true'); badge.append(icon, doc.createTextNode(' ' + tipo.nome)); heading.append(badge);
    const locais = item.regionais.map(id => regionais.find(r => r.id === id)?.nome).filter(Boolean).join(', ');
    const local = criar('p', 'equipment-popup-location', `Regional ${locais} · ${item.bairro || 'Bairro não informado'}`);
    const descricao = criar('p', 'equipment-popup-description', item.descricao || item.endereco || 'Consulte os detalhes deste espaço.');
    const action = criar('button', 'equipment-popup-action', 'Conhecer espaço →'); action.type = 'button';
    action.addEventListener('click', () => onDetails?.(item));
    body.append(heading, local, descricao, action); popup.append(body); return popup;
}
