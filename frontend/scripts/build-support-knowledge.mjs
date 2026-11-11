import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { guiasSuporte } from './support-guides.mjs';
import { documentosAdministrativos } from '../public/js/admin-documentos-data.js';

const raiz = new URL('../', import.meta.url);
const documentos = [...guiasSuporte];
for (const [id, dado] of Object.entries(documentosAdministrativos)) {
    documentos.push({ id: `admin-${id}`, topico: 'administrativo', titulo: dado.titulo,
        url: dado.pdf || dado.fonte, palavras: `${dado.titulo} ${dado.categoria} ${dado.documento}`,
        texto: `${dado.documento}. Fonte: ${dado.origem}. Abrangência: ${dado.abrangencia}. ${dado.paragrafos.join(' ')}`,
        guia: false });
}
for (const pagina of ['futebol.html', 'volei.html', 'detalhe-modalidade.html', 'pilates.html']) {
    const html = readFileSync(new URL(pagina, raiz), 'utf8');
    const esporte = { 'futebol.html': 'Futebol Funcional Soccer', 'volei.html': 'Vôlei Voleibol',
        'detalhe-modalidade.html': 'Judô', 'pilates.html': 'Pilates' }[pagina];
    const secoes = html.replace(/<(script|style|nav|footer)\b[^>]*>[\s\S]*?<\/\1>/gi, '').split(/(?=<h[234]\b)/i);
    secoes.forEach((secao, i) => {
        const titulo = texto(secao.match(/<h[234]\b[^>]*>([\s\S]*?)<\/h[234]>/i)?.[1] || esporte);
        const conteudo = texto(secao.replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, ''));
        if (conteudo.length < 90 || titulo === 'Galeria' || /Inscrição Rápida/.test(titulo)) return;
        // Divide por parágrafos completos para manter horários e endereços juntos.
        const blocos = secao.match(/<div class="p-5\b[^>]*>[\s\S]*?<\/div>/gi);
        (blocos || [conteudo]).forEach((bloco, j) => documentos.push({ id: `pagina-${pagina}-${i}-${j}`,
            topico: pagina.replace('.html', ''), titulo: `${esporte} — ${titulo}`, url: pagina,
            palavras: `${esporte} ${titulo}`, texto: texto(bloco).slice(0, 4500), guia: false }));
    });
}

const secoesReact = new URL('src/home/Sections.jsx', raiz);
const inicio = readFileSync(existsSync(secoesReact) ? secoesReact : new URL('index.html', raiz), 'utf8');
for (const secao of inicio.matchAll(/<section\b[^>]*id="(atividades-esportivas|escola|viva-esporte)"[^>]*>([\s\S]*?)<\/section>/gi)) {
    const titulo = texto(secao[2].match(/<h3[^>]*>([\s\S]*?)<\/h3>/i)?.[1] || secao[1]);
    const conteudo = texto(secao[2]);
    documentos.push({ id: `inicio-${secao[1]}`, topico: secao[1], titulo,
        url: `index.html#${secao[1]}`, palavras: titulo,
        texto: `${conteudo} Esta seção apresenta informações gerais. Não publica aqui todas as faixas etárias, horários ou vagas; confirme esses detalhes com o núcleo responsável.`, guia: false });
}

function texto(html) {
    return html.replace(/<[^>]*>/g, ' ').replace(/\[cite:[^\]]*\]/g, '')
        .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
}
const base = JSON.stringify({ versao: 1, documentos }, null, 2) + '\n';
// O mesmo catálogo é servido no portal e incluído no JAR, sem depender do diretório de execução.
for (const destino of [new URL('public/docs/suporte/base.json', raiz),
    new URL('../backend/src/main/resources/suporte/base.json', raiz)]) {
    mkdirSync(fileURLToPath(new URL('.', destino)), { recursive: true });
    writeFileSync(destino, base);
}
console.log(`Base de suporte atualizada: ${documentos.length} referências do portal.`);
