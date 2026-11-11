import { parse } from '@babel/parser';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const base = 'https://regionais.betim.digital';
const regionais = [['centro', 'Centro'], ['norte', 'Norte'], ['alterosas', 'Alterosas'], ['ptb', 'PTB'],
    ['icaivera', 'Icaivera'], ['citrolandia', 'Citrolândia'], ['imbirucu', 'Imbiruçu'],
    ['teresopolis', 'Teresópolis'], ['petrovale', 'Petrovale'], ['vianopolis', 'Vianópolis']];
async function get(url) { const response = await fetch(url, { signal: AbortSignal.timeout(15000) }); if (!response.ok) throw new Error(`${url}: ${response.status}`); return response; }
// Somente análise sintática de literais públicos: nunca executa JavaScript remoto.
function literal(node) {
    if (['StringLiteral', 'NumericLiteral', 'BooleanLiteral'].includes(node?.type)) return node.value;
    if (node?.type === 'NullLiteral') return null;
    if (node?.type === 'ArrayExpression') return node.elements.map(literal);
    if (node?.type === 'ObjectExpression') return Object.fromEntries(node.properties.filter(p => p.type === 'ObjectProperty').map(p => [p.key.name ?? p.key.value, literal(p.value)]));
    return null;
}
const pages = await Promise.all(regionais.map(async ([id, nome]) => ({ id, nome, fonte: `${base}/regional/${id}/esporte`, html: await (await get(`${base}/regional/${id}/esporte`)).text() })));
const urls = [...pages[0].html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m => base + m[1]);
const chunks = await Promise.all(urls.map(async url => ({ url, text: await (await get(url)).text() })));
const chunk = chunks.find(item => item.text.includes('2537:'));
if (!chunk) throw new Error('Catálogo esportivo oficial não encontrado; nenhuma saída alterada.');
let categorias;
function visit(node) {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'ArrayExpression') {
        const value = literal(node);
        if (value?.[0]?.id === 'parques' && value[0].itens) categorias = value;
    }
    for (const value of Object.values(node)) if (Array.isArray(value)) value.forEach(visit); else if (value && typeof value === 'object') visit(value);
}
visit(parse(chunk.text));
if (!categorias) throw new Error('Formato do catálogo mudou; nenhuma saída alterada.');
const decode = s => s.replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"');
const equipamentos = [], programas = [];
for (const categoria of categorias) for (const item of categoria.itens) {
    const regionaisIds = pages.filter(page => [...page.html.matchAll(/<h4\b[^>]*>(.*?)<\/h4>/g)].some(m => decode(m[1]) === item.titulo)).map(p => p.id);
    if (!regionaisIds.length) continue;
    const id = createHash('sha256').update(categoria.id + item.titulo).digest('hex').slice(0, 12);
    const record = { id, nome: item.titulo, regionais: regionaisIds, bairro: item.bairro || null,
        endereco: item.endereco || null, tipo: categoria.titulo, descricao: item.tipo || categoria.descricao || null,
        modalidades: [], programas: [], horarios: null, acessibilidade: null, coordenadas: null,
        foto: null, fonte: pages.find(page => page.id === regionaisIds[0]).fonte };
    if (categoria.id === 'programas') { programas.push({ ...record, orientacao: 'Consulte o canal oficial para confirmar público, locais e condições de participação.' }); continue; }
    // Apenas modalidades explicitamente mencionadas na descrição oficial do próprio local.
    for (const [nome, pattern] of [['Futebol', /futebol/i], ['Futsal', /futsal/i], ['Vôlei', /volei|vôlei/i], ['Atletismo', /atletismo/i], ['Skate', /skate/i], ['Caminhada', /caminhada|jogging/i], ['Ginástica artística', /ginastica artistica/i], ['Taekwondo', /taekwondo/i]])
        if (pattern.test([item.titulo, item.tipo].filter(Boolean).join(' '))) record.modalidades.push(nome);
    if (/viva o esporte/i.test(item.titulo)) record.programas.push('Viva o Esporte');
    if (item.imagem && item.imagem.startsWith('/regionais/')) {
        try {
            const image = await get(new URL(item.imagem, base));
            if (image.headers.get('content-type')?.startsWith('image/')) {
                const bytes = Buffer.from(await image.arrayBuffer());
                if (bytes.length < 10_000_000) {
                    const extension = image.headers.get('content-type').includes('png') ? 'png' : image.headers.get('content-type').includes('webp') ? 'webp' : 'jpg';
                    mkdirSync(new URL('../public/Imagens/regionais/', import.meta.url), { recursive: true });
                    record.foto = `/Imagens/regionais/${id}.${extension}`;
                    writeFileSync(new URL(`../public${record.foto}`, import.meta.url), bytes);
                }
            }
        } catch { /* Foto não confirmada permanece ausente, sem imagens de exemplo. */ }
    }
    equipamentos.push(record);
}
const data = { versao: 1, atualizadoEm: new Date().toISOString(), fonteCatalogo: chunk.url,
    limitesGeojson: null, regionais: pages.map(({ id, nome, fonte }) => ({ id, nome, fonte })), equipamentos, programas, eventos: [] };
for (const path of ['../public/data/regionais.json', '../../backend/src/main/resources/regionais/catalogo.json']) {
    const url = new URL(path, import.meta.url); mkdirSync(new URL('.', url), { recursive: true }); writeFileSync(url, JSON.stringify(data, null, 2) + '\n');
}
console.log(JSON.stringify({ regionais: data.regionais.length, equipamentos: equipamentos.length, fotos: equipamentos.filter(e => e.foto).length, programas: programas.length, camposOriginais: Object.keys(categorias[0].itens[0]) }));
