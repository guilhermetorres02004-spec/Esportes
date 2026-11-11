import React, { useEffect, useRef, useState } from 'react';
import { dataConsultaDocumentos } from '../../public/js/admin-documentos-data.js';
import '../../public/css/admin-documentos.css';

export default function AdminDocument({ dados, onClose }) {
    const dialog = useRef(null), title = useRef(null);
    const [modo, setModo] = useState(dados.pdf ? 'pdf' : 'resumo');
    useEffect(() => {
        const origem = document.activeElement;
        dialog.current.showModal(); title.current.focus({ preventScroll: true });
        return () => origem?.focus({ preventScroll: true });
    }, []);
    const link = (dadosLink, classe = '', externo = true) => dadosLink && <a className={'admin-doc-botao ' + classe}
        href={dadosLink.href.startsWith('/') || /^https?:/.test(dadosLink.href) ? dadosLink.href : '/' + dadosLink.href}
        target={externo ? '_blank' : undefined} rel={externo ? 'noopener noreferrer' : undefined}>{dadosLink.texto}</a>;
    return <dialog ref={dialog} id="adminDocumento" aria-labelledby="adminDocumentoTitulo" aria-describedby="adminDocumentoFonte" onClose={onClose}
        onClick={event => { const r = event.currentTarget.getBoundingClientRect(); if (event.target === event.currentTarget && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) onClose(); }}>
        <div className="admin-doc-painel"><header className="admin-doc-cabecalho"><div>
            <p className="admin-doc-categoria">{dados.categoria}</p><h2 ref={title} id="adminDocumentoTitulo" tabIndex={-1}>{dados.titulo}</h2>
            <p id="adminDocumentoFonte" className="admin-doc-fonte">{dados.documento} · {dados.origem} · {dados.abrangencia} · Consulta: {dataConsultaDocumentos}</p>
        </div><button type="button" className="admin-doc-fechar" aria-label="Fechar documento" onClick={onClose}>×</button></header>
        <div className="admin-doc-modos" aria-label="Modo de leitura"><button type="button" className="admin-doc-botao" aria-pressed={modo === 'resumo'} onClick={() => setModo('resumo')}>Resumo de consulta</button>
            {dados.pdf && <button type="button" className="admin-doc-botao" aria-pressed={modo === 'pdf'} onClick={() => setModo('pdf')}>Documento integral</button>}</div>
        <div className="admin-doc-corpo">{modo === 'pdf' && dados.pdf ? <div><iframe className="admin-doc-leitor" title={dados.documento} referrerPolicy="no-referrer" src={`${dados.pdf}#page=${dados.pagina || 1}&toolbar=1&navpanes=0`} />
            <p className="admin-doc-nota">Use os controles do leitor para buscar no texto, ampliar ou navegar pelas páginas. Você também pode abrir o PDF em outra aba.</p></div>
            : <section className="admin-doc-resumo"><h3>Resumo de consulta</h3>{dados.paragrafos.map((texto, index) => <p key={index}>{texto}</p>)}</section>}</div>
        <footer className="admin-doc-rodape">{link(dados.acao, 'admin-doc-primario', false)}{link(dados.relacionado)}{dados.pdf && link({ href: dados.pdf, texto: 'Abrir PDF em outra aba' })}
            {link({ href: dados.fonte, texto: 'Fonte oficial' })}<button type="button" className="admin-doc-botao" onClick={onClose}>Fechar</button></footer></div>
    </dialog>;
}
