(() => {
    // Escala e chaves compatíveis com preferencias-visuais do kit oficial.
    const MIN = 70, MAX = 140, PASSO = 10;
    let fonte = 100, escuro = false;
    const ler = () => {
        try {
            const salva = Number(localStorage.getItem('fontSize'));
            fonte = Number.isFinite(salva) && salva >= MIN && salva <= MAX ? salva : 100;
            escuro = localStorage.getItem('theme') === 'dark';
        } catch { /* Armazenamento bloqueado: mantém os valores em memória. */ }
    };
    const aplicar = () => {
        document.documentElement.style.fontSize = `${fonte}%`;
        document.documentElement.classList.toggle('dark', escuro);
    };
    const atualizar = () => {
        document.querySelectorAll('[data-portal-visual]').forEach(botao => {
            const acao = botao.dataset.portalVisual;
            if (acao === 'contraste') botao.setAttribute('aria-pressed', String(escuro));
            if (acao === 'aumentar') botao.disabled = fonte >= MAX;
            if (acao === 'diminuir') botao.disabled = fonte <= MIN;
        });
        const status = document.querySelector('[data-portal-visual-status]');
        if (status) status.textContent = `Texto em ${fonte}%. Contraste ${escuro ? 'ativado' : 'desativado'}.`;
    };
    ler();
    aplicar();
    document.addEventListener('DOMContentLoaded', atualizar);
    document.addEventListener('click', evento => {
        const botao = evento.target.closest('[data-portal-visual]');
        if (!botao || botao.disabled) return;
        const acao = botao.dataset.portalVisual;
        if (acao === 'aumentar') fonte = Math.min(MAX, fonte + PASSO);
        else if (acao === 'diminuir') fonte = Math.max(MIN, fonte - PASSO);
        else if (acao === 'contraste') escuro = !escuro;
        else if (acao === 'restaurar') { fonte = 100; escuro = false; }
        else return;
        aplicar();
        atualizar();
        try {
            localStorage.setItem('fontSize', String(fonte));
            localStorage.setItem('theme', escuro ? 'dark' : 'light');
        } catch { /* Os controles continuam funcionando sem persistência. */ }
    });
    window.addEventListener('storage', evento => {
        if (evento.key !== null && !['theme', 'fontSize'].includes(evento.key)) return;
        ler(); aplicar(); atualizar();
    });
})();
