(() => {
    if (document.querySelector('.sidebar') || document.getElementById('portal-navigation')) return;

    const items = [
        ['index.html', 'fa-home', 'Início'],
        ['futebol.html', 'fa-futbol', 'Futebol'],
        ['volei.html', 'fa-volleyball-ball', 'Voleibol'],
        ['detalhe-modalidade.html', 'fa-medal', 'Judô'],
        ['administrativo.html', 'fa-file-contract', 'Administrativo'],
        ['comunicacao.html', 'fa-folder-open', 'Arquivos'],
        ['index.html#rendimento', 'fa-trophy', 'Rendimento'],
        ['index.html#atividades-esportivas', 'fa-person-running', 'Atividades Esportivas'],
        ['index.html#escola', 'fa-graduation-cap', 'Escola Esporte'],
        ['index.html#viva-esporte', 'fa-heart', 'Viva o Esporte'],
        ['downloads.html', 'fa-file-download', 'Central de Downloads'],
        ['almoxarifado.html', 'fa-boxes', 'Almoxarifado'],
        ['frequenciapreenchimento.html', 'fa-clipboard-check', 'Folha de Presença'],
        ['presenca.html', 'fa-table', 'Relatório de Presença'],
        ['agenda.html', 'fa-calendar-alt', 'Agenda de Eventos'],
        ['agendamento-quadras.html', 'fa-calendar-check', 'Quadras do Horto'],
        ['detalhes-evento.html', 'fa-calendar-day', 'Detalhes do Evento'],
        ['descanso.html', 'fa-chart-line', 'Matrix Impact'],
        ['esporteteste.html', 'fa-layer-group', 'Página Base'],
    ];

    const root = document.createElement('div');
    root.id = 'portal-navigation';
    root.innerHTML = `
        <aside id="portal-menu-panel" class="portal-menu-panel" aria-label="Menu do portal" inert>
            <h2 class="portal-menu-title">Navegação</h2>
            <nav class="portal-menu-links" aria-label="Navegação do portal">
                ${items.map(([href, icon, label]) => `<a class="portal-menu-link" href="${href}"><i class="fas ${icon}" aria-hidden="true"></i><span>${label}</span></a>`).join('')}
            </nav>
        </aside>
        <button class="portal-menu-trigger" type="button" aria-controls="portal-menu-panel" aria-expanded="false" aria-label="Abrir menu lateral">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            <span>Menu</span>
        </button>`;
    document.body.prepend(root);

    const panel = root.querySelector('.portal-menu-panel');
    const trigger = root.querySelector('.portal-menu-trigger');
    const icon = trigger.querySelector('path');
    root.querySelectorAll('.portal-menu-link').forEach(link => {
        const destination = new URL(link.href);
        if (destination.pathname === window.location.pathname && !destination.hash) {
            link.setAttribute('aria-current', 'page');
        }
    });

    function setOpen(open) {
        panel.classList.toggle('is-open', open);
        panel.inert = !open;
        trigger.setAttribute('aria-expanded', String(open));
        trigger.setAttribute('aria-label', open ? 'Fechar menu lateral' : 'Abrir menu lateral');
        icon.setAttribute('d', open ? 'M6 6l12 12M6 18L18 6' : 'M4 6h16M4 12h16M4 18h16');
    }

    trigger.addEventListener('click', () => setOpen(trigger.getAttribute('aria-expanded') !== 'true'));
    panel.addEventListener('click', event => {
        if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('click', event => {
        if (!root.contains(event.target)) setOpen(false);
    }, { capture: true });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true') {
            setOpen(false);
            trigger.focus();
        }
    });
})();
