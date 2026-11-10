import { campeoes, fontes } from './conquistas-dados.js';
import { iniciarAtualizacao } from './conquistas-sync.js';

const dialog = document.getElementById('campeao-dialog');
const campo = nome => document.getElementById(`campeao-${nome}`);
let origem;
let overflowAnterior;

function criarMarco(marco) {
    const item = document.createElement('li');
    const data = document.createElement('span');
    data.className = 'champion-date';
    data.textContent = marco.data;
    const conteudo = document.createElement('div');
    const titulo = document.createElement('h4');
    titulo.textContent = marco.titulo;
    const texto = document.createElement('p');
    texto.textContent = marco.texto;
    const fonte = document.createElement('a');
    fonte.href = fontes[marco.fonte] || marco.fonte;
    fonte.target = '_blank';
    fonte.rel = 'noopener noreferrer';
    fonte.textContent = 'Fonte: Prefeitura de Betim ↗';
    fonte.setAttribute('aria-label', `Fonte de ${marco.titulo} (abre em nova aba)`);
    conteudo.append(titulo);
    if (marco.texto) conteudo.append(texto);
    conteudo.append(fonte);
    item.append(data, conteudo);
    return item;
}

function abrirPerfil(card, perfil, botao) {
    if (dialog.open) return;
    origem = botao;
    campo('nome').textContent = card.querySelector('h3').textContent;
    campo('timeline').replaceChildren(...perfil.marcos.map(criarMarco));
    overflowAnterior = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    dialog.scrollTop = 0;
}

function vincularCard(card, perfil) {
    if (!perfil) return;
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'hall-profile-button';
    botao.textContent = 'Conheça a trajetória →';
    botao.setAttribute('aria-label', `Ver trajetória de ${card.querySelector('h3').textContent}`);
    botao.setAttribute('aria-haspopup', 'dialog');
    botao.setAttribute('aria-controls', dialog.id);
    botao.addEventListener('click', () => abrirPerfil(card, perfil, botao));
    card.append(botao);
}
document.querySelectorAll('.hall-card[data-campeao]').forEach(card => vincularCard(card, campeoes[card.dataset.campeao]));

dialog.querySelector('.champion-close').addEventListener('click', () => dialog.close());
let iniciouNoFundo = false;
const foraDaJanela = event => {
    const rect = dialog.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
};
dialog.addEventListener('pointerdown', event => { iniciouNoFundo = event.target === dialog && foraDaJanela(event); });
dialog.addEventListener('click', event => {
    if (iniciouNoFundo && event.target === dialog && foraDaJanela(event)) dialog.close();
    iniciouNoFundo = false;
});
dialog.addEventListener('close', () => {
    document.body.style.overflow = overflowAnterior;
    origem?.focus({ preventScroll: true });
});

iniciarAtualizacao({ campeoes, fontes, vincularCard });
