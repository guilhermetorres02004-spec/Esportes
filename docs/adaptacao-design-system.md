# Adaptação ao design system — referência inicial

## Escopo e critérios de aceite

- R1: adotar incrementalmente o kit oficial, reutilizando o código existente.
- R2: preservar rotas, sessão, integrações, uploads e persistência.
- R3: executar lotes pequenos e solicitar continuidade ao concluir cada lote.
- Aceite: testes dos fluxos existentes preservados e validação de cada página migrada.
- Fora deste lote: instalar dependências, alterar interface, backend, banco ou publicação.

## Contratos confirmados no código

| Contrato | Fonte | Preservar |
| --- | --- | --- |
| Home React e normalização de URL | `frontend/src/main.jsx` | Entrada `/` e compatibilidade com `/index.html` |
| Proxy de desenvolvimento | `frontend/vite.config.js` | `/api`, `/login` e `/logout` para o backend na porta 8080 |
| Proxy publicado | `frontend/nginx.conf` | APIs, sessão e limite de corpo de 200 MB |
| Autenticação | `backend/src/main/java/br/gov/betim/esporte/config/SecurityConfig.java` | Login por formulário, sessão e permissões ADMIN |
| Banco persistente | `backend/src/main/resources/application.properties` | H2 em `./data/portal_esporte`; nenhuma migração de esquema prevista |
| Volume do banco | `docker-compose.yml` | `esporte-dados:/app/data` |
| Arquivos enviados | `docker-compose.yml` | Montagens de vídeos e imagens existentes |
| Acessos temporariamente ocultos | `frontend/public/js/portal-header.js` | `acessosHabilitados = false` |
| Conquistas por ano | `frontend/public/js/conquistas-sync.js` | Limite de seis cards |
| Indicador de conquistas | `frontend/src/home/Sections.jsx` | 1.452 medalhas |

## APIs a preservar

Fonte: controladores em `backend/src/main/java/br/gov/betim/esporte/controller/`.

- Sessão: `GET /api/auth/me`; processamento de login e logout em `/login` e `/logout`.
- Conteúdo: GET/POST em `/api/eventos`, `/api/noticias`, `/api/modalidades` e `/api/locais-esportivos`.
- Inscrições: GET/POST em `/api/inscricoes`, mantendo as permissões existentes.
- Arquivos: GET/POST em `/api/videos` e `/api/imagens`; GET `/api/imagens/exibindo`.
- Fotos: GET `/api/fotos`, `/status`, `/imagens/{id}`; POST `/api/fotos/atualizar` (subrotas relativas a `/api/fotos`).
- Conquistas: GET `/api/conquistas`, `/status`; POST `/api/conquistas/atualizar` (status relativo a `/api/conquistas`).
- Suporte: GET `/api/suporte/status`; POST `/api/suporte/mensagens`.
- Horto (ADMIN): GET `/api/horto/quadras`, `/esportes`, `/reservas`; POST `/api/horto/reservas` (subrotas relativas a `/api/horto`).

## Sequência de lotes

1. Registrar contratos e executar testes atuais do frontend.
2. Verificar acesso aos pacotes oficiais e preparar instalação reproduzível.
3. Preparar Next.js 16, TypeScript e Tailwind 4 com compatibilidade das rotas antigas.
4. Integrar tema, fontes e recursos globais de acessibilidade.
5. Adaptar cabeçalho e rodapé, preservando menus e acessos ocultos.
6. Adaptar a home e depois páginas públicas em pequenos lotes.
7. Adaptar formulários e administração preservando os contratos acima.
8. Validar acessibilidade, fluxos completos e infraestrutura antes de publicar.

## Dependências e pendências

- Referência local: `C:/Users/walter/Desktop/Sistemas/Desygn-sistem/.design-system`.
- Pacotes encontrados: `@prefeitura-betim/portais-ui@0.5.0` e `@prefeitura-betim/portais-theme@0.1.1`.
- O pacote UI exige Next.js 16 e React 19; o projeto atual usa React 19 com Vite e Tailwind 3.
- Acesso ao registro privado ainda não verificado; não copiar componentes nem expor credenciais.
- Confirmar orientação sobre a marca Beta, pois documentos históricos e componentes atuais divergem.
- O build atual copia os HTMLs da raiz: classificar cópias e protótipos antes de mudar a publicação.
- Testes unitários não comprovam comportamento visual, acessibilidade ou integração com backend em execução.

