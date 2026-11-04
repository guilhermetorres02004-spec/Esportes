# Portal Esporte Betim

Estrutura inicial do projeto:

```text
portal-esporte-betim/
├── backend/
├── frontend/
│   └── portal-esporte-web/
├── database/
│   └── schema.sql
└── README.md
```

## Pastas

- `backend`: API do portal.
- `frontend/portal-esporte-web`: aplicacao web do portal.
- `database/schema.sql`: script de criacao do banco de dados.

## Execucao local

Requer Java 17 ou superior, Maven (ou o Maven local usado por `backend/mvnw.cmd`)
e Node.js compativel com Vite 7.

1. Em `backend`, execute `mvn spring-boot:run` (no Windows, pode usar `./mvnw.cmd spring-boot:run`).
   A API deve ficar em `http://localhost:8080`.
2. Em outro terminal, entre em `frontend`, execute `npm ci` e `npm run dev -- --host 127.0.0.1 --port 5174`.
3. Abra `http://127.0.0.1:5174/login.html`.

O backend e o frontend precisam estar em execucao para entrar na administracao.
O Vite encaminha `/api`, `/login` e `/logout` para a API na porta 8080.

O Tailwind e compilado localmente antes de `npm run dev` e `npm run build`.
Ao editar classes durante o desenvolvimento, use `npm run watch:css` em outro terminal.
Para gerar a versao de producao, execute `npm run build` em `frontend`.

## Reservas de quadras do Horto Municipal

Acesse `agendamento-quadras.html` pelo menu do portal ou pelo painel administrativo.
O agendamento exige uma sessao administrativa e possui sete quadras, numeradas de 1 a 7.
A Quadra 1 e coberta; as Quadras 6 e 7 sao de areia. As identificacoes aparecem na agenda e nas reservas.
Selecione a data, a quadra, o esporte, o responsavel e o intervalo de horas inteiras (minimo de uma hora).
O esporte e obrigatorio. O calendario e a API rejeitam datas anteriores ao dia atual em Sao Paulo.
A grade mostra o dia completo; `24:00` representa o encerramento do dia selecionado.

As reservas exibem quadra, data, inicio/fim, esporte, responsavel e momento do registro.
Reservas anteriores a inclusao do campo esporte sao preservadas e exibem "Nao informado" nessa coluna.
A mesma quadra nao aceita sobreposicoes, inclusive em requisicoes simultaneas:
a API bloqueia a linha da quadra ate concluir a verificacao e a gravacao da reserva.
Periodos consecutivos (por exemplo, 14h-16h e 16h-17h) sao permitidos.

O banco H2 agora usa `backend/data/portal_esporte.mv.db` ao iniciar em `backend`,
preservando os dados entre reinicios. Essa pasta e privada e ignorada pelo Git.
Em Docker, os dados ficam no volume nomeado `esporte-dados`.
`SPRING_DATASOURCE_URL` pode sobrescrever a configuracao de armazenamento.

Testes: `npm run test:horto` em `frontend` e `mvn test` em `backend`.
Os testes do backend usam um banco em memoria separado dos dados reais.
