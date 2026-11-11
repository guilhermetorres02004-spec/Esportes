import { modalidadesEscola } from './catalog.js';

export function resolveModalidade(pathname) {
    const path = pathname.replace(/\/$/, '') || '/';
    return modalidadesEscola.find(item => item.href === path || '/' + item.legacyHref === path) || null;
}
export function normalizeModalidadeUrl(location, history) {
    const item = resolveModalidade(location.pathname);
    if (item && location.pathname !== item.href) history.replaceState(history.state, '', item.href + location.search + location.hash);
    return item;
}
