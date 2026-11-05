export const CHAVE_CONVERSA = 'portal-suporte-v1';

export function linkSeguro(valor, origem) {
    try {
        const url = new URL(valor, origem);
        if (url.origin === origem && /\.(html|pdf)$/i.test(url.pathname)) return url.href;
        if (url.origin !== origem && url.protocol === 'https:') return url.href;
    } catch { /* Link inválido: não renderizar. */ }
    return null;
}

export function carregarConversa(storage) {
    try {
        const dados = JSON.parse(storage.getItem(CHAVE_CONVERSA));
        if (!dados || !Array.isArray(dados.mensagens)) return { mensagens: [], topico: '', aberto: false };
        const mensagens = dados.mensagens.filter(m => m && ['user', 'assistant'].includes(m.papel)
            && typeof m.texto === 'string' && m.texto.length <= 3000).slice(-20);
        return { mensagens, topico: typeof dados.topico === 'string' ? dados.topico.slice(0, 60) : '', aberto: dados.aberto === true };
    } catch { return { mensagens: [], topico: '', aberto: false }; }
}

export function guardarConversa(storage, estado) {
    try { storage.setItem(CHAVE_CONVERSA, JSON.stringify({ ...estado, mensagens: estado.mensagens.slice(-20) })); }
    catch { /* Navegação privada ou armazenamento indisponível: conversa segue na página. */ }
}

export async function perguntar(mensagem, estado, pagina, fetcher = fetch) {
    const resposta = await fetcher('/api/suporte/mensagens', {
        method: 'POST', credentials: 'include', signal: AbortSignal.timeout(26000),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem, pagina: pagina.slice(0, 200), topico: estado.topico,
            historico: estado.mensagens.slice(-8).map(({ papel, texto }) => ({ papel, texto })) }),
    });
    if (!resposta.ok) throw new Error(resposta.status === 429
        ? 'Muitas perguntas em sequência. Aguarde um minuto e tente novamente.'
        : 'Não foi possível consultar o suporte. Tente novamente em instantes.');
    const dados = await resposta.json();
    if (typeof dados.resposta !== 'string' || !dados.resposta.trim() || dados.resposta.length > 3000) throw new Error('Resposta indisponível. Tente novamente.');
    return dados;
}
