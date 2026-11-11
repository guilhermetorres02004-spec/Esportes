# Instruções do projeto

## Atalho de conversa `:skill`

- Quando o usuário enviar `:skill` sozinho ou no início de uma mensagem, interpretar como uma invocação explícita da skill `decompor-tarefas`.
- Ler `.agents/skills/decompor-tarefas/SKILL.md` antes de executar a tarefa, se ainda não tiver sido lido na sessão, e seguir suas instruções.
- Se houver uma tarefa após `:skill`, aplicar a skill a essa tarefa imediatamente.
- Se `:skill` vier sozinho e houver uma tarefa em andamento, aplicar a skill à tarefa em andamento.
- Se `:skill` vier sozinho e não houver tarefa em andamento, confirmar a ativação e aplicar a skill à próxima tarefa enviada pelo usuário nesta conversa.
- O atalho é uma convenção de conversa deste projeto; não é um comando de terminal.
- A ativação também inclui os padrões de `docs/padroes-portal.md`: ler essa referência e `docs/retomada.md` antes de implementar. Aplicar os padrões visuais definidos e React às páginas criadas ou adaptadas, preservando as páginas já migradas e as decisões mais recentes.
- Estas regras são comuns a todas as IAs que acessam o projeto. Arquivos específicos de ferramentas devem apontar para este documento e para a referência comum, sem manter versões divergentes dos padrões.

## Adaptação de página `:adpte` — todas as IAs

- `:adpte`, sozinho ou no início de uma mensagem, invoca `.agents/skills/adpte/SKILL.md`. Preservar essa grafia do atalho.
- `:adpte <página, arquivo ou rota>` adapta a página indicada aos padrões de `docs/padroes-portal.md` e à implementação React do portal existente. Se já estiver em React, atualizar seu componente atual.
- Sem destino explícito, usar a página da tarefa ativa somente se inequívoca; caso contrário, perguntar qual página. Não escolher automaticamente a aba aberta.
- Seguir a skill de adaptação e `decompor-tarefas`; preservar conteúdo, APIs, autenticação e rotas antigas, verificar build/interações e atualizar `docs/retomada.md`. O atalho não autoriza commit ou publicação.

## Versionamento `:commit` — todas as IAs

- `:commit`, sozinho ou no início da mensagem, autoriza preparar e criar um commit local das alterações do portal, seguido de uma tag anotada de versão. Texto após o atalho serve como descrição adicional do commit. Não executar commit apenas por ler ou criar estas instruções.
- Aplicar a skill local `decompor-tarefas` e os padrões de `docs/padroes-portal.md`. Conferir branch, status, diff, arquivos novos e alterações já staged; preservar trabalho existente. Não fazer checkout, reset, amend ou sobrescrever tags para cumprir o atalho.
- Usar a maior tag estável no formato exato `v1.N`, com N inteiro, e incrementar N em um: `v1.2` → `v1.3`, `v1.9` → `v1.10`. Conferir tags locais e, quando houver remoto, consultar também suas tags antes de escolher a versão. Não usar números decimais nem ordenar como texto. Sem tags dessa série, começar em `v1.0`.
- Se não for possível consultar o remoto, informar a limitação e usar as tags locais; não afirmar que a versão é a mais recente do GitHub. Nunca substituir uma tag existente. Se houver colisão, recalcular antes de criar commit/tag.
- Incluir código, imagens, dados iniciais públicos, testes e instruções necessários para reproduzir a versão. Revisar os arquivos explicitamente antes de adicioná-los; não usar `git add .` indiscriminadamente. Não incluir segredos, bancos operacionais, logs, builds, dependências instaladas ou arquivos ignorados.
- Preservar fora do commit ajustes locais da IDE, `frontend/piloto/`, `frontend/vendor/` e `frontend/.yarnrc.yml`, conforme a exclusão já adotada neste projeto, salvo pedido explícito de inclusão. Se arquivos alheios ao escopo já estiverem staged, não os retirar nem incluí-los silenciosamente; esclarecer somente o conflito necessário.
- Executar build/testes adequados às mudanças antes de gravar a versão. Se falharem, corrigir no escopo autorizado ou informar o bloqueio; não declarar uma versão verificada com falhas ocultas.
- Atualizar `docs/retomada.md` e criar `docs/releases/v1.N.md` com resumo, verificações e pendências antes do commit, para que acompanhem a versão. Criar o commit com mensagem `release: v1.N — <resumo>` e a tag anotada `v1.N` apontando para esse commit.
- Se não houver alterações para versionar, informar e não criar commit vazio, tag ou uma nova versão somente para registrar a execução do atalho.
- Verificar hash do commit, destino da tag e status final. Se o commit passar e a tag falhar, informar o estado parcial e concluir a tag no mesmo commit, sem criar outra versão por engano.
- `:commit` sozinho não autoriza push, publicação, Release no GitHub ou deploy. Se o usuário pedir também o envio, publicar o commit e a tag sem force push e verificar o resultado remoto. Informar sempre se a versão ficou somente local ou foi enviada.
- É uma convenção de conversa para IAs que leem este repositório, não um comando nativo do terminal.

## Retomada `:return` — todos os agentes

- `:return`, sozinho ou no início da mensagem, significa retomar as modificações de onde pararam. Não significa desfazer alterações.
- Sempre ativar `decompor-tarefas`, seguindo o mesmo procedimento de `:skill` acima.
- Ler `docs/retomada.md` e consultar `docs/adaptacao-design-system.md` para o histórico e as referências oficiais.
- Conferir o estado atual dos arquivos e do Git antes de editar; preservar alterações existentes e não presumir que testes antigos continuam passando.
- Seguir os padrões assimilados e as decisões explícitas mais recentes do usuário. Se a referência externa estiver indisponível, registrar a limitação sem inventar requisitos.
- Trabalhar diretamente no portal existente; não continuar o piloto paralelo sem pedido explícito.
- Se houver texto após `:return`, incorporá-lo como orientação da retomada.
- Executar somente o próximo lote pequeno necessário, verificar o resultado e atualizar `docs/retomada.md` com mudanças, verificações, pendências e próximo passo.
- Ao finalizar cada lote, perguntar se pode continuar e aguardar. Não iniciar o lote seguinte automaticamente.
- Se o registro estiver ausente ou contraditório e o código não esclarecer o próximo passo, pedir somente a informação bloqueante.
- Qualquer agente que concluir trabalho neste projeto deve manter o registro de retomada atualizado, mesmo quando a tarefa não começar com `:return`.
- Estes atalhos são instruções de conversa para ferramentas que leem o repositório, não comandos nativos de todas as plataformas.
