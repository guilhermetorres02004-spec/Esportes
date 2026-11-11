export function normalizeHomeUrl(location, history) {
    if (location.pathname === '/index.html') {
        history.replaceState(history.state, '', `/${location.search}${location.hash}`);
    }
}
