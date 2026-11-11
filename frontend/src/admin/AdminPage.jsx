import React, { useEffect, useState } from 'react';
import Footer from '../home/Footer.jsx';
import AdminContent from './AdminContent.jsx';
import AdminDocument from './AdminDocument.jsx';
import { documentosAdministrativos } from '../../public/js/admin-documentos-data.js';
import { consultarSessao } from './admin-session.js';
import './admin.css';

export default function AdminPage() {
    const [conta, setConta] = useState(null), [documento, setDocumento] = useState(null);
    useEffect(() => {
        document.title = 'Gestão Administrativa — Portal do Esporte Betim';
        let ativo = true, controller, verificando = false;
        async function verificar() {
            if (verificando || document.hidden) return;
            verificando = true; controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000);
            try { const data = await consultarSessao({ signal: controller.signal }); if (ativo) setConta(data); }
            catch { if (ativo) { setConta(null); setDocumento(null); window.location.replace('/entrar'); } }
            finally { verificando = false; clearTimeout(timeout); }
        }
        verificar(); document.addEventListener('visibilitychange', verificar);
        window.addEventListener('pageshow', verificar);
        return () => { ativo = false; controller?.abort(); document.removeEventListener('visibilitychange', verificar); window.removeEventListener('pageshow', verificar); };
    }, []);
    if (!conta) return <main id="conteudo" className="admin-page" tabIndex={-1}><p role="status">Verificando acesso à área administrativa…</p></main>;
    return <><AdminContent onDocument={id => setDocumento(documentosAdministrativos[id] || null)} /><Footer />
        {documento && <AdminDocument dados={documento} onClose={() => setDocumento(null)} />}</>;
}
