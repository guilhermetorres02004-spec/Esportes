import React, { useEffect, useRef, useState } from 'react';
import Footer from '../home/Footer.jsx';
import { autenticar, destinoDoLogin } from './login-service.js';
import './login.css';

export default function LoginPage() {
    const [erro, setErro] = useState(''), [enviando, setEnviando] = useState(false);
    const pedido = useRef(null), ativo = useRef(true), mensagem = useRef(null);
    useEffect(() => {
        ativo.current = true; document.title = 'Login Administrativo — Portal do Esporte Betim';
        return () => { ativo.current = false; pedido.current?.abort(); };
    }, []);
    useEffect(() => { if (erro) mensagem.current?.focus(); }, [erro]);
    async function entrar(event) {
        event.preventDefault(); if (pedido.current) return;
        const form = event.currentTarget, dados = new FormData(form), controller = new AbortController();
        pedido.current = controller; setErro(''); setEnviando(true);
        const timeout = setTimeout(() => controller.abort(), 10000);
        try {
            await autenticar(dados.get('username'), dados.get('password'), { signal: controller.signal });
            if (ativo.current) { form.reset(); window.location.assign(destinoDoLogin(window.location.search)); }
        } catch (error) {
            if (ativo.current) setErro(error.name === 'AbortError' ? 'A conexão demorou mais que o esperado. Tente novamente.'
                : error instanceof TypeError ? 'Não foi possível conectar ao servidor. Verifique sua conexão.' : error.message);
        } finally {
            clearTimeout(timeout); pedido.current = null; if (ativo.current) setEnviando(false);
        }
    }
    return <><main id="conteudo" className="login-page" tabIndex={-1}>
        <a className="login-back" href="/">← Voltar ao início</a>
        <section className="login-card" aria-labelledby="login-title">
            <div className="login-visual"><img src="/Imagens/imagemLogin.jpeg" alt="Evento esportivo de Betim" width="800" height="800" />
                <div className="login-visual-copy"><span>Portal do Esporte · Betim</span><h2>Secretaria Municipal de Esportes</h2><p>Gestão do esporte da nossa cidade.</p></div></div>
            <div className="login-content"><span className="login-eyebrow">Acesso restrito</span><h1 id="login-title">Área administrativa</h1>
                <p>Informe suas credenciais para continuar.</p>
                <form id="login-form" onSubmit={entrar} aria-busy={enviando}>
                    <label htmlFor="username">Usuário</label><input id="username" name="username" type="text" required autoComplete="username" disabled={enviando} />
                    <label htmlFor="password">Senha</label><input id="password" name="password" type="password" required autoComplete="current-password" disabled={enviando} />
                    {erro && <p ref={mensagem} id="error-msg" className="login-error" role="alert" tabIndex={-1}>{erro}</p>}
                    <button type="submit" disabled={enviando}>{enviando ? 'Entrando…' : 'Entrar'}</button>
                    <a className="login-cancel" href="/">Cancelar</a>
                </form>
            </div>
        </section>
    </main><Footer /></>;
}
