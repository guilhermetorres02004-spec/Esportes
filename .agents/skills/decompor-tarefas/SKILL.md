---
name: decompor-tarefas
description: Divide qualquer tarefa no maior número possível de etapas atômicas e verificáveis, e executa uma de cada vez com checagem de fatos, verificação após cada passo e controle rígido de escopo, para evitar alucinações, manter a atenção máxima e entregar código de boa qualidade. Use em toda tarefa de implementação, correção de bug, refatoração, migração, configuração ou análise com mais de um passo, e sempre que o usuário pedir "divida em etapas", "passo a passo", "planeje antes de fazer", "faça com cuidado", "sem alucinar" ou "/decompor-tarefas".
---

# Decompor Tarefas — execução atômica e verificada

## Contexto deste projeto: `:skill`

Neste repositório, `:skill` também ativa os padrões de `docs/padroes-portal.md`. Antes da tarefa, leia essa referência, `AGENTS.md` e o estado mais recente em `docs/retomada.md` (caminhos relativos à raiz do projeto). Aplique o visual compartilhado e implemente páginas em React no portal existente. Home, modalidades, Núcleos e Conquistas já usam React; confirme o código e adapte páginas legadas somente quando fizerem parte do pedido. Não inicie migração global, piloto paralelo ou publicação com base no atalho.

Você vai resolver a tarefa do usuário quebrando-a no **maior número possível de etapas atômicas**, executando **uma etapa por vez** e **verificando cada uma** antes de seguir. O objetivo é manter o foco total em pouca coisa de cada vez, só afirmar o que foi comprovado e entregar exatamente o que foi pedido, nem mais nem menos.

## Princípios inegociáveis

1. **Uma coisa de cada vez.** Nunca trabalhe em duas etapas ao mesmo tempo. Só uma etapa fica "em andamento".
2. **Fato antes de ação.** Não cite, use nem edite arquivo, função, rota, variável, comando, flag ou API que você não viu nesta sessão. Se não viu, a etapa é "ler/verificar", não "usar".
3. **Ler o estado atual, não a memória.** Antes de editar, releia o trecho exato que vai mudar. O arquivo pode ter mudado desde a última leitura.
4. **Toda etapa tem prova de pronto.** Uma etapa só é concluída depois que a verificação definida para ela passou.
5. **Escopo é contrato.** Faça só o que o pedido exige. Melhorias que você notar vão para a lista "Fora do escopo", não para o código.
6. **"Não sei" é melhor que inventar.** Na dúvida, verifique (ler, buscar, rodar) ou pergunte. Marque suposições explicitamente.
7. **Granularidade máxima, sem enchimento.** Quebre até não dar mais, mas cada etapa precisa produzir algo real. Etapa vazia ("pensar", "revisar mentalmente") não conta.

Detalhes das regras: `referencias/anti-alucinacao.md`, `referencias/boas-praticas.md` e `referencias/controle-de-escopo.md`.

---

## Fase 0 — Contrato de escopo

Antes de qualquer leitura de código ou plano, escreva para o usuário (curto):

- **Pedido reescrito**: uma frase com o que será entregue.
- **Requisitos** numerados (`R1`, `R2`, ...): cada coisa que o pedido exige, explícita ou claramente implícita.
- **Critérios de aceite**: como saber que cada requisito foi atendido (comportamento observável, teste, saída).
- **Fora do escopo**: o que você NÃO vai fazer, mesmo que pareça relacionado.
- **Suposições** (`S1`, `S2`, ...): o que está assumindo sem confirmação.
- **Perguntas bloqueantes**: só se a resposta mudar o que será feito e não puder ser descoberta no código. Se houver, pergunte e espere. Se não houver, siga.

## Fase 1 — Reconhecimento (somente leitura)

Objetivo: transformar suposições em fatos antes de planejar.

1. Liste o que precisa ser descoberto (arquivos envolvidos, padrões do projeto, versões de libs, como rodar testes/lint/build).
2. Descubra cada item com ferramentas (`Glob`, `Grep`, `Read` com offset/limit, comandos de leitura). Prefira trechos a arquivos inteiros.
3. Registre um **Quadro de Fatos**: cada fato com fonte (`arquivo:linha`, saída de comando). Ex.: `F3 — validação de token em src/auth/jwt.ts:42 (função verifyToken)`.
4. Revise as suposições: confirmadas viram fatos, refutadas mudam o plano, as restantes continuam marcadas como `S`.
5. Identifique as convenções que o código novo deve seguir (nomes, estrutura de pastas, tratamento de erro, estilo de testes, idioma dos comentários).

Não edite nada nesta fase.

## Fase 2 — Decomposição atômica

Monte a árvore: **requisito → subobjetivos → etapas atômicas**. Continue quebrando enquanto alguma etapa violar o teste de atomicidade abaixo.

**Teste de atomicidade** — uma etapa só é atômica se TODAS forem verdadeiras:

- Tem **um único objetivo**, descrito com um verbo concreto (criar, ler, alterar, remover, rodar, conferir).
- Toca **no máximo um arquivo** (de preferência uma função/bloco), ou é uma única ação de leitura/execução.
- A mudança cabe em **~30 linhas** ou menos; se passar disso, divida.
- Tem uma **verificação objetiva** (comando, teste, leitura do resultado, saída esperada).
- Pode ser desfeita sozinha sem quebrar as outras etapas já concluídas.
- Não depende de nada que ainda não seja fato (`F`) ou resultado de etapa anterior.

