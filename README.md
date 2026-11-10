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
Nas quadras de areia, o seletor oferece apenas volei de praia, futevolei, beach tennis,
futebol de areia e handebol de areia. As demais quadras mantem as modalidades de piso.
Ao trocar o tipo de quadra, uma modalidade incompativel e desmarcada. A API tambem valida essa regra.
Reservas antigas preservam o esporte originalmente registrado.
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

## Inscricoes e autorizacao de imagem

Ao finalizar a ficha, o portal abre um termo de uso de imagem antes de enviar a inscricao.
Autorizar, negar ou continuar sem responder sao opcoes validas; nenhuma escolha vem marcada.
Somente `autorizaUsoImagem=true` representa autorizacao expressa. `false` registra recusa e
`null` significa que a pessoa nao respondeu. A ficha e enviada para `/api/inscricoes`, com seus
campos completos em `dadosFicha`, a versao do termo e a data da decisao expressa, quando houver.
Erros de envio preservam os dados preenchidos e a escolha. A autorizacao pode ser recusada sem
impedir a inscricao. Para menores, o termo orienta que a decisao cabe ao responsavel legal.

Testes do fluxo: `npm run test:inscricao` em `frontend` e `mvn test` em `backend`.
Ao alterar o texto do termo, atualize sua versao em `Inscricao.html` e `InscricaoService.java`.

## Datas das agendas

As modalidades usam `agenda.html`, que abre no mes atual e destaca hoje no horario de Sao Paulo.
A navegacao permite o mes atual e os futuros; o botao Anterior fica desabilitado no limite.
O calendario verifica a mudanca do dia a cada 30 segundos e ao retornar a aba, inclusive na
virada do mes ou ano. O botao Hoje retorna ao mes atual. Datas originais dos eventos sao preservadas.
A agenda de quadras tambem corrige uma data que ficou no passado durante a atualizacao automatica.
Testes: `npm run test:agenda` em `frontend`.

## Consulta de documentos administrativos

As 12 opcoes dos cards administrativos abrem uma janela com resumo de consulta, fonte,
abrangencia e data da pesquisa. Quando ha PDF, o documento integral abre no leitor da janela.
Os nove PDFs em `frontend/public/docs/administrativo` sao copias dos documentos publicos
consultados em 04/11/2026. `fontes.json` registra origem, tamanho e hash SHA-256 de cada arquivo.

O catalogo fica em `frontend/public/js/admin-documentos-data.js`. Fontes municipais e
referencias tecnicas de outros orgaos sao identificadas separadamente no proprio documento.
A opcao de regimento apresenta a lei de organizacao e competencias; o material do instrutor
identifica a edicao federal localizada. Editais exibem a fonte para consulta dos prazos e situacao.
Quadras do Horto abre diretamente a pagina de agendamento. O acesso ao almoxarifado continua disponivel nas respectivas janelas.

Testes: `npm run test:administrativo` em `frontend`.

## Suporte do portal

O cabecalho carrega o mesmo assistente em todas as 20 paginas de navegacao. As mensagens
possuem barra de rolagem, links das fontes e historico da aba preservado entre paginas.
Limpar conversa apaga esse historico. O chat nao le formularios, reservas ou dados de alunos.

- `POST /api/suporte/mensagens`: recebe `mensagem`, `pagina`, `topico` e ate oito turnos
  de `historico` (`papel`: `user`/`assistant`, `texto`). Retorna resposta, modo, fontes e sugestoes.
- `GET /api/suporte/status`: informa se existe chave configurada e quantas referencias estao disponiveis.
- Sem chave, o modo `consulta` seleciona informacoes da base local. Perguntas sem base pedem esclarecimento.
- Para ativar a IA, defina `OPENAI_API_KEY` no ambiente do backend e reinicie a API.
  `SUPORTE_IA_MODELO` permite trocar o modelo; o padrao e `gpt-5-mini`. Nunca use `VITE_*` para a chave.

A integracao usa a [Responses API com saida estruturada](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses).
Ela envia a pergunta, ate oito turnos e referencias publicadas; nao envia o conteudo de formularios.
CPF, e-mail, telefone e credenciais em formatos reconhecidos sao ocultados antes dessa chamada.
Isso nao substitui o cuidado de nao enviar dados pessoais ao chat. As requisicoes usam `store: false`.
Falhas, limites do provedor e respostas invalidas permitem continuar pela consulta local.
As fontes retornadas pela IA precisam existir entre as referencias fornecidas. A qualidade depende
dos dados publicados e do modelo; os testes nao representam uma garantia de acerto para toda pergunta.

`npm run build:suporte` em `frontend` sincroniza as paginas de modalidades, secoes iniciais,
catalogo administrativo e orientacoes operacionais em `public/docs/suporte/base.json` e no recurso
equivalente do backend. Esse comando roda antes de `dev` e `build`. Ao mudar as paginas durante
uma sessao aberta, rode-o novamente: a API recarrega a copia local atualizada automaticamente.
Depois gere o JAR para incluir a nova base na distribuicao. Regras de fluxo devem ser atualizadas
em `frontend/scripts/support-guides.mjs` quando as funcionalidades correspondentes mudarem.

Testes: `npm run test:suporte` em `frontend` e `./mvnw.cmd test` em `backend`.
A integracao de IA e testada com um servidor simulado, sem chave real ou consumo de creditos.

