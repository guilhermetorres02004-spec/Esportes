# Modelo de plano

Use este formato para o plano completo. Mantenha cada campo curto e concreto.

## Contrato de escopo

```
Pedido: <uma frase com o que será entregue>

Requisitos
  R1 — <requisito>            Aceite: <comportamento/teste observável>
  R2 — <requisito>            Aceite: <...>

Fora do escopo
  - <o que não será feito>

Suposições
  S1 — <suposição>            Como verificar: <ler X / rodar Y / perguntar>
```

## Quadro de fatos

```
F1 — <fato>                   Fonte: <arquivo:linha | comando + saída>
F2 — <fato>                   Fonte: <...>
```

Um fato sem fonte não é fato: é suposição.

## Etapas

```
E01 — <verbo concreto + objeto>
  Requisito: R1               Depende de: —
  Arquivo: <caminho (função/bloco, linhas aproximadas)> | Ação de leitura/execução
  Ação: <o que exatamente muda, em uma ou duas linhas>
  Pronto quando: <condição objetiva>
  Verificação: <comando, teste ou leitura que comprova>
  Risco: — | DESTRUTIVA (pedir confirmação)
```

Etapas de correção criadas durante a execução recebem sufixo de letra: `E07a`, `E07b`.

## Exemplo resumido

Pedido: "adicionar paginação na rota GET /users".

```
R1 — GET /users aceita ?page e ?limit       Aceite: /users?page=2&limit=10 retorna os itens 11-20
R2 — resposta inclui total de registros      Aceite: campo "total" no JSON
Fora do escopo: paginação em outras rotas; mudar o ORM.

E01 — Ler a rota GET /users                   (leitura)  Verif.: handler localizado e lido
E02 — Ler a função de repositório usada       (leitura)  Verif.: assinatura anotada no quadro de fatos
E03 — Ler um teste existente da rota          (leitura)  Verif.: padrão de teste anotado
E04 — Criar teste "page=2&limit=10"           R1  Verif.: teste falha pelo motivo esperado
E05 — Validar e converter page/limit          R1  Verif.: teste de validação passa
E06 — Aplicar offset/limit na consulta         R1  Verif.: E04 passa
E07 — Criar teste do campo total              R2  Verif.: teste falha pelo motivo esperado
E08 — Consultar contagem total                R2  Verif.: E07 passa
E09 — Tratar page fora do intervalo           R1  Verif.: teste de limite passa
E10 — Rodar lint e typecheck                  —   Verif.: saída sem erros
E11 — Rodar suíte completa                    —   Verif.: todos passam
E12 — Revisar diff contra R1/R2               —   Verif.: nenhuma linha fora do escopo
```
