import { carregarConversa, guardarConversa, perguntar, linkSeguro, CHAVE_CONVERSA } from './suporte-client.js';

if (!document.getElementById('portal-suporte')) iniciarSuporte();

function iniciarSuporte() {
    let storage;
    try { storage = window.sessionStorage; } catch { storage = null; }
    const estado = carregarConversa(storage);
    const root = document.createElement('div');
    root.id = 'portal-suporte';
    root.innerHTML = `
        <section class="suporte-painel" id="suporte-painel" aria-labelledby="suporte-titulo" hidden>
            <header class="suporte-cabecalho"><div><strong id="suporte-titulo">Suporte do portal</strong>
                <span>Assistente virtual</span></div><button type="button" data-fechar aria-label="Fechar suporte">×</button></header>
            <div class="suporte-mensagens" id="suporte-mensagens" role="log" aria-live="polite" aria-relevant="additions" tabindex="0" aria-label="Conversa do suporte"></div>
            <div class="suporte-sugestoes" aria-label="Perguntas sugeridas"></div>
            <p class="suporte-status" role="status"></p>
            <form class="suporte-form"><label class="suporte-label" for="suporte-pergunta">Sua pergunta</label>
                <div><input id="suporte-pergunta" type="text" maxlength="1200" placeholder="Como posso ajudar?" autocomplete="off" required>
                <button type="submit" aria-label="Enviar pergunta">➤</button></div></form>
            <footer class="suporte-rodape"><span>Evite enviar CPF, senhas ou dados médicos.</span><button type="button" data-limpar>Limpar conversa</button></footer>
        </section>
        <button class="suporte-abrir" type="button" aria-controls="suporte-painel" aria-expanded="false"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 11a8 8 0 0 1-8 8H5l-4 3V11a10 10 0 0 1 20 0Z"/><path d="M7 10h10M7 14h6"/></svg><span>Suporte</span></button>`;
    document.body.append(root);
    const get = seletor => root.querySelector(seletor);
    const painel = get('.suporte-painel'), mensagens = get('.suporte-mensagens');
    const abrir = get('.suporte-abrir'), input = get('input'), enviar = get('[type="submit"]');
    const status = get('.suporte-status');
    let ocupado = false;

    function adicionar(turno) {
        const bloco = document.createElement('article');
        bloco.className = `suporte-balao suporte-${turno.papel === 'user' ? 'user' : 'assistant'}`;
        const autor = document.createElement('strong');
        autor.className = 'suporte-autor';
        autor.textContent = turno.papel === 'user' ? 'Você' : 'Assistente do portal';
        const texto = document.createElement('p');
        texto.textContent = turno.texto;
        bloco.append(autor, texto);
        for (const fonte of (Array.isArray(turno.fontes) ? turno.fontes : []).slice(0, 5)) {
            const href = fonte && linkSeguro(fonte.url, window.location.origin);
            if (!href) continue;
            const link = document.createElement('a');
            link.href = href; link.textContent = `Consultar: ${fonte.titulo}`;
            if (new URL(href).origin !== window.location.origin || /\.pdf(?:#|$)/i.test(href)) {
                link.target = '_blank'; link.rel = 'noopener noreferrer';
            }
            bloco.append(link);
        }
        if (turno.papel === 'assistant' && turno.modo) {
            const modo = document.createElement('small');
            modo.textContent = turno.modo === 'ia' ? 'IA com referências do portal' : 'Consulta às informações do portal';
            bloco.append(modo);
        }
        mensagens.append(bloco);
        mensagens.scrollTop = mensagens.scrollHeight;
        return bloco;
    }

    function sugestoes(itens = ['Como me inscrever?', 'Como reservar uma quadra?', 'Onde ficam os arquivos?']) {
        const caixa = get('.suporte-sugestoes');
        caixa.replaceChildren();
        for (const pergunta of itens.slice(0, 3)) {
            if (typeof pergunta !== 'string') continue;
            const botao = document.createElement('button');
            botao.type = 'button'; botao.textContent = pergunta;
            botao.addEventListener('click', () => { if (!ocupado) { input.value = pergunta; get('form').requestSubmit(); } });
            caixa.append(botao);
        }
    }

    function setAberto(valor, foco = true) {
        painel.hidden = !valor;
        abrir.setAttribute('aria-expanded', String(valor));
        estado.aberto = valor;
        guardarConversa(storage, estado);
        if (valor) {
            mensagens.scrollTop = mensagens.scrollHeight;
            if (foco) input.focus();
        } else if (foco) abrir.focus();
    }
    abrir.addEventListener('click', () => setAberto(painel.hidden));
    get('[data-fechar]').addEventListener('click', () => setAberto(false));
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !painel.hidden) { event.preventDefault(); setAberto(false); }
    });

    get('form').addEventListener('submit', async event => {
        event.preventDefault();
        const pergunta = input.value.trim();
        if (ocupado || !pergunta || pergunta.length > 1200) return;
        ocupado = true; enviar.disabled = true;
        get('[data-limpar]').disabled = true;
        const tentativa = adicionar({ papel: 'user', texto: pergunta });
        input.value = ''; status.textContent = 'Consultando as informações do portal…';
        mensagens.setAttribute('aria-busy', 'true');
        try {
            const dados = await perguntar(pergunta, estado, window.location.pathname);
            const turno = { papel: 'assistant', texto: dados.resposta, fontes: dados.fontes, modo: dados.modo };
            estado.mensagens.push({ papel: 'user', texto: pergunta }, turno);
            estado.mensagens = estado.mensagens.slice(-20); estado.topico = dados.topico || '';
            guardarConversa(storage, estado);
            adicionar(turno); sugestoes(dados.sugestoes || undefined);
            status.textContent = '';
        } catch (erro) {
            tentativa.remove();
            status.textContent = erro.name === 'TimeoutError' ? 'O suporte demorou a responder. Tente novamente.'
                : erro.name === 'TypeError' ? 'Não foi possível conectar ao suporte. Verifique sua conexão e tente novamente.' : erro.message;
            if (!input.value) input.value = pergunta;
        } finally {
            ocupado = false; enviar.disabled = false; get('[data-limpar]').disabled = false;
            mensagens.setAttribute('aria-busy', 'false');
            if (!painel.hidden) input.focus();
        }
    });

    function boasVindas() {
        adicionar({ papel: 'assistant', texto: 'Olá! Posso ajudar com modalidades, inscrição, quadras, agenda, documentos e acesso ao portal. Qual é sua dúvida?' });
    }
    get('[data-limpar]').addEventListener('click', () => {
        estado.mensagens = []; estado.topico = ''; input.value = ''; status.textContent = '';
        try { storage?.removeItem(CHAVE_CONVERSA); } catch { /* Armazenamento indisponível. */ }
        mensagens.replaceChildren(); boasVindas(); sugestoes(); guardarConversa(storage, estado); input.focus();
    });
    boasVindas();
    estado.mensagens.forEach(adicionar);
    sugestoes();
    setAberto(estado.aberto, false);
}
