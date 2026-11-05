export function prepararDom() {
    const elementos = new Map();
    class Elemento {
        constructor(tag) { this.tag = tag; this.children = []; this.handlers = {}; this.attributes = {}; this.hidden = false; this.value = ''; this.textContent = ''; }
        addEventListener(tipo, handler) { this.handlers[tipo] = handler; }
        setAttribute(k, v) { this.attributes[k] = v; }
        append(...filhos) { filhos.forEach(f => { this.children.push(f); f.parent = this; }); }
        replaceChildren() { this.children = []; }
        remove() { this.parent.children = this.parent.children.filter(f => f !== this); }
        focus() { this.focused = true; }
        get scrollHeight() { return this.children.length * 100; }
        querySelector(seletor) { return elementos.get(seletor); }
        requestSubmit() { return elementos.get('form').handlers.submit({ preventDefault() {} }); }
    }
    for (const seletor of ['.suporte-painel', '.suporte-mensagens', '.suporte-abrir', 'input', '[type="submit"]',
        '.suporte-status', '.suporte-sugestoes', '[data-fechar]', '[data-limpar]', 'form']) elementos.set(seletor, new Elemento('div'));
    elementos.get('.suporte-painel').hidden = true;
    const body = new Elemento('body');
    const document = { body, handlers: {}, createElement: tag => new Elemento(tag),
        getElementById: () => null, addEventListener(tipo, handler) { this.handlers[tipo] = handler; } };
    return { document, get: seletor => elementos.get(seletor) };
}
