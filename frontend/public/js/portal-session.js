(() => {
    const usuario = document.getElementById('portal-session-user');
    const login = document.getElementById('portal-session-login');
    const sair = document.getElementById('sair');
    const status = document.getElementById('portal-session-status');
    const menusAutenticados = ['portal-menu-eventos', 'portal-menu-gestao'].map(id => document.getElementById(id)).filter(Boolean);
    if (!usuario || !login || !sair || !status) return;
    let sequencia = 0, consultando = false, saindo = false;

    function mostrar(conta) {
        usuario.textContent = conta ? `Conectado: ${conta.username}` : '';
        usuario.setAttribute('data-initial', conta ? conta.username.trim().slice(0, 1).toUpperCase() : '');
        usuario.hidden = !conta;
        sair.hidden = !conta;
        login.hidden = Boolean(conta) || login.dataset?.temporariamenteDesativado === 'true';
        for (const menu of menusAutenticados) { menu.hidden = !conta; if (!conta) menu.open = false; }
        status.hidden = true;
    }

    async function atualizar() {
        if (consultando || saindo) return;
        consultando = true;
        const consulta = ++sequencia;
        try {
            const resposta = await fetch('/api/auth/me', { credentials: 'include', cache: 'no-store', signal: AbortSignal.timeout(8000) });
            if (consulta !== sequencia) return;
            if (resposta.status === 401) { mostrar(null); return; }
            if (!resposta.ok) throw new Error('Sessão indisponível');
            const conta = await resposta.json();
            if (consulta !== sequencia) return;
            if (typeof conta.username !== 'string' || !conta.username) throw new Error('Sessão inválida');
            mostrar(conta);
        } catch {
            if (consulta === sequencia) { status.textContent = 'Não foi possível verificar a sessão.'; status.hidden = false; }
        } finally { consultando = false; }
    }
    sair.addEventListener('click', async () => {
        if (saindo) return;
        saindo = true; sair.disabled = true; sequencia++;
        try {
            const resposta = await fetch('/logout', { method: 'POST', credentials: 'include', signal: AbortSignal.timeout(8000) });
            if (!resposta.ok) throw new Error('Saída indisponível');
            mostrar(null);
            window.location.href = 'login.html';
        } catch {
            status.textContent = 'Não foi possível sair. Tente novamente.'; status.hidden = false;
        } finally { saindo = false; sair.disabled = false; }
    });
    window.addEventListener('pageshow', atualizar);
    window.addEventListener('focus', atualizar);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) atualizar(); });
    atualizar();
})();
