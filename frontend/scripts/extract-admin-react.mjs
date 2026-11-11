import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const html = readFileSync(new URL('../administrativo.html', import.meta.url), 'utf8');
let main = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/)[0];
main = main.replace(/class=/g, 'className=').replace(/<main className="[^"]*">/, '<main id="conteudo" tabIndex={-1} className="admin-page">')
    .replace(/data-documento="([^"]+)"/g, (_, id) => `data-documento="${id}" onClick={() => onDocument('${id}')}`)
    .replace(/<th\b/g, '<th scope="col"').replace(/<h2\b/, '<h1').replace(/<\/h2>/, '</h1>')
    .replace(/href="agendamento-quadras.html"/, 'href="/agendamento-quadras.html"');
mkdirSync(new URL('../src/admin/', import.meta.url), { recursive: true });
writeFileSync(new URL('../src/admin/AdminContent.jsx', import.meta.url), `import React from 'react';\n\n// Conteúdo preservado do administrativo.html; interações controladas por React.\nexport default function AdminContent({ onDocument }) {\n    return (${main});\n}\n`);
