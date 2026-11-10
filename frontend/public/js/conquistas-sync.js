const OFICIAL = /^https:\/\/www\.betim\.mg\.gov\.br\/portal\/noticias\/0\/3\/\d+\/[a-zA-Z0-9-]+\/?$/;
const canonica = url => url.replace(/\/$/, '');

export function validarAcervo(dados) {
    if (!dados || !Array.isArray(dados.conquistas)) throw new Error('Resposta inválida');
    return dados.conquistas.every(c => c && /^\d+$/.test(c.id) && typeof c.titulo === 'string' && c.titulo.length > 0
        && typeof c.resumo === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(c.publicadoEm) && typeof c.fonte === 'string' && OFICIAL.test(c.fonte)
        && Array.isArray(c.atletas) && c.atletas.every(id => typeof id === 'string'));
}

const ordemMarco = marco => {
    if (marco.publicadoEm) return marco.publicadoEm;
    const [mes, ano] = marco.data.split(' ');
    if (!ano) return `${mes}-01-01`;
    const indice = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'].indexOf(mes) + 1;
    return `${ano}-${String(indice || 1).padStart(2, '0')}-01`;
};
export function acrescentarMarcos(campeoes, fontes, conquistas) {
    for (const conquista of conquistas) {
        for (const id of conquista.atletas) {
            const perfil = campeoes[id];
            if (!perfil) continue;
            const indice = perfil.marcos.findIndex(m => canonica(fontes[m.fonte] || m.fonte) === canonica(conquista.fonte));
            if (indice >= 0 && !perfil.marcos[indice].publicadoEm) continue;
            const marco = { data: conquista.publicadoEm.split('-').reverse().join('/'),
                titulo: conquista.titulo, texto: 'Publicação oficial que menciona este atleta. Consulte a notícia para os resultados individuais.',
                fonte: conquista.fonte, publicadoEm: conquista.publicadoEm };
            if (indice >= 0) perfil.marcos[indice] = marco;
            else perfil.marcos.push(marco);
            perfil.marcos.sort((a, b) => ordemMarco(a).localeCompare(ordemMarco(b)));
        }
    }
}

function criarCard(conquista, vincularCard) {
    const card = document.createElement('article'); card.className = 'hall-card';
    const categoria = document.createElement('span'); categoria.className = 'hall-sport'; categoria.textContent = 'Conquista oficial';
    const titulo = document.createElement('h3'); titulo.textContent = conquista.titulo;
    const data = document.createElement('p'); data.className = 'hall-result';
    data.textContent = `Publicado em ${conquista.publicadoEm.split('-').reverse().join('/')}`;
    const resumo = document.createElement('p'); resumo.className = 'hall-description'; resumo.hidden = true; resumo.textContent = conquista.resumo;
    const fonte = document.createElement('a'); fonte.href = conquista.fonte; fonte.target = '_blank'; fonte.rel = 'noopener noreferrer';
    fonte.textContent = 'Fonte: Prefeitura de Betim ↗'; fonte.setAttribute('aria-label', `${conquista.titulo}: fonte oficial (abre em nova aba)`);
    card.append(categoria, titulo, data, resumo, fonte);
    vincularCard(card, { marcos: [{ data: conquista.publicadoEm.split('-').reverse().join('/'), titulo: 'Publicação do resultado', texto: conquista.resumo, fonte: conquista.fonte }] });
    return card;
}

export function relevancia(conquista) {
    const texto = `${conquista.titulo} ${conquista.resumo || ''}`.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
    const nivel = /\b(mundial|internacional|jogos olimpicos|jogos paralimpicos)\b/.test(texto) ? 4
        : /\b(brasileir\w*|naciona\w*)\b/.test(texto) ? 3
        : /\b(mineir\w*|estadua\w*|jemg)\b/.test(texto) ? 2 : 1;
    const resultado = /\b(recorde\w*)\b/.test(texto) ? 4 : /\b(ouro|campea|campeao|campeoes|titulo)\b/.test(texto) ? 3
        : /\b(prata)\b/.test(texto) ? 2 : /\b(bronze)\b/.test(texto) ? 1 : 0;
    return nivel * 10 + resultado;
}