## Verificação do lote 1 — 2026-11-10

- Comando: `node --test tests/*.test.mjs`, executado em `frontend`.
- Resultado: 69 testes aprovados, zero falhas.
- A primeira tentativa teve 66 aprovações e uma falha de infraestrutura: o esbuild não conseguiu ler diretórios ancestrais sob a restrição do ambiente.
- A repetição autorizada fora dessa restrição passou integralmente, sem modificar o código dos testes.
- Alteração deste lote: somente este documento. Interface, dependências e backend preservados.
- Próximo lote proposto: verificar disponibilidade dos pacotes oficiais antes de preparar a migração do frontend.

## Verificação do lote 2 — 2026-11-10

- Node disponível: `v24.22.0`; npm disponível: `11.19.1`.
- Criado `frontend/.nvmrc` com Node 24, conforme a referência oficial.
- Criado `frontend/.yarnrc.yml` com o escopo oficial e token fornecido apenas por `GITHUB_TOKEN`, com fallback vazio.
- O gerenciador atual e seu lockfile foram preservados; Yarn ainda não foi ativado nem executado.
- Consulta de metadados no GitHub Packages sem autenticação: HTTP 404 para os dois pacotes. Não havia `GITHUB_TOKEN` ou `GH_TOKEN` no processo consultado.
- Esse resultado não comprova ausência das versões: o acesso autenticado continua pendente.
- Nenhum pacote foi instalado e nenhuma credencial foi gravada no projeto.
- Próximo lote: verificar a alternativa de tarballs versionados prevista pela equipe ou o acesso autenticado; preparar a instalação somente após confirmar a origem dos pacotes.

## Verificação do lote 3 — 2026-11-10

- Confirmado o fallback por tarballs no `PLANO-DE-EXECUCAO.md` oficial, seção do canário no Portal da Saúde.
- Empacotados tema 0.1.1 e UI 0.5.0 da referência local com `npm pack --ignore-scripts`, sem alterar o design system.
- Arquivos em `frontend/vendor/design-system/`, acompanhados de origem, hashes SHA-256 e orientações de atualização.
- Verificados 5 arquivos no tema e 78 na UI; conteúdo não manifesto comparado byte a byte com a referência local e todos os destinos de exports presentes.
- A identidade e a versão dos manifestos foram conferidas; isso não equivale a verificar uma publicação no registro privado.
- Nenhuma dependência instalada, nenhum lockfile ou componente da aplicação alterado.
- Próximo lote: instalar os pacotes locais e as dependências compatíveis para preparar uma página piloto Next.js, mantendo o Vite disponível durante a transição.

## Verificação do lote 4 — 2026-11-10

- Criado `frontend/piloto/`, isolado do Vite, com Next.js 16.2.11, React 19.2.7, TypeScript 5, Tailwind 4 e os dois pacotes locais oficiais.
- Dependências instaladas sem executar scripts de instalação; versões resolvidas registradas em lockfile próprio. npm mantido na transição, sem afirmar adoção de Yarn concluída.
- Página inicial usa `SectionHeading` do pacote oficial; imports CSS, varredura dos componentes e transpilePackages configurados.
- Configurados encaminhamentos para `/api/*`, `/login` e `/logout`; integração com backend e limites de upload ainda não validados.
- Build de produção e checagem de tipos aprovados. Testes do frontend atual: 69 aprovados, zero falhas.
- Primeiro build sob restrição de leitura omitiu utilitários CSS; repetido com acesso necessário e verificado com sucesso. Acrescentada verificação de HTML/CSS ao comando de build.
- Servidor de produção verificado por HTTP na porta 3001: status 200, h1 único, noindex e CSS com os utilitários oficiais.
- Interface do portal atual, backend e banco preservados. O piloto ainda não inclui cabeçalho, fontes institucionais carregadas ou migração das páginas.
- Próximo lote: integrar fontes, preferências visuais e cabeçalho oficial no piloto, preservando os acessos temporariamente ocultos.

## Verificação do lote 5 — 2026-11-10

