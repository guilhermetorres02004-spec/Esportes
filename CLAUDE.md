# Instruções para Claude

Leia e siga `AGENTS.md`, fonte comum das instruções deste projeto.
Ao receber `:adpte`, siga `.agents/skills/adpte/SKILL.md` para adaptar a página
indicada aos padrões do portal e a React, conforme `AGENTS.md`.
Ao receber `:commit`, siga o versionamento de `AGENTS.md`: commit local e tag
sequencial `v1.N`, incrementando a maior versão existente; push somente se solicitado.
Ao receber `:skill`, leia `.agents/skills/decompor-tarefas/SKILL.md`,
`docs/padroes-portal.md` e `docs/retomada.md`. Aplique os padrões visuais e React
às páginas no escopo, preservando o portal existente e as páginas já migradas.
Ao receber `:return`, leia `docs/retomada.md`, ative a skill decompor-tarefas
conforme `AGENTS.md` e retome apenas o próximo lote, preservando as decisões registradas.
Atualize o registro ao concluir e pergunte se pode continuar.
