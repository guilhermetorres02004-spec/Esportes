import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { modalidadesEscola } from '../src/modalidades/catalog.js';
import { extname, join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");

if (!existsSync(dist)) {
  mkdirSync(dist, { recursive: true });
}
mkdirSync(join(dist, 'entrar'), { recursive: true });
mkdirSync(join(dist, 'inscricao'), { recursive: true });
copyFileSync(join(dist, 'index.html'), join(dist, 'inscricao', 'index.html'));
for (const legacy of ['Inscricao.html', 'inscricao.html']) writeFileSync(join(dist, legacy), '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/inscricao"><title>Inscrição</title><a href="/inscricao">Abrir inscrição</a><script>location.replace("/inscricao"+location.search+location.hash)</script></html>');
mkdirSync(join(dist, 'administrativo'), { recursive: true });
copyFileSync(join(dist, 'index.html'), join(dist, 'administrativo', 'index.html'));
writeFileSync(join(dist, 'administrativo.html'), '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/administrativo"><title>Administrativo</title><a href="/administrativo">Abrir administrativo</a><script>location.replace("/administrativo"+location.search+location.hash)</script></html>');
copyFileSync(join(dist, 'index.html'), join(dist, 'entrar', 'index.html'));
writeFileSync(join(dist, 'login.html'), '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/entrar"><title>Entrar</title><a href="/entrar">Abrir login</a><script>location.replace("/entrar"+location.search+location.hash)</script></html>');
mkdirSync(join(dist, 'esporte-nas-regionais'), { recursive: true });
copyFileSync(join(dist, 'index.html'), join(dist, 'esporte-nas-regionais', 'index.html'));
mkdirSync(join(dist, 'conquistas'), { recursive: true });
copyFileSync(join(dist, 'index.html'), join(dist, 'conquistas', 'index.html'));
writeFileSync(join(dist, 'conquistas.html'), '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/conquistas"><title>Conquistas</title><a href="/conquistas">Abrir conquistas</a><script>location.replace("/conquistas"+location.search+location.hash)</script></html>');

for (const modalidade of modalidadesEscola) {
  const directory = join(dist, modalidade.href.slice(1));
  mkdirSync(directory, { recursive: true });
  copyFileSync(join(dist, 'index.html'), join(directory, 'index.html'));
  writeFileSync(join(dist, modalidade.legacyHref), `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${modalidade.href}"><title>Redirecionando</title></head><body><a href="${modalidade.href}">Abrir modalidade</a><script>location.replace(${JSON.stringify(modalidade.href)}+location.search+location.hash)</script></body></html>`);
}

for (const file of readdirSync(root)) {
  if (extname(file).toLowerCase() === ".html" && !['index.html', 'conquistas.html', 'login.html', 'administrativo.html', 'inscricao.html'].includes(file.toLowerCase()) && !modalidadesEscola.some(item => item.legacyHref === file)) {
    copyFileSync(join(root, file), join(dist, file));
  }
}
