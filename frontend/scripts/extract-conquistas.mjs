import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const html = readFileSync(new URL('../conquistas.html', import.meta.url), 'utf8');
const cards = [...html.matchAll(/<article class="hall-card" data-campeao="([^"]+)">([\s\S]*?)<\/article>/g)].map(([, atleta, body]) => {
    const text = pattern => body.match(pattern)[1];
    const date = body.match(/Prefeitura · (\d{2})\/(\d{2})\/(\d{4})/);
    return { id: 'perfil-' + atleta, atleta, titulo: text(/<h3>(.*?)<\/h3>/), categoria: text(/class="hall-sport">(.*?)<\/span>/),
        resultado: text(/class="hall-result">(.*?)<\/p>/), resumo: text(/class="hall-description" hidden>(.*?)<\/p>/),
        fonte: text(/<a href="([^"]+)"/), publicadoEm: `${date[3]}-${date[2]}-${date[1]}` };
});
mkdirSync(new URL('../src/conquistas/', import.meta.url), { recursive: true });
writeFileSync(new URL('../src/conquistas/cards.json', import.meta.url), JSON.stringify(cards, null, 2) + '\n');
