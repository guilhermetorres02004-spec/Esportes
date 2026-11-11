import React, { useEffect, useRef } from 'react';
import TermText from './TermText.jsx';

export default function ImageConsent({ escolha, onChoice, enviando, erro, onClose, onConfirm }) {
    const dialog = useRef(null), corpo = useRef(null);
    useEffect(() => {
        const origem = document.activeElement, overflow = document.body.style.overflow;
        dialog.current.showModal(); corpo.current.focus(); document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = overflow; origem?.focus({ preventScroll: true }); };
    }, []);
    return <dialog ref={dialog} id="termoImagem" className="inscricao-consent" aria-labelledby="tituloTermoImagem" aria-describedby="resumoTermoImagem"
        onCancel={event => { if (enviando) event.preventDefault(); }} onClose={() => { if (!enviando) onClose(); }}>
        <header><div><h2 id="tituloTermoImagem">Autorização de uso de imagem</h2><p id="resumoTermoImagem">Sua escolha é opcional e não interfere na inscrição.</p></div>
            <button type="button" className="inscricao-close" aria-label="Fechar e voltar à ficha" onClick={onClose} disabled={enviando}>×</button></header>
        <div className="inscricao-term-text" ref={corpo} tabIndex={0}><TermText /></div>
        <div className="inscricao-consent-actions"><fieldset disabled={enviando}><legend>Deseja autorizar o uso de imagem? (opcional)</legend>
            <div className="inscricao-choices">{[['sim', 'Sim, autorizo'], ['nao', 'Não autorizo']].map(([value, text]) => <label key={value}><input type="radio" name="usoImagem" value={value} checked={escolha === value} onChange={() => onChoice(value)} />{text}</label>)}</div>
            <button type="button" className="inscricao-text-button" onClick={() => onChoice('')}>Limpar escolha</button></fieldset>
            {erro && <p className="inscricao-error" role="alert">{erro}</p>}
            <div className="inscricao-actions"><button type="button" className="inscricao-secondary" onClick={onClose} disabled={enviando}>Voltar à ficha</button>
                <button type="button" onClick={onConfirm} disabled={enviando}>{enviando ? 'Enviando…' : 'Concluir inscrição'}</button></div>
        </div></dialog>;
}
