# Base visual do Portal do Esporte

## Referências e escopo

Base local inspirada nos portais do monorepo Betim, principalmente Saúde,
Educação e Cidadão e no contrato de `packages/theme` e `packages/ui`.
O projeto continua em HTML/Vite e Tailwind 3. Os pacotes privados dos
portais usam Next.js/Tailwind 4: esta base adapta os padrões disponíveis,
sem afirmar equivalência integral ao Design System publicado.

## Tokens

Arquivo: `public/css/portal-base.css`, carregado após os estilos de cada página.
Aplicação delimitada pela classe `portal-standard` no body.

- Cor principal preservada: azul #1e3a8a; azul escuro #172554.
- Destaque preservado: amarelo #facc15.
- Textos: Karla, 16 px, entrelinha 1,6. Títulos: Montserrat, peso 700.
- Fontes via Google Fonts, com fallback Arial/sans-serif se indisponíveis.
- Conteúdo: até 1280 px; seções com 64 px de separação, 40 px no celular.
- Cards: raio de 16 px, padding de 24 px, borda de 1 px, sombra discreta.
- Campos e botões: raio de 12 px; foco visível; movimento reduzido respeitado.

Os cards de modalidades usam azul e amarelo para evitar identidades diferentes
por modalidade. Cores semânticas de erro, sucesso e aviso continuam válidas.
Imagens, conteúdos, formulários, IDs e scripts existentes são preservados.

## Reutilização

Em páginas novas, carregar `/css/tailwind.css`, `/css/portal-header.css` e
`/css/portal-base.css`, nesta ordem, e usar `class="portal-standard"` no body.
Use `portal-card` para cards novos e os tokens `--portal-*` em estilos próprios.
Evite novas cores literais e títulos inteiramente em maiúsculas/itálico.

## Validação

Rodar `npm run build` e `node --test tests/*.test.mjs` com Node disponível.
Conferir home, modalidade, downloads, agenda e inscrição em desktop e celular.
O build copia `public/` e as páginas HTML para `dist/` pelo fluxo já existente.
