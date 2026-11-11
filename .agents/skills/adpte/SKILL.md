---
name: adpte
description: Adapta a página indicada do Portal do Esporte aos padrões visuais definidos e migra sua implementação para React. Use quando o usuário enviar :adpte seguido de uma página ou pedir essa adaptação explicitamente.
---

# Adaptar página: `:adpte`

## Página de destino

- `:adpte <página, arquivo ou rota>` solicita a adaptação dessa página. Texto adicional orienta o resultado.
- Se o atalho vier sozinho, usar a página em adaptação na tarefa ativa quando o destino for inequívoco. Caso contrário, perguntar somente qual página deve ser adaptada. Não escolher uma página apenas por estar aberta na IDE.
- Ler `AGENTS.md`, `docs/padroes-portal.md`, `docs/retomada.md` e a skill local `decompor-tarefas` na raiz do repositório. Consultar `docs/adaptacao-design-system.md` para a origem das referências. Decisões explícitas mais recentes prevalecem.

## Execução

1. Conferir Git e implementação atual. Identificar conteúdo, estilos, scripts, rotas, APIs, autenticação, imagens e interações da página antes de editar.
2. Definir etapas pequenas para adaptar somente a página indicada, preservando alterações existentes e os contratos encontrados.
3. Se já estiver em React, adaptar o componente existente. Se for legada, migrar para componentes React no frontend atual com Vite. Não criar um portal paralelo nem iniciar outra migração global.
4. Aplicar os tokens e componentes compartilhados do portal: identidade azul, Montserrat/Karla, cards, bordas, sombras, espaçamento, botões e rodapé. Preservar o cabeçalho e recursos de acessibilidade existentes sem duplicá-los.
5. Preservar conteúdo confirmado, imagens aprovadas, links, formulários, sessão, permissões e comportamento das APIs. Usar estado e eventos React nas interações; limpar timers, listeners e requisições dos effects. Não executar scripts legados sobre o DOM gerenciado pelo React.
6. Usar rota pública sem `.html`, mantendo compatibilidade do endereço antigo, query e fragmento. Integrar a rota na entrada React, no desenvolvimento/preview e na saída publicada. Evitar colisões com endpoints do backend, como `POST /login`.
7. Conferir responsividade, nomes acessíveis, labels, teclado, foco visível, mensagens de erro e preferências de contraste/movimento. Não inventar fontes, imagens ou requisitos ausentes.
8. Executar build e verificações proporcionais às funções migradas; revisar o diff. Informar quais interações foram verificadas e se a conferência visual não pôde ser realizada.
9. Atualizar `docs/retomada.md` e o inventário React em `docs/padroes-portal.md` quando necessário. Entregar o destino da página e resultados reais das verificações.

## Limites

O atalho autoriza adaptar a página indicada. Não autoriza commit, push, deploy, alterações de banco, instalação de dependências nem mudanças em outras páginas sem necessidade para integrar a adaptação. Criar ou ler esta skill não executa nenhuma migração. É uma convenção de conversa, não um comando do terminal.
