import React, { createContext, useContext, useEffect, useState } from 'react';
import { fotoValida } from './fotos-utils.js';

const PhotosContext = createContext({ fotos: [], invalidar() {} });
export function OfficialPhotosProvider({ children }) {
    const [fotos, setFotos] = useState([]);
    const [invalidas, setInvalidas] = useState(() => new Set());
    useEffect(() => {
        let ativa = true, ocupada = false, controller;
        async function atualizar() {
            if (!ativa || ocupada || document.hidden) return;
            ocupada = true;
            controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000);
            try {
                const resposta = await fetch('/api/fotos', { cache: 'no-store', signal: controller.signal });
                if (!resposta.ok) return;
                const dados = await resposta.json();
                if (ativa && Array.isArray(dados.fotos)) setFotos(dados.fotos.filter(fotoValida));
            } catch { /* Mantém as fotos e notícias já apresentadas. */ }
            finally { clearTimeout(timeout); ocupada = false; }
        }
        atualizar();
        const timer = setInterval(atualizar, 300000);
        document.addEventListener('visibilitychange', atualizar);
        return () => { ativa = false; controller?.abort(); clearInterval(timer); document.removeEventListener('visibilitychange', atualizar); };
    }, []);
    const invalidar = url => setInvalidas(anteriores => new Set([...anteriores, url]));
    return <PhotosContext.Provider value={{ fotos: fotos.filter(f => !invalidas.has(f.url)), invalidar }}>{children}</PhotosContext.Provider>;
}
export function useOfficialPhoto(categoria, indice = 0) {
    const { fotos } = useContext(PhotosContext);
    const opcoes = fotos.filter(f => f.categorias.includes(categoria));
    return opcoes.length ? opcoes[Number(indice) % opcoes.length] : null;
}
export function useOfficialPhotos(categoria) {
    const { fotos } = useContext(PhotosContext);
    return fotos.filter(foto => foto.categorias.includes(categoria));
}
export function OfficialImage(props) {
    const foto = useOfficialPhoto(props['data-foto-categoria'], props['data-foto-indice']);
    const { invalidar } = useContext(PhotosContext);
    return <img {...props} src={foto?.url || props.src} alt={props['aria-hidden'] === 'true' ? '' : foto?.titulo || props.alt}
        onError={() => { if (foto) invalidar(foto.url); }} />;
}
export function OfficialCredit({ categoria, indice = 0, children, ...props }) {
    const foto = useOfficialPhoto(categoria, indice);
    return <a {...props} href={foto?.origem || props.href}>{foto ? `${foto.titulo} · Prefeitura de Betim${foto.publicadoEm ? ` · ${foto.publicadoEm}` : ''}` : children}</a>;
}
export function PhotoSources() {
    const { fotos } = useContext(PhotosContext);
    if (!fotos.length) return null;
    return <details id="fotos-fontes" className="fotos-fontes"><summary>Fotos oficiais · Prefeitura de Betim</summary>
        <ul>{fotos.map(f => <li key={f.id}><a href={f.origem} target="_blank" rel="noopener noreferrer">{f.titulo} · Prefeitura de Betim</a></li>)}</ul>
    </details>;
}