**Tipos de etapa** que costumam ser esquecidos e devem virar etapas próprias: ler o trecho antes de editar; criar o teste antes/depois da implementação; atualizar imports/exports; atualizar tipos/interfaces; tratar o caso de erro; tratar o caso vazio/limite; atualizar chamadores; rodar lint/typecheck; rodar testes; conferir o diff final.

Use o formato de `referencias/modelo-plano.md` para cada etapa:

```
E07 — Adicionar tratamento de token expirado em verifyToken
  Requisito: R2        Depende de: E05, E06
  Arquivo: src/auth/jwt.ts (função verifyToken, ~l.42-60)
  Ação: capturar TokenExpiredError e lançar AuthError('expired')
  Pronto quando: teste "rejeita token expirado" passa
  Verificação: npm test -- jwt.test.ts
```

## Fase 3 — Validação do plano (antes de executar)

Confira e corrija o plano até tudo passar:

- [ ] **Cobertura**: todo requisito `R` tem ao menos uma etapa, e todo critério de aceite tem uma verificação.
- [ ] **Sem excesso**: nenhuma etapa deixa de apontar para um requisito. Se apontar para nada, remova ou mova para "Fora do escopo".
- [ ] **Ordem**: dependências antes dos dependentes; leituras antes de edições; teste antes ou logo depois do código que testa.
- [ ] **Atomicidade**: toda etapa passa no teste de atomicidade.
- [ ] **Fatos**: nenhuma etapa usa algo que ainda é suposição sem uma etapa anterior de verificação.
- [ ] **Risco**: etapas destrutivas ou irreversíveis (apagar, migrar dados, push, deploy, instalar pacote) estão marcadas e exigem confirmação do usuário.

Registre todas as etapas na ferramenta de lista de tarefas disponível (ex.: `TodoWrite`, `TaskCreate` ou `update_plan`), com o ID (`E01`, `E02`, ...) no título. Mostre o plano ao usuário em formato compacto. Se a tarefa for grande ou arriscada, peça aprovação; se for pequena e clara, siga direto.

## Fase 4 — Execução em ciclo (uma etapa por vez)

Para **cada** etapa, rode este ciclo completo, sem pular passos (checklist em `referencias/checklist-etapa.md`):

1. **Marcar** a etapa como "em andamento" (só ela).
2. **Reler** a descrição da etapa e o requisito que ela atende.
3. **Reler o estado atual** do trecho que será tocado (`Read` com offset/limit).
4. **Executar** apenas o que a etapa descreve. Nada a mais.
5. **Verificar** com a verificação definida. Leia a saída de verdade; não presuma que passou.
6. **Decidir**:
   - Passou → marcar como concluída e registrar a evidência em uma linha.
   - Falhou → não avance. Diagnostique, crie etapas de correção (`E07a`, `E07b`) e execute-as pelo mesmo ciclo.
   - Descobriu algo que muda o plano → pare, atualize o plano (Fase 3 de novo para as etapas afetadas) e avise o usuário em uma linha.
7. **Reportar** em uma linha: `E07 ✔ — <o que mudou> — <evidência>`.

**Checkpoint de atenção** a cada 5 etapas concluídas (e sempre antes de uma etapa de risco):

- Releia o pedido original e o contrato de escopo da Fase 0.
- Confira se o que foi feito até agora ainda aponta para os requisitos.
- Confira se alguma suposição `S` foi usada sem verificação.
- Se a conversa estiver longa, reescreva um resumo curto do estado: concluídas, em andamento, pendentes, fatos-chave.

## Fase 5 — Verificação final

1. Rode as verificações globais que o projeto tiver (testes, lint, typecheck, build). Reporte a saída real; se algo falhar, volte à Fase 4 com etapas de correção.
2. Revise o diff completo: tudo nele aponta para algum requisito? Remova o que não aponta.
3. Monte a **matriz de rastreabilidade**: cada `R` → etapas → evidência → status (atendido / parcial / não atendido).
4. Entregue ao usuário, nesta ordem:
   - O que foi feito (curto), com links `arquivo:linha`.
   - Matriz de rastreabilidade.
   - Suposições que continuam sem confirmação.
   - O que não foi possível verificar e por quê.
   - **Fora do escopo — sugestões**: melhorias notadas e não feitas.

Nunca declare "pronto" ou "funcionando" sem evidência da Fase 5. Se algo ficou parcial, diga exatamente o quê.

---

## Adaptação ao tamanho da tarefa

- **Pequena** (1 arquivo, mudança clara): faça as fases de forma enxuta, mas mantenha Fase 0 (em 3-5 linhas), etapa de leitura antes da edição, verificação por etapa e matriz final.
- **Média/grande**: todas as fases completas, plano mostrado antes de executar, checkpoints obrigatórios.
- **Tarefa não técnica** (texto, análise, pesquisa): mesmas fases; "arquivo" vira "seção/fonte" e "verificação" vira "conferir contra a fonte citada".

## Quando parar e perguntar

- Requisito ambíguo que muda o resultado e o código não esclarece.
- A verificação falhou duas vezes na mesma etapa pelo mesmo motivo.
- A etapa seguinte é destrutiva, irreversível ou mexe em algo compartilhado (push, deploy, banco, pacotes, configuração global).
- O plano precisou mudar a ponto de alterar o que será entregue.
