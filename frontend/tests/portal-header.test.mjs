import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const codigo = readFileSync(new URL('../public/js/portal-header.js', import.meta.url), 'utf8');
test('menus antigos Eventos e Gestão começam ocultos e preservam destinos', () => {
    const { html } = preparar();
    assert.match(html, /id="portal-menu-eventos" hidden/);
    assert.match(html, /id="portal-menu-gestao" hidden/);
    for (const href of ['/administrativo', '/inscricao', '/agenda', '/comunicacao', '/almoxarifado.html', '/presenca.html'])
        assert.ok(html.includes(`href="${href}"`));
});
class Elemento {
    constructor(textContent = '') { this.textContent = textContent; this.handlers = {}; this.children = []; this.open = false; }
    addEventListener(tipo, handler) { this.handlers[tipo] = handler; }
    append(...itens) { this.children.push(...itens); }
    prepend(item) { this.children.unshift(item); }
    replaceChildren(...itens) { this.children = itens; }
    focus() { this.focado = true; }
}
function preparar(hover = true) {
    const menus = ['Portal', 'Modalidades', 'Programas', 'Portais'].map(nome => {
        const aba = new Elemento(), summary = new Elemento(nome), painel = new Elemento();
        const link = new Elemento('Notícias'); link.getAttribute = () => '/#noticias';
        painel.querySelectorAll = () => [link];
        aba.querySelector = seletor => seletor === 'summary' ? summary : seletor === '.portal-header-dropdown a' ? link : painel;
        aba.contains = item => item === summary || item === link;
        aba.matches = () => false;
        return { aba, summary, painel, link };
    });
    let html;
    const document = { activeElement: null, handlers: {}, getElementById: () => null,
        createElement: () => new Elemento(), head: new Elemento(), querySelectorAll: () => menus.map(m => m.aba),
        currentScript: { insertAdjacentHTML(_, conteudo) { html = conteudo; } },
        addEventListener(tipo, handler) { this.handlers[tipo] = handler; } };
    const window = { location: { pathname: '/index.html' }, matchMedia: () => ({ matches: hover }) };
    runInNewContext(codigo, { document, window });
    return { menus, document, html };
}

test('painéis recebem descrições e Entrar fica ao lado do título sem expor inscrição', () => {
    const t = preparar();
    for (const { painel, summary, link } of t.menus) {
        assert.equal(painel.children[0].className, 'portal-menu-heading');
        assert.equal(painel.children[0].children[0].textContent, summary.textContent);
        assert.equal(painel.children[0].children[1].textContent, '1 página');
        assert.equal(link.children[0].textContent, 'Notícias');
        assert.match(link.children[1].textContent, /Betim/);
    }
    assert.doesNotMatch(t.html, /class="portal-header-primary"/);
    const topbar = t.html.match(/<header class="portal-header-topbar">([\s\S]*?)<\/header>/)[1];
    assert.ok(topbar.indexOf('class="portal-header-title"') < topbar.indexOf('id="portal-session-login"'));
    assert.match(topbar, /<a id="portal-session-login" href="\/entrar" class="portal-header-action portal-header-login" data-temporariamente-desativado="false"><svg[^>]*aria-hidden="true"[^>]*>[\s\S]*?<\/svg>Entrar<\/a>/);
    assert.match(topbar, /<button id="sair" type="button" class="portal-header-action portal-header-login portal-header-logout" hidden>/);
    assert.equal((t.html.match(/id="sair"/g) || []).length, 1);
    assert.doesNotMatch(t.html.match(/<nav id="portal-site-header"[\s\S]*?<\/nav>/)[0], /id="sair"/);
    assert.doesNotMatch(t.html.match(/<nav id="portal-site-header"[\s\S]*?<\/nav>/)[0], /id="portal-session-login"/);
    assert.doesNotMatch(t.html, />Inscreva-se</);
    assert.doesNotMatch(t.html, /href="index\.html/);
    assert.match(t.html, /href="\/#noticias"/);
    assert.match(t.html, /<nav id="portal-site-header" tabindex="-1"/);
});

test('acesso Entrar usa cápsula branca e alvo mínimo de 44px no cabeçalho azul', () => {
    const css = readFileSync(new URL('../public/css/portal-base.css', import.meta.url), 'utf8');
    assert.match(css, /\.portal-standard \.portal-header-topbar \.portal-header-login \{[^}]*min-height: 44px;[^}]*background: white;[^}]*color: var\(--betim-blue-dark, #023568\)/);
    assert.match(css, /\.portal-standard \.portal-header-topbar \.portal-header-login svg \{ width: 16px; height: 16px; \}/);
    assert.match(css, /\.portal-standard \.portal-header-topbar \.portal-header-login:focus-visible \{ outline: 3px solid #facc15;/);
    assert.match(css, /\.portal-header-primary, \.portal-header-login \{ grid-row: 1; grid-column: 2; \}/);
});

test('mouse abre ao entrar, troca de menu e fecha ao sair sem foco interno', () => {
    const { menus } = preparar(); const [primeiro, segundo] = menus;
    primeiro.aba.handlers.pointerenter({ pointerType: 'mouse' });
    assert.equal(primeiro.aba.open, true);
    segundo.aba.handlers.pointerenter({ pointerType: 'mouse' });
    assert.equal(primeiro.aba.open, false); assert.equal(segundo.aba.open, true);
    segundo.aba.handlers.pointerleave({ pointerType: 'mouse' });
    assert.equal(segundo.aba.open, false);
});

test('touch não abre por hover e teclado permite abrir, focar e fechar com Escape', () => {
    const { menus, document } = preparar(false); const menu = menus[0];
    menu.aba.handlers.pointerenter({ pointerType: 'touch' }); assert.equal(menu.aba.open, false);
    menu.aba.handlers.pointerenter({ pointerType: 'mouse' }); assert.equal(menu.aba.open, false);
    menu.summary.handlers.keydown({ key: 'ArrowDown', preventDefault() {} });
    assert.equal(menu.aba.open, true); assert.equal(menu.link.focado, true);
    document.activeElement = menu.link;
    menu.aba.handlers.pointerleave({ pointerType: 'mouse' }); assert.equal(menu.aba.open, true);
    document.handlers.keydown({ key: 'Escape' });
    assert.equal(menu.aba.open, false); assert.equal(menu.summary.focado, true);
});

test('mudar foco para fora ou clicar fora fecha o menu', () => {
    const { menus, document } = preparar(); const menu = menus[0];
    menu.aba.open = true;
    menu.aba.handlers.focusout({ relatedTarget: null }); assert.equal(menu.aba.open, false);
    menu.aba.open = true;
    document.handlers.click({ target: { closest: () => null } }); assert.equal(menu.aba.open, false);
});

test('menu Modalidades inclui Futsal, Basquete e Ver todas ao final', () => {
    const { html } = preparar();
    const menu = html.match(/<summary>Modalidades<\/summary>[\s\S]*?<\/details>/)[0];
    assert.match(menu, /href="\/futsal"[^>]*>Futsal<\/a>/);
    assert.match(menu, /href="\/basquete"[^>]*>Basquete<\/a>/);
    assert.match(menu, /href="\/#escola"[^>]*>Ver todas<\/a>/);
    assert.ok(menu.indexOf('Ver todas') > menu.indexOf('Basquete'));
});
