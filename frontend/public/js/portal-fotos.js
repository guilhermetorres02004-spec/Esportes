import { fotoValida, fotosDaCategoria, creditoFoto } from './fotos-utils.js';

const imagens = [...document.querySelectorAll('[data-foto-categoria]')];
const galeria = document.querySelector('[data-fotos-galeria]');
const noticias = document.querySelector('.news-main-card');
const painel = document.getElementById('fotos-sync-status');
let consultando = false;
if (imagens.length || galeria || noticias || painel) {
    const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = '/css/portal-fotos.css'; document.head.append(css);
    atualizar();
    setInterval(() => { if (!document.hidden) atualizar(); }, 300000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) atualizar(); });
    if (painel) configurarPainel();
}

function carregarImagem(url) {
    return new Promise(resolve => {
        const imagem = new Image();
        const tempo = setTimeout(() => resolver(false), 8000);
        function resolver(ok) { clearTimeout(tempo); imagem.onload = imagem.onerror = null; resolve(ok); }
        imagem.onload = () => resolver(true); imagem.onerror = () => resolver(false); imagem.src = url;
    });
}
function aplicarImagem(img, foto) {
    if (img.getAttribute('src') === foto.url) return;
    img.src = foto.url;
    if (img.getAttribute('aria-hidden') !== 'true') img.alt = foto.titulo;
    img.title = `${foto.titulo} · ${creditoFoto(foto)}`;
    const credito = img.parentElement?.querySelector('.photo-credit');
    if (credito) { credito.href = foto.origem; credito.textContent = `${foto.titulo} · ${creditoFoto(foto)}`; }
}

async function atualizar() {
    if (consultando) return;
    consultando = true;
    try {
        const resposta = await fetch('/api/fotos', { cache: 'no-store', signal: AbortSignal.timeout(12000) });
        if (!resposta.ok) return;
        const dados = await resposta.json();
        if (!Array.isArray(dados.fotos)) return;
        const fotos = dados.fotos.filter(fotoValida), necessarias = new Map();
        const escolhas = imagens.map(img => {
            const opcoes = fotosDaCategoria(fotos, img.dataset.fotoCategoria);
            const foto = opcoes[Number(img.dataset.fotoIndice || 0) % opcoes.length];
            if (foto) necessarias.set(foto.url, foto);
            return { img, foto };
        });
        const extras = galeria ? fotosDaCategoria(fotos, galeria.dataset.fotosGaleria).slice(0, 3) : [];
        extras.forEach(f => necessarias.set(f.url, f));
        if (noticias) fotosDaCategoria(fotos, 'principal').slice(0, 4).forEach(f => necessarias.set(f.url, f));
        const resultados = await Promise.all([...necessarias.keys()].map(async url => [url, await carregarImagem(url)]));
        const disponiveis = new Set(resultados.filter(([, ok]) => ok).map(([url]) => url));
        escolhas.forEach(({ img, foto }) => { if (foto && disponiveis.has(foto.url)) aplicarImagem(img, foto); });
        if (galeria) renderizarGaleria(extras.filter(f => disponiveis.has(f.url)));
        if (noticias) renderizarNoticias(fotosDaCategoria(fotos, 'principal').filter(f => disponiveis.has(f.url)));
        mostrarFontes([...necessarias.values()].filter(f => disponiveis.has(f.url)));
        if (painel) await atualizarStatus();
    } catch { /* Preserva fotos e conteúdo atuais quando a API estiver indisponível. */ }
    finally { consultando = false; }
}

