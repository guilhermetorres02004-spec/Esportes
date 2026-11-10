# Instruções do projeto

## Atalho de conversa `:skill`

- Quando o usuário enviar `:skill` sozinho ou no início de uma mensagem, interpretar como uma invocação explícita da skill `decompor-tarefas`.
- Ler `.agents/skills/decompor-tarefas/SKILL.md` antes de executar a tarefa, se ainda não tiver sido lido na sessão, e seguir suas instruções.
- Se houver uma tarefa após `:skill`, aplicar a skill a essa tarefa imediatamente.
- Se `:skill` vier sozinho e houver uma tarefa em andamento, aplicar a skill à tarefa em andamento.
- Se `:skill` vier sozinho e não houver tarefa em andamento, confirmar a ativação e aplicar a skill à próxima tarefa enviada pelo usuário nesta conversa.
- O atalho é uma convenção de conversa deste projeto; não é um comando de terminal.
