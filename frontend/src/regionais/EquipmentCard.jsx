import React, { useEffect, useRef, useState } from 'react';
import { comoChegar } from './regionais-utils.js';

export function LocalPhoto({ item }) {
    const [falhou, setFalhou] = useState(false);
    return item.foto && !falhou ? <img src={item.foto} alt={item.nome} loading="lazy" width="640" height="400" onError={() => setFalhou(true)} />
        : <div className="regional-photo-pending"><i className="fas fa-camera" aria-hidden="true" /><span>Fotografia pendente de cadastro</span></div>;
}
export function EquipmentCard({ item, regionais, onDetails }) {
    return <article className="regional-equipment">
        <LocalPhoto item={item} />
        <div className="regional-equipment-body"><p className="regional-eyebrow">{item.tipo}</p><h3>{item.nome}</h3>
            <p>{item.regionais.map(id => regionais.find(r => r.id === id)?.nome).filter(Boolean).join(', ')} · {item.bairro || 'Bairro não informado'}</p>
            <p>{item.endereco || 'Endereço pendente de cadastro'}</p>
            <p><strong>Modalidades:</strong> {item.modalidades.join(', ') || 'Consulte o local para confirmar.'}</p>
            <p><strong>Horários:</strong> {item.horarios || 'A confirmar com o local.'}</p>
            <p><strong>Acessibilidade:</strong> {item.acessibilidade || 'Informação não publicada nesta fonte.'}</p>
            <div className="regional-actions"><button type="button" onClick={() => onDetails(item)}>Ver detalhes<span className="sr-only"> de {item.nome}</span></button>
                <a href={comoChegar(item)} target="_blank" rel="noopener noreferrer">Como chegar<span className="sr-only"> a {item.nome}</span> ↗</a></div>
        </div>
    </article>;
}
export function EquipmentDetails({ item, onClose }) {
    const dialog = useRef(null);
    useEffect(() => {
        if (!item) return;
        const node = dialog.current; node.showModal();
        return () => { if (node.open) node.close(); };
    }, [item]);
    return <dialog ref={dialog} className="regional-dialog" aria-labelledby="regional-detail-title" onCancel={onClose}
        onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
        {item && <><button className="regional-dialog-close" type="button" onClick={onClose} aria-label="Fechar detalhes">×</button>
            <h2 id="regional-detail-title">{item.nome}</h2><LocalPhoto key={item.id} item={item} />
            <p>{item.descricao || 'Consulte a fonte oficial para informações adicionais.'}</p><p>{item.endereco || 'Endereço ainda não publicado.'}</p>
            <p>O endereço está reproduzido conforme a fonte. Confirme com o local quando não houver número ou referência completa.</p>
            <a href={item.fonte} target="_blank" rel="noopener noreferrer">Consultar o registro oficial</a>
            <a className="regional-primary" href={comoChegar(item)} target="_blank" rel="noopener noreferrer">Como chegar ↗</a></>}
    </dialog>;
}
