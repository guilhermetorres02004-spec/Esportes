import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolveModalidade } from './src/modalidades/routes.js';

function modalityRoutes() {
  const configure = server => { server.middlewares.use((req, res, next) => {
    const url = new URL(req.url, 'http://localhost');
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