function linkFonte(foto) {
    const link = document.createElement('a'); link.href = foto.origem; link.target = '_blank'; link.rel = 'noopener noreferrer';
    link.textContent = `${foto.titulo} · ${creditoFoto(foto)}`; return link;
}
function renderizarGaleria(fotos) {
    if (!fotos.length) return;
    galeria.replaceChildren();
    for (const foto of fotos) {
        const figure = document.createElement('figure'), img = document.createElement('img');
        img.src = foto.url; img.alt = foto.titulo; img.loading = 'lazy';
        const link = linkFonte(foto); link.className = 'foto-oficial-legenda';
        figure.append(img, link); galeria.append(figure);
    }
}
function mostrarFontes(fotos) {
    if (!fotos.length) return;
    let detalhes = document.getElementById('fotos-fontes');
    if (!detalhes) {
        detalhes = document.createElement('details'); detalhes.id = 'fotos-fontes'; detalhes.className = 'fotos-fontes';
        (galeria?.parentElement || document.querySelector('main') || document.body).append(detalhes);
    }
    const resumo = document.createElement('summary'); resumo.textContent = 'Fotos oficiais · Prefeitura de Betim';
    const lista = document.createElement('ul');
    for (const foto of fotos) { const li = document.createElement('li'); li.append(linkFonte(foto)); lista.append(li); }
    detalhes.replaceChildren(resumo, lista);
}

function renderizarNoticias(fotos) {
    if (!fotos.length) return;
    const primeira = fotos[0];
    noticias.querySelectorAll('img').forEach(img => aplicarImagem(img, primeira));
    const titulo = noticias.querySelector('h4'), resumo = noticias.querySelector('p');
    if (titulo) titulo.textContent = primeira.titulo;
    if (resumo) resumo.textContent = 'Leia a notícia completa no portal oficial da Prefeitura de Betim.';
    const categoria = noticias.querySelector('span'); if (categoria) categoria.textContent = 'Esportes · Notícia oficial';
    let link = noticias.querySelector('a');
    if (!link) { link = linkFonte(primeira); noticias.querySelector('h4')?.after(link); }
    link.href = primeira.origem; link.target = '_blank'; link.rel = 'noopener noreferrer';
    link.textContent = `Leia a notícia · ${creditoFoto(primeira)}`;
    document.querySelectorAll('.news-side-card').forEach((card, i) => {
        const foto = fotos[i + 1]; if (!foto) return;
        const titulo = card.querySelector('h5'), categoria = card.querySelector('span');
        if (categoria) categoria.textContent = 'Esportes · Prefeitura de Betim';
        if (titulo) { const link = linkFonte(foto); link.textContent = foto.titulo; titulo.replaceChildren(link); }
    });
}

async function atualizarStatus() {
    const resposta = await fetch('/api/fotos/status', { cache: 'no-store', signal: AbortSignal.timeout(8000) });
    if (!resposta.ok) throw new Error('Status indisponível');
    const dados = await resposta.json();
    const data = dados.atualizadoEm ? new Date(dados.atualizadoEm).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : '';
    painel.textContent = dados.atualizando ? 'Consultando fontes oficiais…' : `${dados.aviso} ${data ? `Última consulta: ${data}.` : ''} ${dados.totalFotos} fotos no acervo.`;
    return dados;
}

async function configurarPainel() {
    const botao = document.getElementById('fotos-sync-atualizar');
    try {
        const resposta = await fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' });
        if (resposta.ok) botao.hidden = !(await resposta.json()).authorities?.some(a => a.authority === 'ROLE_ADMIN');
        await atualizarStatus();
    } catch { painel.textContent = 'Não foi possível consultar a atualização automática.'; }
    botao.addEventListener('click', async () => {
        botao.disabled = true;
        try {
            const resposta = await fetch('/api/fotos/atualizar', { method: 'POST', credentials: 'include', signal: AbortSignal.timeout(8000) });
            if (!resposta.ok) throw new Error(resposta.status === 401 || resposta.status === 403 ? 'Entre com uma conta administrativa.' : 'Não foi possível iniciar a atualização.');
            painel.textContent = 'Atualização iniciada. Consultando a Prefeitura…';
            let tentativas = 0;
            const checar = async () => {
                try { const dados = await atualizarStatus(); if (!dados.atualizando) { await atualizar(); return; } }
                catch { painel.textContent = 'Aguarde e consulte novamente.'; return; }
                if (++tentativas < 60) setTimeout(checar, 3000);
            };
            setTimeout(checar, 3000);
        } catch (erro) { painel.textContent = erro.message; }
        finally { botao.disabled = false; }
    });
}
