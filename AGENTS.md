# Instruções do projeto

## Atalho de conversa `:skill`

- Quando o usuário enviar `:skill` sozinho ou no início de uma mensagem, interpretar como uma invocação explícita da skill `decompor-tarefas`.
- Ler `.agents/skills/decompor-tarefas/SKILL.md` antes de executar a tarefa, se ainda não tiver sido lido na sessão, e seguir suas instruções.
- Se houver uma tarefa após `:skill`, aplicar a skill a essa tarefa imediatamente.
- Se `:skill` vier sozinho e houver uma tarefa em andamento, aplicar a skill à tarefa em andamento.
- Se `:skill` vier sozinho e não houver tarefa em andamento, confirmar a ativação e aplicar a skill à próxima tarefa enviada pelo usuário nesta conversa.
- O atalho é uma convenção de conversa deste projeto; não é um comando de terminal.

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
