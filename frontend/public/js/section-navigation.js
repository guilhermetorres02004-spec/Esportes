function scrollToSection(id) {
    const section = document.getElementById(id);
    if (!section) return;

    const page = section.closest('.page');
    if (page) {
        document.querySelectorAll('.page').forEach(item => {
            item.classList.toggle('active', item === page);
        });
    }
    if (typeof closeSidebar === 'function') closeSidebar();

    const headerHeight = document.querySelector('body > nav')?.getBoundingClientRect().height || 0;
    const availableHeight = Math.max(0, window.innerHeight - headerHeight - 32);
    const bounds = section.getBoundingClientRect();
    const spacing = headerHeight + 16 + Math.max(0, (availableHeight - bounds.height) / 2);
    window.scrollTo({ top: Math.max(0, window.scrollY + bounds.top - spacing), behavior: 'smooth' });

    if (window.location.hash !== `#${id}`) {
        window.history.pushState(null, '', `#${id}`);
    }
}

function scrollToCurrentSection() {
    if (window.location.hash) scrollToSection(window.location.hash.slice(1));
}

window.addEventListener('hashchange', scrollToCurrentSection);
window.addEventListener('load', scrollToCurrentSection);
