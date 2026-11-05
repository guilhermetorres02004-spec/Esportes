import { documentosAdministrativos, dataConsultaDocumentos } from './admin-documentos-data.js';

const elemento = id => document.getElementById(id);
const janela = elemento('adminDocumento');
const resumo = elemento('adminDocumentoResumo');
const painelPdf = elemento('adminDocumentoPdf');
const leitor = elemento('adminDocumentoLeitor');
const modoResumo = elemento('adminModoResumo');
const modoPdf = elemento('adminModoPdf');
let documentoAtual = null;

function mudarModo(modo) {
    const pdf = modo === 'pdf' && Boolean(documentoAtual?.pdf);
    resumo.hidden = pdf;
    painelPdf.hidden = !pdf;
    modoResumo.setAttribute('aria-pressed', String(!pdf));
    modoPdf.setAttribute('aria-pressed', String(pdf));
}

function definirLink(id, dados) {
    const link = elemento(id);
    link.hidden = !dados;
    if (dados) {
        link.href = dados.href;
        link.textContent = dados.texto;
    } else {
        link.removeAttribute('href');
    }
}

function abrirDocumento(id) {
    const dados = documentosAdministrativos[id];
    if (!dados) return;
    documentoAtual = dados;
    elemento('adminDocumentoCategoria').textContent = dados.categoria;
    elemento('adminDocumentoTitulo').textContent = dados.titulo;
    elemento('adminDocumentoFonte').textContent = `${dados.documento} · ${dados.origem} · ${dados.abrangencia} · Consulta: ${dataConsultaDocumentos}`;
    resumo.replaceChildren();
    const titulo = document.createElement('h3');
    titulo.textContent = 'Resumo de consulta';
    resumo.appendChild(titulo);
    dados.paragrafos.forEach(texto => {
        const paragrafo = document.createElement('p');
        paragrafo.textContent = texto;
        resumo.appendChild(paragrafo);
    });
    elemento('adminDocumentoSite').href = dados.fonte;
    definirLink('adminDocumentoAcao', dados.acao);
    definirLink('adminDocumentoRelacionado', dados.relacionado);
    definirLink('adminDocumentoOriginal', dados.pdf ? { href: dados.pdf, texto: 'Abrir PDF em outra aba' } : null);
    modoPdf.hidden = !dados.pdf;
    leitor.src = dados.pdf ? `${dados.pdf}#page=${dados.pagina || 1}&toolbar=1&navpanes=0` : 'about:blank';
    leitor.title = dados.documento;
    mudarModo(dados.pdf ? 'pdf' : 'resumo');
    janela.showModal();
    elemento('adminDocumentoTitulo').focus({ preventScroll: true });
}

document.querySelectorAll('[data-documento]').forEach(botao => {
    botao.addEventListener('click', () => abrirDocumento(botao.dataset.documento));
});
janela.querySelectorAll('[data-fechar-documento]').forEach(botao => {
    botao.addEventListener('click', () => janela.close());
});
janela.addEventListener('click', evento => {
    if (evento.target === janela) janela.close();
});
janela.addEventListener('close', () => { leitor.src = 'about:blank'; });
modoResumo.addEventListener('click', () => mudarModo('resumo'));
modoPdf.addEventListener('click', () => mudarModo('pdf'));
