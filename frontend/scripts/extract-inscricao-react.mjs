import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const html = readFileSync(new URL('../Inscricao.html', import.meta.url), 'utf8');
const form = html.match(/<form id="formInscricao"[^>]*>([\s\S]*?)<\/form>/)[1];
const attrs = text => Object.fromEntries([...text.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, key, value]) => [key, value]));
const sections = [...form.matchAll(/<div class="section-title[^>]*>(.*?)<\/div>([\s\S]*?)(?=<div class="section-title|$)/g)].map(([, titulo, body]) => ({
    titulo: titulo.replace(/<[^>]+>/g, '').trim(), campos: [...body.matchAll(/<label class="form-label">([^<]+)<\/label>\s*(<(?:input|select|textarea)\b[\s\S]*?)(?=<\/div>)/g)].map(([, label, control]) => {
        const tag = control.match(/^<(\w+)/)[1], opening = control.match(/^<[^>]+>/)[0], props = attrs(opening);
        return { label, name: props.name, type: props.type || tag, required: /\brequired\b/.test(opening), placeholder: props.placeholder,
            maxLength: props.maxlength ? Number(props.maxlength) : undefined, inputMode: props.inputmode,
            options: tag === 'select' ? [...control.matchAll(/<option(?: value="([^"]*)")?>([^<]+)<\/option>/g)].map(([, value, text]) => ({ value: value ?? text, text })) : undefined };
    })
}));
const config = runInNewContext('(' + html.match(/const configModalidades = (\{[\s\S]*?\n    \});/)[1] + ')', {}, { timeout: 1000 });
for (const item of Object.values(config)) item.voltarHref = '/' + item.voltarHref.replace('.html', '');
const termo = html.match(/<div class="termo-corpo" tabindex="0">([\s\S]*?)<\/div>/)[1].replace(/class=/g, 'className=');
mkdirSync(new URL('../src/inscricao/', import.meta.url), { recursive: true });
// Extração histórica: não sobrescreve a ficha atual baseada na planilha Viva Esportes.
writeFileSync(new URL('../src/inscricao/legacy-form-data.json', import.meta.url), JSON.stringify({ sections, config }, null, 2) + '\n');
writeFileSync(new URL('../src/inscricao/LegacyTermText.jsx', import.meta.url), `import React from 'react';\nexport default function TermText() { return <>${termo}</>; }\n`);
console.log(`${sections.length} seções; ${sections.flatMap(s => s.campos).length} campos preservados.`);