## Sessao compartilhada na navegacao

O cabecalho usa `frontend/public/js/portal-session.js` para consultar `/api/auth/me`
com o cookie da sessao e sem cache. As 20 paginas mostram a conta conectada e Sair,
ou Login quando o servidor confirma que nao existe sessao. Navegar ou atualizar uma
pagina preserva o acesso; retornar a aba revalida a conta. Falhas de rede nao apagam
uma conta ja identificada. Sair confirma o encerramento no servidor antes de redirecionar.
As permissoes continuam sendo verificadas pela API; credenciais nao ficam no armazenamento
do navegador. A sessao permanece sujeita a expiracao normal do servidor.

Testes: `npm run test:sessao` em `frontend`.

## Fotos oficiais automaticas

A API consulta a [categoria Esportes da Prefeitura de Betim](https://www.betim.mg.gov.br/portal/noticias/3/1/18/0/0/0)
e as buscas oficiais por modalidade ao iniciar e a cada hora. As fotos sao identificadas pelos
titulos/legendas, validadas e guardadas em `backend/data/fotos-oficiais`, com a noticia de origem.
As paginas principal, base, Futebol, Voleibol, Judo e Pilates consultam esse acervo a cada cinco
minutos e ao retornar a aba. Uma modalidade sem foto oficial identificada preserva as imagens atuais;
falhas de consulta preservam o ultimo acervo valido. Noticias e legendas acompanham suas fotos.

- `GET /api/fotos`: fotos, categorias e ultima consulta bem-sucedida.
- `GET /api/fotos/status`: andamento, intervalo, total e aviso da sincronizacao.
- `GET /api/fotos/imagens/{id}`: foto local validada, com cache no navegador.
- `POST /api/fotos/atualizar`: antecipa a consulta, exclusivo para administradores.

Em Arquivos, o cartao Fotos oficiais automaticas mostra o estado e permite Atualizar agora.
`FOTOS_SYNC_ENABLED=false` desativa a rotina; `FOTOS_SYNC_INTERVALO` define segundos (padrao 7200, ou seja, 2 horas;
minimo 300); `FOTOS_CACHE_DIR` define o armazenamento. No Docker, a pasta padrao fica no volume de dados.
A atualizacao depende de a API estar em execucao. Fontes indisponiveis sao tentadas novamente no proximo ciclo.

Testes: `npm run test:fotos` em `frontend` e `./mvnw.cmd test` em `backend`.

## Conquistas com atualização automática

`conquistas.html` consulta `/api/conquistas` ao abrir, a cada minuto e ao voltar à aba.
O backend consulta as três primeiras páginas da editoria Esportes da Prefeitura a cada hora,
com primeira busca cinco segundos após iniciar. Cada ciclo lê até 24 notícias candidatas.
O filtro considera títulos de resultados (medalhas, pódios, conquistas, campeões e recordes),
exclui anúncios de eventos futuros e aceita publicações oficiais a partir de 2025.
O filtro depende do texto dos títulos e da estrutura do site; não garante cobertura completa.

Novas notícias recebem cards com título oficial, resumo, data da publicação e fonte.
Menções a atletas já cadastrados acrescentam notícias às timelines, sem atribuir a eles
automaticamente todas as medalhas de uma notícia coletiva. Novos nomes ficam no título
oficial do card; a rotina não inventa perfis individuais. Os perfis continuam sem fotos.
As datas automáticas indicam publicação, não necessariamente o dia da competição.

- `GET /api/conquistas`: `{ atualizadoEm, conquistas: [{ id, titulo, resumo, publicadoEm, fonte, atletas }] }`.
- `GET /api/conquistas/status`: estado, horário, intervalo e aviso da última busca.
- `POST /api/conquistas/atualizar`: solicita nova busca; requer sessão de administrador.

O histórico é deduplicado pelo ID da notícia e salvo atomicamente em
`backend/data/conquistas-oficiais/acervo.json`. É recuperado após reiniciar e preservado
quando a fonte fica indisponível. Os destaques estáticos continuam disponíveis sem a API.
Os marcos automáticos são ordenados pela data de publicação.

A página exibe no máximo seis cards por ano, reunindo perfis originais e notícias importadas.
A seleção é recalculada em cada atualização: alcance internacional, nacional, estadual e local;
dentro do mesmo alcance, recordes, títulos/ouros, pratas e bronzes; depois publicação mais recente
e ID como desempate estável. É uma regra editorial baseada no texto, não um ranking oficial.
Notícias da mesma fonte dos perfis originais não geram cards repetidos. Cards que perdem posição
saem da seleção, mas o histórico completo da API e as timelines dos atletas são preservados.
Anos com menos de seis candidatos mostram apenas os registros disponíveis.

Variáveis: `CONQUISTAS_SYNC_ENABLED` (padrão `true`), `CONQUISTAS_SYNC_INTERVALO`
(segundos; padrão `3600`, mínimo `300`) e `CONQUISTAS_CACHE_DIR` (padrão
`./data/conquistas-oficiais`). O backend deve permanecer ligado e com acesso HTTPS à Prefeitura.

Testes: `node --test tests/conquistas*.test.mjs` em `frontend` e `./mvnw.cmd test` em `backend`.
