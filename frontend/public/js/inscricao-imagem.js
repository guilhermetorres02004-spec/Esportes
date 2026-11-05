(() => {
    const ficha = document.getElementById('formInscricao');
    const termo = document.getElementById('termoImagem');
    const concluir = document.getElementById('concluirInscricao');
    const resultado = document.getElementById('resultadoInscricao');
    const erro = document.getElementById('erroTermoImagem');
    const escolhas = [...termo.querySelectorAll('input[name="usoImagem"]')];
    let enviando = false;

    function bloquear(ativo) {
        enviando = ativo;
        termo.querySelectorAll('button, input').forEach(item => { item.disabled = ativo; });
        ficha.querySelector('button[type="submit"]').disabled = ativo;
        concluir.textContent = ativo ? 'Enviando…' : 'Concluir inscrição';
    }

    ficha.addEventListener('submit', evento => {
        if (evento.defaultPrevented) return;
        evento.preventDefault();
        if (enviando || !ficha.reportValidity()) return;
        erro.hidden = true;
        resultado.hidden = true;
        termo.showModal();
        termo.querySelector('.termo-corpo').focus();
    });

    termo.querySelectorAll('[data-fechar-termo]').forEach(botao => {
        botao.addEventListener('click', () => { if (!enviando) termo.close(); });
    });
    termo.addEventListener('cancel', evento => { if (enviando) evento.preventDefault(); });
    document.getElementById('limparEscolhaImagem').addEventListener('click', () => {
        escolhas.forEach(item => { item.checked = false; });
    });
    ficha.addEventListener('reset', () => {
        escolhas.forEach(item => { item.checked = false; });
        ficha.querySelectorAll('.is-invalid').forEach(item => item.classList.remove('is-invalid'));
        resultado.hidden = true;
    });

    concluir.addEventListener('click', async () => {
        if (enviando) return;
        if (!ficha.checkValidity()) {
            termo.close();
            ficha.reportValidity();
            return;
        }
        const dados = Object.fromEntries(new FormData(ficha));
        const escolha = escolhas.find(item => item.checked)?.value;
        const autorizaUsoImagem = escolha === 'sim' ? true : escolha === 'nao' ? false : null;
        const pedido = { nomeCompleto: dados.nome, cpf: dados.cpf || null,
            telefone: dados.telefone, modalidade: dados.modalidade, dadosFicha: dados,
            autorizaUsoImagem, termoImagemVersao: termo.dataset.versao };
        bloquear(true);
        erro.hidden = true;
        try {
            const resposta = await fetch('/api/inscricoes', {
                method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedido), signal: AbortSignal.timeout(20000),
            });
            if (!resposta.ok) {
                const falha = await resposta.json().catch(() => ({}));
                throw new Error(falha.mensagem || 'Não foi possível concluir a inscrição. Confira os dados e tente novamente.');
            }
            const inscricao = await resposta.json();
            if (!inscricao?.id) throw new Error('O servidor não confirmou a inscrição. Verifique antes de tentar novamente.');
            termo.close();
            ficha.reset();
            const decisao = autorizaUsoImagem === true ? 'autorizado' : autorizaUsoImagem === false ? 'não autorizado' : 'não informado';
            resultado.className = 'alert alert-success';
            resultado.textContent = `Inscrição concluída! Protocolo ${inscricao.id}. Uso de imagem: ${decisao}.`;
            resultado.hidden = false;
            resultado.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (falha) {
            erro.textContent = falha.name === 'TimeoutError' || falha.name === 'AbortError'
                ? 'O servidor demorou para responder. Confirme se a inscrição foi registrada antes de reenviar.'
                : falha.name === 'TypeError' ? 'Não foi possível conectar ao servidor. Seus dados foram mantidos.'
                : falha.message || 'Não foi possível enviar a inscrição. Seus dados foram mantidos.';
            erro.hidden = false;
        } finally {
            bloquear(false);
        }
    });
})();
