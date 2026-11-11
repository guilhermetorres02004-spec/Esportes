import React from 'react';
import { contatoSemes, linksInstitucionais } from './footer-data.js';
import './footer.css';

export default function Footer() {
    return <footer className="portal-footer" aria-label="Rodapé institucional">
        <div className="portal-footer-inner">
            <div className="portal-footer-columns">
                <section aria-labelledby="footer-portal">
                    <img className="portal-footer-city-logo" src="/logo/logo-footer-2025.png" alt="Prefeitura de Betim" width="150" height="48" loading="lazy" />
                    <h2 id="footer-portal">Portal do Esporte</h2>
                    <p>Modalidades, programas, locais de prática e conquistas do esporte de Betim.</p>
                </section>
                <section aria-labelledby="footer-contato">
                    <h2 id="footer-contato">Contato</h2>
                    <p>{contatoSemes.orgao}</p>
                    <address>
                        <a href={contatoSemes.telefoneHref}>{contatoSemes.telefone}</a>
                        <a href={`mailto:${contatoSemes.email}`}>{contatoSemes.email}</a>
                        <p>Atendimento: {contatoSemes.horario}</p>
                        <p>{contatoSemes.endereco}</p>
                    </address>
                    <a href={contatoSemes.fonte}>Consultar contatos oficiais da Semes</a>
                </section>
                <nav aria-labelledby="footer-links">
                    <h2 id="footer-links">Links institucionais</h2>
                    <ul>{linksInstitucionais.map(link => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}</ul>
                </nav>
            </div>
            <div className="portal-footer-credits">
                <p>{contatoSemes.orgao}</p>
                <a href="https://fundacaobeta.com.br" className="portal-footer-beta">
                    <img src="/logo/fundacaobeta-logo-horizontal-branco.png" alt="Fundação Beta" width="1522" height="526" loading="lazy" />
                </a>
            </div>
            <div className="portal-footer-bottom">
                <p>© {new Date().getFullYear()} Prefeitura de Betim</p>
                <p>Portal do Esporte</p>
            </div>
        </div>
    </footer>;
}
