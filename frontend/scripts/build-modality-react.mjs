import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { modalidadesEscola } from '../src/modalidades/catalog.js';

// Migra o conteúdo local para uma árvore declarativa renderizada por React.
// Scripts e eventos HTML não são copiados; integrações têm componentes próprios.
const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', copy: '©' };
const decode = text => text.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (all, key) => key[0] === '#'
    ? String.fromCodePoint(key[1].toLowerCase() === 'x' ? parseInt(key.slice(2), 16) : Number(key.slice(1))) : entities[key] ?? all);
const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const result = {};
for (const item of modalidadesEscola) {
    const html = readFileSync(new URL(`../${item.legacyHref}`, import.meta.url), 'utf8');
    const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)[1]
        .replace(/<!--[^]*?-->/g, '').replace(/<(script|style)\b[^>]*>[^]*?<\/\1>/gi, '');
    const root = { children: [] }, stack = [root];
    for (const token of body.match(/<[^>]+>|[^<]+/g) || []) {
        if (token.startsWith('</')) { stack.pop(); continue; }
        if (!token.startsWith('<')) { stack.at(-1).children.push(decode(token)); continue; }
        const tag = token.match(/^<([\w-]+)/)?.[1].toLowerCase();
        if (!tag) continue;
        const props = {};
        const attributes = token.slice(tag.length + 1).replace(/\/?\s*>$/, '');
        for (const attr of attributes.matchAll(/([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s]+)))?/g)) {
            const name = attr[1].toLowerCase();
            if (name.startsWith('on') || name === 'style') continue;
            props[name] = decode(attr[2] ?? attr[3] ?? attr[4] ?? '');
        }
        if (props.href && !/^(https?:|#|mailto:|tel:)/.test(props.href)) {
            const [path, suffix = ''] = props.href.split(/(?=[?#])/);
            const destination = modalidadesEscola.find(m => m.legacyHref === path.replace(/^\//, ''));
            props.href = destination ? destination.href + suffix : '/' + props.href.replace(/^\//, '');
        }
        if (props.src && !/^(https?:|data:|\/)/.test(props.src)) props.src = '/' + props.src;
        if (tag === 'button' && /Inscricao\.html/.test(token)) props['data-inscricao'] = '/Inscricao.html';
        const node = { tag, props, children: [] };
        stack.at(-1).children.push(node);
        if (!voidTags.has(tag) && !token.endsWith('/>')) stack.push(node);
    }
    const mapMatch = html.match(/const nucleosFutebol = (\[[\s\S]*?\]);/);
    // Array literal local já presente no projeto; JSON é extraído sem executar scripts.
    const locations = mapMatch ? [...mapMatch[1].matchAll(/nome:\s*(['"])(.*?)\1,[\s\S]*?local:\s*(['"])(.*?)\3,[\s\S]*?endereco:\s*(['"])(.*?)\5,[\s\S]*?educador:\s*(['"])(.*?)\7,[\s\S]*?coords:\s*\[([^\]]+)\]/g)]
        .map(match => ({ nome: match[2], local: match[4], endereco: match[6], educador: match[8], coords: match[9].split(',').map(Number) })) : [];
    result[item.id] = { title: decode(html.match(/<title>(.*?)<\/title>/)[1]), nodes: root.children, locations };
}
mkdirSync(new URL('../src/modalidades/', import.meta.url), { recursive: true });
writeFileSync(new URL('../src/modalidades/content.json', import.meta.url), JSON.stringify(result, null, 2) + '\n');
console.log(`Conteúdo React preparado: ${Object.keys(result).length} modalidades.`);
