# Padrões ativos do Portal do Esporte

Referência comum para todas as IAs que trabalham neste repositório. Deve ser lida ao ativar `:skill` ou `:return`, junto de `AGENTS.md`, da skill local e do registro de retomada. Decisões explícitas mais recentes do usuário prevalecem sobre registros históricos.

## React e rotas

- Trabalhar no portal existente em `frontend`, com React e Vite. Não continuar `frontend/piloto` sem pedido explícito.
- A central Arquivos (`/comunicacao`) também usa React, com importações existentes e painel de fotos oficiais; atualização manual permanece exclusiva de administradores.
- Home, 22 modalidades, Núcleos (`/esporte-nas-regionais`), Conquistas (`/conquistas`), Login (`/entrar`), Administrativo (`/administrativo`), Inscrição (`/inscricao`), Agenda (`/agenda`), Agendamento de Quadras (`/agendamento-quadras`) e Detalhes do Evento (`/detalhes-evento`) já têm componentes React. Conferir `frontend/src/main.jsx` e o estado dos arquivos antes de editar. A autenticação continua em `POST /login`; não substituir esse endpoint pela página.
- Novas páginas e adaptações de páginas devem seguir React, com componentes e estado declarativos; reutilizar os componentes existentes. Não criar outra versão HTML independente nem reexecutar scripts legados que alterem o DOM controlado pelo React.
- Se a página solicitada ainda for legada, adaptar essa página para React dentro do escopo autorizado. Não declarar todas as páginas migradas nem migrar páginas não solicitadas automaticamente.
- Usar URLs públicas sem `.html`; preservar compatibilidade dos endereços antigos, parâmetros e fragmentos. Integrar rotas em `src/main.jsx`, desenvolvimento/preview, build e publicação, conforme necessário.
- Preservar APIs, sessão, fontes, conteúdo confirmado, acessibilidade e comportamento existente. Effects devem limpar timers, listeners e requisições ao desmontar.

## Visual e componentes

- Reutilizar os tokens de `frontend/public/css/portal-base.css` e os estilos atuais do portal. Referência histórica e origem do kit: `docs/adaptacao-design-system.md`; decisões posteriores registradas em `docs/retomada.md` prevalecem.
- Azul navy `#023568` e azul institucional `#0072e7`; manter as decisões específicas da página já aprovadas. Não substituir a identidade azul pelo verde do kit.
- Fontes Montserrat nos títulos e Karla no corpo; largura `--portal-width`, superfícies, bordas, raios e sombras dos tokens `--portal-*`, `--radius-kit` e `--shadow-kit`.
- Cards com conteúdo legível, quebra de texto, alturas coerentes, bordas discretas e responsividade. Botões com alvos confortáveis (ao menos 44px quando aplicável), foco visível e estados claros.
- Reutilizar cabeçalho, acessibilidade/VLibras e `src/home/Footer.jsx`. Não duplicar cabeçalho ou rodapé. Respeitar preferências de contraste, tamanho de texto e movimento reduzido.
- Preservar imagens enviadas pelo usuário e usar descrição acessível. Não atribuir origem oficial a imagens sem comprovação.

## Verificação e continuidade

- `:adpte <página>` aplica `.agents/skills/adpte/SKILL.md` para adaptar a página indicada ao visual compartilhado e a React. Se já estiver migrada, reutilizar o componente. Sem destino inequívoco, perguntar qual página.

- Conferir Git e arquivos antes de editar; preservar trabalho existente. Executar verificações proporcionais à mudança e registrar resultados reais, separando testes automatizados da conferência visual.
- Atualizar `docs/retomada.md` com mudanças, verificações, limitações e próximo passo. Não publicar, enviar ao GitHub nem instalar dependências por causa do atalho sozinho.
- `:skill` aplica estes padrões à tarefa atual; não autoriza reformular todo o portal. `:return` mantém o fluxo de pequenos lotes e a confirmação entre lotes descritos em `AGENTS.md`.
- `:commit` autoriza o commit local e a próxima tag `v1.N`, seguindo integralmente a seção de versionamento de `AGENTS.md`. Incrementar o inteiro após `1.`; envio ao GitHub exige pedido de push ou publicação.
