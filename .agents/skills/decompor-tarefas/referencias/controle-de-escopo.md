# Controle de escopo

## Regra central

Cada linha alterada precisa apontar para um requisito `R`. O que não aponta não entra.

## Como classificar algo que você notou

| Situação | O que fazer |
|---|---|
| Necessário para cumprir um `R` | Vira etapa no plano, ligada ao `R` |
| Bug ou problema sem relação com o pedido | Anotar em "Fora do escopo — sugestões" |
| Melhoria de estilo, refatoração, renomeação | Anotar em "Fora do escopo — sugestões" |
| Bloqueia o pedido (ex.: teste quebrado antes de começar) | Avisar o usuário e perguntar como seguir |
| Requisito implícito óbvio (ex.: não quebrar o que já funciona) | Incluir como `R` explícito no contrato |

## Sinais de desvio de escopo

- O diff toca arquivos que não estavam no plano.
- Você está criando abstrações "para o futuro".
- Você está mudando formatação ou nomes em trechos que não precisava tocar.
- O número de etapas cresceu muito sem que um requisito novo tenha surgido.

Quando notar um desses sinais: pare, compare o diff com a lista de requisitos e desfaça o que não pertence.

## Mudança de escopo pelo usuário

Se o usuário pedir algo novo no meio do trabalho: registre como novo requisito (`R5`), crie as etapas, valide (Fase 3) só para elas e diga em uma linha como isso afeta o plano.
