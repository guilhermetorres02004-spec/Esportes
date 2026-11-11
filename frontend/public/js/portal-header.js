(() => {
    if (document.getElementById('portal-site-header')) return;

    const librasScript = document.createElement('script');
    librasScript.src = '/js/portal-libras.js';
    document.head.append(librasScript);

    const suporteCss = document.createElement('link');
    suporteCss.rel = 'stylesheet';
    suporteCss.href = '/css/portal-suporte.css';
    document.head.append(suporteCss);
    const suporteScript = document.createElement('script');
    suporteScript.type = 'module';
    suporteScript.src = '/js/portal-suporte.js';
    document.head.append(suporteScript);
    const fotosScript = document.createElement('script');
    fotosScript.type = 'module';
    fotosScript.src = '/js/portal-fotos.js';
    if (document.documentElement?.dataset.reactHome !== 'true') document.head.append(fotosScript);

    const page = window.location.pathname.split('/').pop().toLowerCase();
    const home = page === '' || page === 'index.html';
    // Reativar os dois acessos do cabeçalho alterando esta opção para true.
    const acessosHabilitados = false;
    const backId = page === 'inscricao.html' ? 'id="btnVoltarModalidade"' : '';
    const categorias = [
        ['Modalidades', [['Futebol', '/futebol'], ['Voleibol', '/volei'], ['Judô', '/judo'],
            ['Futsal', '/futsal'], ['Basquete', '/basquete'], ['Ver todas', '/#escola']]],
        ['Programas', [['Atividades Esportivas', '/#atividades-esportivas'],
            ['Escola Esporte', '/#escola'], ['Viva o Esporte', '/#viva-esporte']]]
    ];
    const atual = href => !href.includes('#') && href.replace(/^\//, '') === page ? ' aria-current="page"' : '';
    const menus = categorias.map(([nome, itens]) => `
                    <details class="portal-header-menu">
                        <summary>${nome}</summary>
                        <div class="portal-header-dropdown">${itens.map(([texto, href]) => `<a href="${href}"${atual(href)}>${texto}</a>`).join('')}</div>
                    </details>`).join('');

    document.currentScript.insertAdjacentHTML('beforebegin', `
        <div class="portal-accessibility-bar" role="group" aria-label="Preferências de acessibilidade">
            <div class="portal-accessibility-inner">
                <button type="button" data-portal-visual="aumentar" aria-label="Aumentar tamanho da fonte">A+</button>
                <button type="button" data-portal-visual="diminuir" aria-label="Diminuir tamanho da fonte">A−</button>
                <button type="button" data-portal-visual="contraste" aria-pressed="false">Contraste</button>
                <button type="button" data-portal-visual="restaurar">Restaurar</button>
                <span class="portal-institutional-sr" role="status" data-portal-visual-status></span>
            </div>
        </div>
        <div class="portal-institutional-bar">
            <div class="portal-institutional-inner">
                <nav class="portal-institutional-links" aria-label="Links institucionais">
                    <a href="https://betim.mg.gov.br" target="_blank" rel="noopener noreferrer">Portal da Prefeitura <span aria-hidden="true">↗</span><span class="portal-institutional-sr"> (abre em nova aba)</span></a>
                    <a href="https://betim.mg.gov.br/portal/diario-oficial/" target="_blank" rel="noopener noreferrer">Diário Oficial <span aria-hidden="true">↗</span><span class="portal-institutional-sr"> (abre em nova aba)</span></a>
                    <a href="https://sistemas.betim.mg.gov.br/acessoouvidoria" target="_blank" rel="noopener noreferrer">Ouvidoria <span aria-hidden="true">↗</span><span class="portal-institutional-sr"> (abre em nova aba)</span></a>
                </nav>
                <span class="portal-institutional-name">Prefeitura Municipal de Betim</span>
            </div>
        </div>
        <header class="portal-header-topbar">
            <div class="portal-header-topbar-inner">
                <div class="portal-header-logos">
                    <a href="https://www.betim.mg.gov.br/" aria-label="Prefeitura de Betim">
                        <img src="/logo/betim-logo-branca.png" alt="Prefeitura de Betim — Futuro para todos" width="132" height="60">
                    </a>
                    <a class="portal-header-partner" href="https://fundacaobeta.com.br" aria-label="Fundação Beta">
                        <img src="/logo/fundacaobeta-logo-horizontal-branco.png" alt="Fundação Beta" width="104" height="48">
                    </a>
                </div>
                <a href="/" class="portal-header-title">Portal do Esporte</a>
                ${acessosHabilitados ? '<a href="Inscricao.html" class="portal-header-primary">Inscreva-se</a>' : ''}
            </div>
        </header>
        <nav id="portal-site-header" tabindex="-1" class="portal-header-nav" aria-label="Acesso ao portal">
            <div class="portal-header-inner">
                <div class="portal-header-menus" aria-label="Navegação do portal">
                    <a href="/" class="portal-header-link"${home ? ' aria-current="page"' : ''}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m3 10 9-7 9 7v10H3zM9 20v-8h6v8"/></svg>Início
                    </a>
                    <details class="portal-header-menu">
                        <summary>Portal</summary>
                        <div class="portal-header-dropdown">
                            <a href="/#noticias">Notícias</a>
                            <a href="/#map-section">Onde treinar</a>
                            <a href="downloads.html">Documentos e downloads</a>
                            ${home ? '' : `<a ${backId} href="/">← Voltar ao início</a>`}
                        </div>
                    </details>${menus}
                </div>
                <div class="portal-header-utilities">
                    <div class="portal-header-actions">
                        <span id="portal-session-status" class="portal-header-session-status" role="status">Verificando sessão…</span>
                        <span id="portal-session-user" class="portal-header-user" hidden></span>
                        <a id="portal-session-login" href="login.html" class="portal-header-action" data-temporariamente-desativado="${!acessosHabilitados}" hidden>Login</a>
                        <button id="sair" type="button" class="portal-header-action portal-header-logout" hidden>Sair</button>
                    </div>
                    <details class="portal-header-menu">
                        <summary><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h6v6h-6z"/></svg>Portais</summary>
                        <div class="portal-header-dropdown">
                            <a href="https://www.betim.mg.gov.br/">Portal da Prefeitura</a>
                            <a href="https://memoria.3106705.xyz/">Portal da Memória</a>
                        </div>
                    </details>
                </div>
            </div>
        </nav>`);

    const abas = [...document.querySelectorAll('.portal-header-menu')];
    const descricoes = {
        '/#noticias': 'Acompanhe as notícias e os destaques do esporte de Betim.',
        '/#map-section': 'Encontre os locais para praticar esporte na cidade.',
        'downloads.html': 'Consulte documentos e materiais do Portal do Esporte.',
        '/': 'Volte à página principal do Portal do Esporte.',
        '/futebol': 'Conheça o futebol e os locais de prática em Betim.',
        '/futsal': 'Conheça o futsal e seus núcleos esportivos em Betim.',
        '/basquete': 'Conheça o basquete e seus núcleos esportivos em Betim.',
        '/volei': 'Explore o voleibol e suas atividades na cidade.',
        '/judo': 'Saiba mais sobre a modalidade e suas atividades.',
        '/#atividades-esportivas': 'Explore as atividades esportivas oferecidas no portal.',
        '/#escola': 'Conheça o programa Escola Esporte.',
        '/#viva-esporte': 'Saiba mais sobre o programa Viva o Esporte.',
        'https://www.betim.mg.gov.br/': 'Acesse os serviços e as informações da Prefeitura de Betim.',
        'https://memoria.3106705.xyz/': 'Conheça o Portal da Memória de Betim.',
    };
    abas.forEach(aba => {
        const painel = aba.querySelector('.portal-header-dropdown');
        const links = [...painel.querySelectorAll('a')];
        const cabecalho = document.createElement('div'); cabecalho.className = 'portal-menu-heading';
        const titulo = document.createElement('span'); titulo.textContent = aba.querySelector('summary').textContent.trim();
        const quantidade = document.createElement('span'); quantidade.textContent = `${links.length} ${links.length === 1 ? 'página' : 'páginas'}`;
        cabecalho.append(titulo, quantidade); painel.prepend(cabecalho);
        links.forEach(link => {
            if (link.textContent.trim() === 'Ver todas') {
                link.classList.add('portal-menu-view-all');
                link.textContent = 'Ver todas';
                return;
            }
            const nome = document.createElement('strong'); nome.textContent = link.textContent;
            const descricao = document.createElement('span'); descricao.className = 'portal-menu-description';
            descricao.textContent = descricoes[link.getAttribute('href')] || 'Explore esta página do Portal do Esporte.';
            link.replaceChildren(nome, descricao);
        });
    });
    const fechar = (exceto) => abas.forEach(aba => { if (aba !== exceto) aba.open = false; });
    abas.forEach(aba => aba.addEventListener('toggle', () => { if (aba.open) fechar(aba); }));
    abas.forEach(aba => {
        aba.addEventListener('pointerenter', event => {
            if (event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
            fechar(aba); aba.open = true;
        });
        aba.addEventListener('pointerleave', event => {
            if (event.pointerType === 'mouse' && !aba.contains(document.activeElement)) aba.open = false;
        });
        aba.addEventListener('focusout', event => {
            if (!aba.contains(event.relatedTarget) && !aba.matches(':hover')) aba.open = false;
        });
        aba.querySelector('summary').addEventListener('keydown', event => {
            if (event.key !== 'ArrowDown') return;
            event.preventDefault(); fechar(aba); aba.open = true;
            aba.querySelector('.portal-header-dropdown a').focus();
        });
    });
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.portal-header-menu')) fechar();
        const link = event.target.closest('.portal-header-dropdown a');
        if (!link) return;
        fechar();
        // Mesma página com a mesma âncora não dispara hashchange; rola até a seção diretamente.
        const destino = new URL(link.href);
        if (destino.pathname === location.pathname && destino.hash && typeof scrollToSection === 'function') {
            event.preventDefault();
            scrollToSection(destino.hash.slice(1));
        }
    });
    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        const aberta = abas.find(aba => aba.open);
        if (aberta) { aberta.open = false; aberta.querySelector('summary').focus(); }
    });

    const sessionScript = document.createElement('script');
    sessionScript.src = '/js/portal-session.js';
    document.head.append(sessionScript);
})();
