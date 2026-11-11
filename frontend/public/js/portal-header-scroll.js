(() => {
    const faixa = document.querySelector('.portal-header-topbar');
    const nav = document.getElementById('portal-site-header');
    const marcas = [...document.querySelectorAll('.portal-scroll-city, .portal-scroll-beta')];
    if (!faixa || !nav || marcas.length !== 2) return;
    function atualizar() {
        const compacto = faixa.getBoundingClientRect().bottom <= 0;
        nav.classList.toggle('portal-header-compact', compacto);
        for (const marca of marcas) marca.hidden = !compacto;
    }
    atualizar();
    if ('IntersectionObserver' in window) {
        const observer = new window.IntersectionObserver(atualizar, { threshold: [0, 1] });
        observer.observe(faixa);
    } else window.addEventListener('scroll', atualizar, { passive: true });
    window.addEventListener('resize', atualizar);
    window.addEventListener('pageshow', atualizar);
})();
