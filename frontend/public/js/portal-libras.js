(() => {
    const id = 'portal-vlibras-widget';
    const url = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    if (document.getElementById(id) || document.querySelector(`script[src="${url}"]`)) return;
    // VLibras 7 inicializa o botão e o tradutor automaticamente.
    const script = document.createElement('script');
    script.id = id;
    script.src = url;
    script.async = true;
    script.onerror = () => {
        if (document.getElementById('portal-libras-status')) return;
        const status = document.createElement('p');
        status.id = 'portal-libras-status';
        status.setAttribute('role', 'status');
        status.textContent = 'O tradutor de Libras não carregou. Verifique a conexão e recarregue a página para tentar novamente.';
        (document.querySelector('.portal-accessibility-bar') || document.body).append(status);
    };
    document.body.append(script);
})();
