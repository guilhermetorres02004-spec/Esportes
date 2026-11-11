export function destinoDoLogin() {
    return '/';
}

export async function autenticar(username, password, { fetcher = fetch, signal } = {}) {
    const response = await fetcher('/login', {
        method: 'POST', credentials: 'include', signal,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username, password }),
    });
    if (response.status === 401) throw new Error('Usuário ou senha inválidos.');
    if (!response.ok) throw new Error('Não foi possível acessar o servidor. Tente novamente em instantes.');
}
