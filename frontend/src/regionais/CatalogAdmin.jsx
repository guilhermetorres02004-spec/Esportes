import React, { useEffect, useState } from 'react';
import { catalogoValido } from './regionais-utils.js';

export default function CatalogAdmin({ catalogo, onSave }) {
    const [admin, setAdmin] = useState(false), [texto, setTexto] = useState(''), [status, setStatus] = useState(''), [salvando, setSalvando] = useState(false);
    useEffect(() => {
        const controller = new AbortController();
        fetch('/api/auth/me', { credentials: 'include', signal: controller.signal, cache: 'no-store' })
            .then(async response => { if (!response.ok) return; const user = await response.json(); setAdmin(user.authorities?.some(role => role.authority === 'ROLE_ADMIN')); }).catch(() => {});
        return () => controller.abort();
    }, []);
    useEffect(() => { setTexto(JSON.stringify(catalogo, null, 2)); }, [catalogo]);
    async function salvar(event) {
        event.preventDefault(); if (salvando) return;
        try {
            const dados = JSON.parse(texto);
            if (!catalogoValido(dados)) throw new Error('Revise a estrutura do catálogo e as fontes oficiais.');
            setSalvando(true); setStatus('Salvando catálogo…');
            const response = await fetch('/api/regionais/catalogo', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dados) });
            if (!response.ok) throw new Error(response.status === 401 || response.status === 403 ? 'Sua sessão não permite atualizar o catálogo.' : 'Catálogo não salvo. Revise os dados e as fontes oficiais.');
            onSave(await response.json()); setStatus('Catálogo salvo. Os dados públicos foram atualizados.');
        } catch (error) { setStatus(error instanceof SyntaxError ? 'O JSON informado não é válido.' : error.message); }
        finally { setSalvando(false); }
    }
    if (!admin) return null;
    return <details className="regional-panel"><summary>Administrar catálogo de regionais</summary><form onSubmit={salvar}>
        <p>Edite o catálogo JSON. Use apenas informações verificadas e mantenha a fonte de cada registro. Campos ainda não confirmados devem permanecer nulos ou vazios.</p>
        <label htmlFor="regional-catalog-json">Catálogo de equipamentos, programas e eventos</label>
        <textarea id="regional-catalog-json" rows={18} value={texto} onChange={event => setTexto(event.target.value)} spellCheck={false} />
        <button className="regional-primary" disabled={salvando} type="submit">{salvando ? 'Salvando…' : 'Salvar catálogo'}</button>
        <p role="status">{status}</p>
    </form></details>;
}
