export async function consultarSessao({ fetcher = fetch, signal } = {}) {
    const response = await fetcher('/api/auth/me', { credentials: 'include', cache: 'no-store', signal });
    if (!response.ok) throw new Error('Sessão indisponível');
    const data = await response.json();
    if (!data || typeof data.username !== 'string' || !data.username.trim()) throw new Error('Sessão inválida');
    return data;
}
