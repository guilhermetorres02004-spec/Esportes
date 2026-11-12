import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolveModalidade } from './src/modalidades/routes.js';

function modalityRoutes() {
  const configure = server => { server.middlewares.use((req, res, next) => {
    const url = new URL(req.url, 'http://localhost');
    if (/^\/comunicacao(?:\.html|\/)?$/.test(url.pathname)) {
      if (url.pathname !== '/comunicacao') { res.writeHead(302, { Location: '/comunicacao' + url.search }); res.end(); return; }
      req.url = '/index.html' + url.search; next(); return;
    }
    if (/^\/detalhes-evento(?:\.html|\/)?$/.test(url.pathname)) {
      if (url.pathname !== '/detalhes-evento') { res.writeHead(302, { Location: '/detalhes-evento' + url.search }); res.end(); return; }
      req.url = '/index.html' + url.search; next(); return;
    }
    if (/^\/agendamento-quadras(?:\.html|\/)?$/.test(url.pathname)) {
      if (url.pathname !== '/agendamento-quadras') { res.writeHead(302, { Location: '/agendamento-quadras' + url.search }); res.end(); return; }
      req.url = '/index.html' + url.search; next(); return;
    }
    if (/^\/agenda(?:\.html|\/)?$/.test(url.pathname)) {
      if (url.pathname !== '/agenda') { res.writeHead(302, { Location: '/agenda' + url.search }); res.end(); return; }
      req.url = '/index.html' + url.search; next(); return;
    }
    if (/^\/inscricao(?:\.html|\/)?$/i.test(url.pathname)) {
      if (url.pathname !== '/inscricao') { res.writeHead(302, { Location: '/inscricao' + url.search }); res.end(); return; }
      req.url = '/index.html' + url.search; next(); return;
    }
    if (/^\/administrativo(?:\.html|\/)?$/.test(url.pathname)) {
      if (url.pathname !== '/administrativo') { res.writeHead(302, { Location: '/administrativo' + url.search }); res.end(); return; }
      req.url = '/index.html' + url.search; next(); return;
    }
    if (/^\/(?:entrar\/?|login\.html)$/.test(url.pathname)) {
      if (url.pathname !== '/entrar') { res.writeHead(302, { Location: '/entrar' + url.search }); res.end(); return; }
      req.url = '/index.html' + url.search; next(); return;
    }
    if (/^\/conquistas(?:\.html|\/)?$/.test(url.pathname)) {
      if (url.pathname !== '/conquistas') { res.writeHead(302, { Location: '/conquistas' + url.search }); res.end(); return; }
      req.url = '/index.html' + url.search; next(); return;
    }
    if (url.pathname.replace(/\/$/, '') === '/esporte-nas-regionais') { req.url = '/index.html' + url.search; next(); return; }
    const modalidade = resolveModalidade(url.pathname);
    if (!modalidade) return next();
    if (url.pathname !== modalidade.href) {
      res.writeHead(302, { Location: modalidade.href + url.search }); res.end(); return;
    }
    req.url = '/index.html' + url.search;
    next();
  }); };
  return { name: 'modality-react-routes', configureServer: configure, configurePreviewServer: configure };
}

export default defineConfig({
  plugins: [modalityRoutes(), react()],
  server: {
    proxy: {
      "/api": "http://localhost:8080",
      "^/login$": "http://localhost:8080",
      "^/logout$": "http://localhost:8080",
    },
  },
});