export function selecionarPorAno(candidatos) {
    const anos = new Map();
    const unicos = new Map(candidatos.map(c => [c.id, c]));
    for (const candidato of unicos.values()) {
        const ano = candidato.publicadoEm.slice(0, 4);
        if (!anos.has(ano)) anos.set(ano, []);
        anos.get(ano).push(candidato);
    }
    for (const lista of anos.values()) lista.sort((a, b) => relevancia(b) - relevancia(a)
        || b.publicadoEm.localeCompare(a.publicadoEm) || a.id.localeCompare(b.id));
    return new Map([...anos].sort(([a], [b]) => b.localeCompare(a)).map(([ano, lista]) => [ano, lista.slice(0, 6)]));
}

export function iniciarAtualizacao({ campeoes, fontes, vincularCard }) {
    const painel = document.getElementById('conquistas-sync-status');
    if (!painel) return;
    const cards = new Map();
    const originais = [...document.querySelectorAll('.hall-card[data-campeao]')];
    const fontesOriginais = new Set(originais.map(card => canonica(card.querySelector('a').href)));
    const candidatosOriginais = originais.map(card => {
        const ano = card.closest('section').id.slice(-4);
        const data = card.querySelector('a').textContent.match(/(\d{2})\/(\d{2})\/(\d{4})/);
        return { id: 'perfil-' + card.dataset.campeao, titulo: card.querySelector('h3').textContent,
            resumo: card.querySelector('.hall-sport').textContent + ' ' + card.querySelector('.hall-result').textContent,
            publicadoEm: data ? data[3] + '-' + data[2] + '-' + data[1] : ano + '-01-01', elemento: card };
    });
    let ocupada = false, ultimoAcervo = '', pausada = false;
    function renderizar(conquistas) {
        const candidatas = conquistas.filter(c => !fontesOriginais.has(canonica(c.fonte)));
        const selecao = selecionarPorAno([...candidatosOriginais, ...candidatas]);
        for (const [ano, destaques] of selecao) {
            let secao = document.getElementById('conquistas-' + ano);
            if (!secao) {
                secao = document.createElement('section'); secao.id = 'conquistas-' + ano;
                secao.setAttribute('aria-labelledby', 'titulo-' + ano);
                const cabecalho = document.createElement('div'); cabecalho.className = 'hall-section-title';
                const titulo = document.createElement('h2'); titulo.id = 'titulo-' + ano; titulo.textContent = 'Conquistas de ' + ano;
                cabecalho.append(titulo);
                const grade = document.createElement('div'); grade.className = 'hall-grid';
                secao.append(cabecalho, grade);
            }
            const grade = secao.querySelector('.hall-grid');
            const elementos = destaques.map(conquista => {
                if (conquista.elemento) return conquista.elemento;
                const assinatura = JSON.stringify(conquista), anterior = cards.get(conquista.id);
                if (anterior?.assinatura === assinatura) return anterior.elemento;
                const elemento = criarCard(conquista, vincularCard);
                cards.set(conquista.id, { elemento, assinatura }); return elemento;
            });
            // Retira os destaques que perderam posição e mantém os botões já existentes.
            grade.replaceChildren(...elementos);
            document.querySelector('main.hall').insertBefore(secao, document.querySelector('.hall-footer'));
        }
    }
    renderizar([]);
    async function atualizar() {
        if (ocupada || pausada || document.hidden) return;
        ocupada = true;
        try {
            const resposta = await fetch('/api/conquistas', { cache: 'no-store', signal: AbortSignal.timeout(10000) });
            if (!resposta.ok) throw new Error('API indisponível');
            const dados = await resposta.json();
            if (!validarAcervo(dados)) throw new Error('Dados inválidos');
            const assinatura = JSON.stringify(dados.conquistas);
            if (assinatura !== ultimoAcervo) {
                acrescentarMarcos(campeoes, fontes, dados.conquistas.slice().reverse());
                renderizar(dados.conquistas);
                ultimoAcervo = assinatura;
            }
            painel.textContent = dados.atualizadoEm ? 'Seleção automática: até 6 destaques por ano. Última consulta: ' + new Date(dados.atualizadoEm).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
                : 'Aguardando a busca automática. Os destaques já cadastrados continuam disponíveis.';
        } catch {
            painel.textContent = 'Atualização automática indisponível no momento. As conquistas já carregadas continuam disponíveis.';
        } finally { ocupada = false; }
    }
    atualizar();
    const timer = setInterval(atualizar, 60000);
    document.addEventListener('visibilitychange', atualizar);
    window.addEventListener('pagehide', () => { pausada = true; clearInterval(timer); });
    window.addEventListener('pageshow', event => { if (event.persisted) { pausada = false; window.location.reload(); } });
}