- Integrado `CabecalhoDoPortal` oficial, com navegação institucional, menus e controles de fonte e contraste; Login e Inscreva-se continuam ausentes (`acao={null}`).
- Fontes Karla e Montserrat via next/font com variáveis no html; script oficial de preferências no head e saltos como primeiros links, com alvos focáveis.
- Integrado VLibras oficial; a operação do serviço externo ainda precisa de validação em navegador.
- Logos copiados da referência oficial. Mantida a marca Beta usada pelo contrato atual e pelo portal existente; divergência histórica continua registrada.
- Destinos ainda não migrados apontam ao Vite em localhost:5173, configurável por `PORTAL_LEGADO_URL`; o portal atual permanece independente.
- Catálogo de portais preservado; não foi inventada uma entrada do esporte na biblioteca compartilhada.
- Build, TypeScript e verificação de CSS aprovados; quatro testes de acessibilidade estrutural e preferências aprovados.
- HTTP 200 confirmado na página, fontes locais e dois logos. Não havia navegador conectado para testar foco, hover, responsividade e o widget externo.
- Próximo lote: integrar o rodapé institucional e os arquivos de identidade restantes no piloto.

## Ajuste de direção — adaptação direta do portal existente

- O usuário esclareceu que as adaptações devem ocorrer no site existente, sem desenvolver uma versão paralela.
- O piloto deixa de ser o destino das próximas mudanças; seus arquivos permanecem disponíveis como referência, sem substituir os comandos do Vite.
- Primeiro lote direto: atalhos de conteúdo/menu na home, alvos focáveis, um único landmark principal e título h1 no carrossel.
- Os espaçamentos e estilos do conteúdo foram preservados ao reorganizar a marcação semântica.
- APIs, banco, menus e acessos temporariamente ocultos permanecem preservados.
- A adoção técnica dos pacotes oficiais no frontend principal continua pendente; estas correções não equivalem à migração completa para Next.js.
- Verificação deste lote direto: 70 testes aprovados e build Vite de produção aprovado.

## Lote direto 2 — cabeçalho visual

- Ajustado o cabeçalho compartilhado do site existente: navy institucional nas marcas e verde oficial na navegação.
- Utilizados nomes de tokens oficiais com fallbacks da referência local durante a transição; o conteúdo mantém seu acento atual.
- Logos mantêm proporção natural, com alturas alinhadas ao kit; menus compactos continuam abaixo dos respectivos destinos.
- Estados de foco/hover ajustados para a faixa verde e os painéis claros; texto móvel dos menus ampliado.
- Hover, clique, teclado e regras de sessão preservados sem alterar JavaScript neste lote.
- Verificações: 70 testes aprovados, build aprovado e CSS atualizado servido em localhost:5174.
- Contraste calculado branco/verde da navegação: 5,76:1. Isso não substitui validação visual completa em navegador.
- A biblioteca React oficial ainda não foi integrada ao frontend principal; esta etapa adapta sua apresentação existente.

## Preferência do usuário — cabeçalho azul

- A pedido do usuário, a navegação permanece azul, substituindo a faixa verde do padrão.
- Área das marcas em navy `#023568`; navegação em azul institucional `#0072e7`.
- Acentos e foco dos painéis também ajustados para azul. Contraste branco/azul verificado acima de 4,5:1.
- CSS atualizado confirmado em localhost:5174; alteração somente visual.

## Lote direto 3 — barra de acessibilidade

- Barra compartilhada com A+, A−, Contraste e Restaurar; estado anunciado e limites de tamanho refletidos nos botões.
- Escala de 70% a 140%, passo 10, e chaves `fontSize`/`theme` compatíveis com o kit oficial.
- Script síncrono no head das 21 páginas compartilhadas aplica preferências antes dos estilos; leitura e gravação toleram armazenamento bloqueado.
- Sincronização entre abas e restauração dos padrões implementadas, preservando menus, sessão e acessos ocultos.
- CSS de alto contraste adaptado às páginas legadas; não inverte fotos/vídeos. Validação visual de formulários, mapa e telas internas ainda pendente.
- Verificações: 75 testes aprovados, build Vite aprovado e HTTP 200 para home, conquistas e novos recursos em localhost:5174.
- Próximo lote: rodapé institucional, mediante continuidade autorizada pelo usuário.
