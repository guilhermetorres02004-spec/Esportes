# Modalidades em React

As 22 modalidades são renderizadas por `frontend/src/modalidades/ModalidadePage.jsx`.
O catálogo e o resolvedor de rotas ficam em `src/modalidades/catalog.js` e `routes.js`.

- Cards e menu usam URLs como `/futebol`, `/volei`, `/judo`, `/futsal` e `/basquete`.
- Os 22 endereços antigos `.html` redirecionam para a modalidade correspondente.
- Parâmetros e fragmentos são preservados na normalização. As demais páginas do portal continuam com suas rotas existentes.
- O acesso direto e a atualização da página funcionam no Vite e no build.

## Conteúdo e componentes

O script `scripts/build-modality-react.mjs` converte o conteúdo local existente em `src/modalidades/content.json` antes de iniciar o servidor ou gerar o build. Os arquivos HTML de origem são mantidos durante a transição como fonte editorial e para evitar perda de conteúdo; não são servidos como as páginas finais das modalidades.

O React renderiza a árvore com elementos próprios, sem iframe ou `dangerouslySetInnerHTML`. Scripts HTML e eventos embutidos não são executados. Galerias e fotos usam o provider React de fotos oficiais; o mapa do Futebol tem um componente com os oito locais preservados e limpeza ao desmontar. A ficha de inscrição continua com os destinos existentes. Links de participação oficial permanecem em nova aba.

O cabeçalho compartilhado permanece integrado ao shell do portal. A migração não substitui sua implementação nem altera APIs, banco ou autenticação.

## Publicação e compatibilidade

`copy-html-pages.mjs` prepara a entrada React para cada rota e páginas de compatibilidade para links antigos. O Nginx contém os redirecionamentos permanentes e resolve as entradas das rotas sem exigir `.html` na URL. O middleware do Vite cobre desenvolvimento e preview.

## Verificação em 11/11/2026

- Build aprovado e 89 testes aprovados.
- Renderização React das 22 páginas, títulos e conteúdo específico verificados.
- Rotas antigas, parâmetros, fragmentos e oito locais do mapa do Futebol testados.
- HTTP 200 nas 22 rotas e redirecionamento das 22 URLs antigas confirmados em desenvolvimento e preview.
- Nginx configurado, mas não executado nesta sessão. Conferência visual e interação real em navegador pendentes por indisponibilidade do navegador.
