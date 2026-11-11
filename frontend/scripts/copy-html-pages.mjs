import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { modalidadesEscola } from '../src/modalidades/catalog.js';
import { extname, join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");

if (!existsSync(dist)) {
  mkdirSync(dist, { recursive: true });
}
mkdirSync(join(dist, 'esporte-nas-regionais'), { recursive: true });
copyFileSync(join(dist, 'index.html'), join(dist, 'esporte-nas-regionais', 'index.html'));

for (const modalidade of modalidadesEscola) {
  const directory = join(dist, modalidade.href.slice(1));
  mkdirSync(directory, { recursive: true });
  copyFileSync(join(dist, 'index.html'), join(directory, 'index.html'));
  writeFileSync(join(dist, modalidade.legacyHref), `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${modalidade.href}"><title>Redirecionando</title></head><body><a href="${modalidade.href}">Abrir modalidade</a><script>location.replace(${JSON.stringify(modalidade.href)}+location.search+location.hash)</script></body></html>`);
}

for (const file of readdirSync(root)) {
  if (extname(file).toLowerCase() === ".html" && file.toLowerCase() !== "index.html" && !modalidadesEscola.some(item => item.legacyHref === file)) {
    copyFileSync(join(root, file), join(dist, file));
  }
}
