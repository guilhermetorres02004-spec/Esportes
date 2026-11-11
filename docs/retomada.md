# Registro de retomada — comando :return

## Objetivo ativo

Adaptar diretamente o portal existente aos padrões da equipe, em lotes pequenos,
preservando funcionalidades, APIs, sessão, banco e uploads. Usar sempre a skill
`.agents/skills/decompor-tarefas/SKILL.md` e perguntar antes de iniciar outro lote.

## Referências e decisões vigentes

- Padrões: `C:/Users/walter/Desktop/Sistemas/Desygn-sistem/.design-system`.
- Relatório e histórico: `docs/adaptacao-design-system.md`.
- Destino das mudanças: `frontend/` existente com Vite; piloto em `frontend/piloto/` não é o destino do trabalho.
- Último endereço confirmado do portal: `http://localhost:5174`; verificar disponibilidade ao retomar.
- Preferência explícita: cabeçalho azul, com marcas em `#023568` e navegação em `#0072e7`, em vez da faixa verde do kit.
- Preservar menus por hover, Login/Inscreva-se ocultos, seis conquistas por ano, notícias de Betim e descrição apenas no marco da timeline.
- Preservar o indicador de 1.452 medalhas e todas as integrações existentes.

## Último ponto concluído

- Home com atalhos de navegação, alvos focáveis, um h1 e uma única área principal.
- Cabeçalho compartilhado com ajustes de proporção dos logos, foco e legibilidade.
- Cabeçalho permanece azul conforme solicitado, com acentos dos painéis em azul.
- Barra de acessibilidade integrada às 21 páginas compartilhadas: A+, A−, Contraste e Restaurar.
- Preferências `fontSize` (70%–140%) e `theme` persistidas e aplicadas no head antes da renderização; funcionamento sem armazenamento e sincronização entre abas verificados.
- Alto contraste implementado como ponte CSS nas páginas atuais, sem inverter fotos ou vídeos. Ainda precisa de validação visual em navegador, incluindo formulários e mapa.
- Verificações atuais: 75 testes aprovados, build Vite aprovado e recursos servidos na porta 5174.
- Comando `:return` registrado em AGENTS.md e nos adaptadores para outros assistentes.
- O componente React oficial de acessibilidade permanece apenas no piloto; o site Vite usa uma adaptação compatível com a escala e as chaves do kit.

## Próximo lote ao receber :return ou autorização de continuidade

Adaptar o rodapé no portal existente, começando pela conferência dos contatos e
órgãos responsáveis e pela leitura do componente oficial. Não inventar dados de contato.

## Atualização adicional — runtime Java (11/11/2026)

- Backend atualizado para Java 25 LTS e Spring Boot 3.5.16, compatível com Java 25.
- Imagens de build e execução do backend atualizadas para Eclipse Temurin 25; README alinhado.
- Verificações: `clean test-compile` e `clean test` aprovados com Temurin 25.0.5; 71 testes passaram.
- Limitações: a validação CVE não pôde ser executada porque a ferramenta retornou indisponibilidade de modelo; Docker não está instalado/disponível para validar a imagem.
- Próximo passo deste ajuste: repetir a verificação CVE quando a ferramenta estiver disponível. O próximo lote da adaptação do portal permanece o rodapé descrito acima.

## Inicialização local — 11/11/2026

- Frontend iniciado com npm run dev -- --host 127.0.0.1 --port 5174; página inicial respondeu HTTP 200.
- API já existente na porta 8080 (PID 13476); /login respondeu HTTP 401. Tentativa de segunda instância encerrada por bloqueio do banco H2, sem encerrar a instância existente.
- Nenhuma mudança funcional solicitada; próximo lote de adaptação permanece o rodapé. Login autenticado não verificado.


## Cards de indicadores — 11/11/2026

- A pedido do usuário, os seis cards abaixo do carrossel seguem a composição da imagem: três colunas por duas linhas, círculos de ícones sobrepostos, cantos de 16px e conteúdo centralizado.
- Gradiente azul preserva a identidade vigente; os seis títulos e valores, incluindo 1.452 Medalhas, e o link para conquistas.html foram mantidos. Sem fotos, contagens ou destinos inventados.
- Alterados apenas Indicators em frontend/src/home/Sections.jsx e estilos locais em frontend/src/home/home.css, além deste registro. Grade com duas colunas abaixo de 768px e uma abaixo de 480px; foco visível, alto contraste e movimento reduzido contemplados.
- Verificações: 75 testes aprovados, build Vite aprovado e módulo atualizado servido com HTTP 200 na porta 5174.
- Limitação: navegador indisponível na sessão; apresentação em desktop/celular e escala de fonte ainda precisam de conferência visual.
- Próximo passo deste ajuste: conferir visualmente os cards com o usuário. O rodapé continua como lote separado, mediante autorização de continuidade.

## Altura do card Pilates — 11/11/2026

- Aplicado h-full ao painel interno do link Pilates em frontend/src/home/Sections.jsx; o painel passa a preencher a altura da célula da grade, acompanhando os cards vizinhos sem altura fixa.
- Texto, link e demais cards preservados. Build aprovado e utilitário .h-full com height:100% confirmado no CSS compilado.
- Validação visual ainda pendente por indisponibilidade do navegador nesta sessão. Próximo lote de adaptação permanece separado deste ajuste.

## Remoção de Esporte de Rendimento — 11/11/2026

- Removidos o componente Performance e sua renderização/importação na home existente.
- Retirada a entrada Rendimento do menu Programas e sua descrição; páginas individuais das modalidades preservadas.
- Catálogo do suporte regenerado sem a seção removida (67 referências); teste da home atualizado para verificar a ausência da seção e manter as demais verificações.
- Verificações: build Vite aprovado e 75 testes aprovados, zero falhas. Validação visual não executada por indisponibilidade do navegador na sessão.
- Pedido concluído; próximo lote geral permanece o rodapé, mediante autorização de continuidade.

## Escola de Esportes: pesquisa e carrossel — 11/11/2026

- Pesquisa aprofundada no site oficial documentada em docs/pesquisa-modalidades.md. A contagem oficial diverge: Programas informa 21 no PVE; relação por núcleo permite consolidar 20; notícias confirmam Natação e Ginástica Rítmica competitivas.
- Carrossel reúne 22 atividades documentadas, com as duas equipes competitivas identificadas. Não equivale a confirmar 22 turmas abertas da Escola. Tênis e Karatê anteriores não confirmados e substituídos pela relação pesquisada.
- SchoolCarousel.jsx integrado à seção Escola no portal existente; avanço de um card a cada 3 segundos, controles manuais, pausa, hover/foco, aba oculta e movimento reduzido; layout responsivo. Link oficial por núcleo incluído.
- Verificações: build aprovado; 76 testes na suíte geral e três testes adicionais do comportamento do carrossel aprovados (79 no total). Aparência/toque/animação em navegador não verificados, pois navegador indisponível.
- Próximo passo: conferir visualmente com o usuário e validar a lista administrativa caso seja necessário afirmar exatamente quais são as 22 modalidades da Escola. Rodapé permanece um lote separado.

## Rotação automática da Escola — 11/11/2026

- Ajustada conforme pedido explícito: inicia automaticamente a cada 3 segundos e continua com mouse/foco no carrossel. Pausar/Retomar funciona independentemente do foco no botão.
- Preferência por movimento reduzido mantém a troca automática, sem animação; aba oculta não avança. Este ajuste substitui a regra anterior de pausa por hover/foco/movimento reduzido.
- Verificações: nove testes de home/carrossel aprovados e build aprovado. Validação visual permanece pendente por navegador indisponível.
- Próximo passo: conferir a rotação no portal; nenhuma outra alteração neste lote.

## Carrossel sem botões e barra — 11/11/2026

- Removidos os três botões acima das modalidades e seus estilos. Barra de rolagem ocultada, preservando rolagem por toque/teclado e avanço automático a cada 3 segundos.
- Pausa/retomada acessível pela tecla espaço quando a lista recebe foco; instrução incluída no nome acessível.
- Verificações: nove testes de home/carrossel e build aprovados. Conferência visual em navegador permanece pendente.
- Próximo passo: conferir o resultado no portal; demais lotes aguardam orientação.

## Setas transparentes no carrossel — 11/11/2026

- Adicionadas setas anterior/próxima nas laterais, com fundo transparente e ícones discretos; ficam mais visíveis no hover/foco. Espaço lateral reservado para não cobrir cards.
- Rotação automática, barra oculta, modalidades e pausa por espaço preservadas. Botões com nomes acessíveis e foco visível.
- Verificações: nove testes de home/carrossel e build aprovados. Aparência em navegador ainda não verificada por indisponibilidade na sessão.
- Próximo passo: conferir visualmente as setas no portal; outros lotes aguardam orientação.

## Espaçamento das setas — 11/11/2026

- Reserva lateral do carrossel ampliada de 40px para 56px, criando 16px de distância entre cada seta e os cards.
- Alteração somente de espaçamento em home.css. Build aprovado; conferência visual em navegador permanece pendente.
- Próximo passo: conferir o espaçamento no portal; nenhuma outra alteração neste lote.

## Cards da Escola com páginas específicas — 11/11/2026

- Os 22 cards agora são links completos e distintos, com foco visível, preservando setas, distância de 16px, barra oculta e avanço automático.
- Catálogo central em frontend/public/js/escola-modalidades.js reúne nomes, ícones, destinos e núcleos confirmados. Reutilizados futebol.html, volei.html, pilates.html e detalhe-modalidade.html (Judô), sem editar seu conteúdo.
- Criadas 18 páginas HTML próprias para os demais destinos, com cabeçalho compartilhado, preferências de acessibilidade, título, núcleos oficiais quando publicados, fonte e retorno à Escola. Natação/Ginástica Rítmica mantêm identificação de equipe competitiva e não anunciam seleção aberta.
- Script frontend/scripts/create-school-pages.mjs cria somente páginas faltantes sem sobrescrever existentes. CSS das páginas em public/css/modalidade-escola.css; novas páginas são incluídas pelo mecanismo existente de cópia de HTML no build.
- Fontes: relação oficial por núcleo para 2026 e notícias já documentadas em docs/pesquisa-modalidades.md; horários, vagas e critérios específicos não foram inventados. Não houve alteração em APIs, banco ou páginas das modalidades já existentes.
- Verificações: 81 testes aprovados; build aprovado; os 22 destinos responderam HTTP 200, com conteúdo, e estão presentes no dist. Testes de sessão/preferências atualizados para as 39 páginas compartilhadas.
- Limitação: aparência e clique em navegador não verificados por indisponibilidade do navegador nesta sessão.
- Próximo passo: conferir visualmente os cards e as novas páginas; conteúdo mais detalhado por modalidade pode ser tratado em lote posterior mediante orientação.

## Cards laterais menores — 11/11/2026

- Escala dos cards calculada pela distância ao centro visível: 100% no centro e até 76% nas extremidades, simetricamente. Atualiza durante a rolagem e ao redimensionar.
- Avanço usa a largura real de layout para não ser afetado pela escala. No celular, alinhamento central com respiro lateral; links e setas preservados.
- Verificações: dez testes de home/carrossel aprovados, incluindo escala simétrica e avanço; build aprovado. Conferência visual permanece pendente por navegador indisponível.
- Próximo passo: conferir visualmente o destaque central com o usuário.

## Indicadores finais padronizados — 11/11/2026

- Seis cards finais adaptados aos tokens do portal: ícones e números azuis, fonte Karla sem itálico, cantos/sombra/borda institucionais e acento amarelo.
- Preservados todos os números e rótulos. Removida a proibição de quebra de linha; rótulos com largura limitada, quebra balanceada e tamanho de 1rem. Grade com seis colunas em telas largas, três/duas/uma conforme a largura.
- Alterados FinalIndicators em Sections.jsx e CSS local da home. Cinco testes da home e build aprovados.
- Limitação: encaixe visual real não conferido por navegador indisponível na sessão. Próximo passo: conferir no portal, incluindo escala de fonte ampliada.

## Viva o Esporte compacto — 11/11/2026

- Reduzidos espaçamento interno para 24px, título para 1,5–2rem e intervalos dos parágrafos; retirada a quebra forçada do título.
- Coluna de texto ocupa 60% no desktop para reduzir a altura sem cortar conteúdo. Altura mínima da foto reduzida de 500px para 320px no desktop e 280px em telas menores.
- Textos, imagem, créditos e fonte preservados. Cinco testes da home e build aprovados. Validação visual pendente por navegador indisponível.
- Próximo passo: conferir o tamanho do card no portal.

## API e rotação das fotos Viva o Esporte — 11/11/2026

- Nova rota pública GET /api/fotos/viva-esporte em FotosController: atualizadoEm, intervaloSegundos=9 e até cinco fotos únicas da categoria atividades, aproveitando o acervo oficial já validado/cacheado da Prefeitura. Sem consultas externas a cada troca.
- VivaPhotos.jsx integrado ao card compacto: seleção validada, troca a cada 9000ms, créditos/link sincronizados com a foto, botão de pausa, sem avanço em aba oculta, consulta da seleção a cada cinco minutos. Mantém a seleção em erro de rede, remove imagens que falham e usa a imagem oficial original quando não há opções.
- Nova API ativada reiniciando somente o processo Java local identificado como PortalEsporteApplication; banco existente preservado.
- Verificações: cinco testes FotosApiTest aprovados; 85 testes frontend aprovados; build aprovado. API pelo proxy 5174 retornou HTTP 200, cinco fotos e intervalo 9; as cinco imagens tiveram HTTP 200 e tipo image/*.
- Uma verificação antiga do frontend esperava atributos do componente anterior; atualizada para verificar a integração VivaPhotos e a nova rota, com suíte completa aprovada após ajuste.
- Limitação: rotação visual em navegador não conferida por navegador indisponível. Próximo passo: conferir as fotos no card e seus créditos; demais lotes separados.

## Viva o Esporte com overlay e desfoque — 11/11/2026

- Card passou de duas colunas para foto oficial cobrindo o fundo; texto branco à esquerda sobre gradiente azul e desfoque suave com máscara que desaparece em direção à direita, conforme referência do usuário.
- Todo o texto foi preservado. Em telas menores, a camada azul cobre a largura para manter legibilidade; créditos ficam abaixo do texto e a pausa permanece no topo direito. Alto contraste com fundo preto sem desfoque.
- Alteração somente no CSS da home; API, seleção de até cinco fotos, intervalo de nove segundos e créditos preservados.
- Verificações: oito testes de home/fotos e build aprovados. Conferência visual pendente por navegador indisponível na sessão.
- Próximo passo: conferir overlay, enquadramento e legibilidade no portal.

## Remoção do botão Pausar fotos — 11/11/2026

- Removidos botão e estado de pausa em VivaPhotos.jsx, além dos estilos exclusivos do botão. Rotação automática a cada nove segundos e créditos preservados.
- Ajustados os testes para o comportamento solicitado sem pausa manual. Oito testes de home/fotos e build aprovados.
- Conferência visual permanece pendente por navegador indisponível. Próximo passo: conferir o card no portal.

## Páginas das modalidades no modelo Futebol — 11/11/2026

- As 18 páginas novas passaram do modelo simples para a composição de futebol.html: destaque azul com título, conteúdo em duas colunas no desktop, galeria oficial, núcleos publicados e painel lateral de participação/agenda.
- Galerias conectadas ao mecanismo existente /api/fotos pela categoria específica; quando o acervo não possui fotos da modalidade, mantém mensagem informativa, sem fotos de outras práticas.
- Mantidos os 22 links distintos. Futebol, Vôlei e Pilates já usam a organização de referência e foram preservados; Judô recebeu destaque azul compatível, preservando suas seções e galeria.
- Informações específicas existentes e fontes preservadas. Para modalidades não suportadas pela ficha local, participação encaminha à fonte oficial, sem inventar matrícula, horários ou vagas.
- create-school-pages.mjs aceita --refresh somente para páginas com o CSS deste modelo, preservando páginas legadas. Modelo e estilos em public/css/modalidade-escola.css atualizados.
- Verificações: build e 85 testes aprovados; 22 destinos com HTTP 200 e presentes no dist. Teste das novas páginas confere galeria, painel lateral e agenda.
- Limitação: apresentação em navegador não conferida por indisponibilidade na sessão. Próximo passo: conferir visualmente as páginas e detalhar conteúdo conforme dados oficiais disponíveis.

## Menu Modalidades ampliado — 11/11/2026

- Adicionados Futsal e Basquete ao menu compartilhado, com links às páginas específicas e descrições no padrão existente.
- Adicionada opção Ver todas ao final do menu, direcionando a /#escola na página principal, onde estão as 22 modalidades.
- Verificações: cinco testes do cabeçalho aprovados, incluindo novos destinos e ordem de Ver todas; build aprovado.
- Conferência visual pendente por navegador indisponível. Próximo passo: conferir o menu nas páginas do portal.

## Consultar participação em nova aba — 11/11/2026

- Os 16 links Consultar participação das páginas dedicadas agora usam target=_blank e rel=noopener noreferrer, mantendo o destino oficial e a página da modalidade aberta.
- Modelo create-school-pages.mjs atualizado para preservar a regra nas próximas gerações; links Consultar a equipe e Ver agenda não alterados.
- Verificações: sintaxe do gerador, teste dos 22 destinos e build aprovados. Conferência visual pendente por navegador indisponível.
- Próximo passo: conferir a abertura da fonte oficial pelo botão de participação.

## Modalidades migradas para React e URLs sem extensão — 11/11/2026

- As 22 páginas são renderizadas por src/modalidades/ModalidadePage.jsx, usando catálogo e rotas em src/modalidades/. Cards, menu e links internos das modalidades agora usam caminhos sem .html, incluindo /futebol, /volei, /judo, /futsal e /basquete.
- Conteúdo existente convertido em árvore declarativa content.json; sem iframe, HTML injetado ou execução de scripts legados. HTMLs de origem preservados como fonte editorial na transição; script build-modality-react.mjs integrado ao predev/prebuild.
- Galerias/fotos oficiais usam componentes React. Mapa do Futebol preserva os oito núcleos e links de mapas, com ciclo de vida React. Inscrição e participação em nova aba preservadas.
- Middleware Vite e preparação de rotas no build suportam acesso direto e links antigos; Nginx configurado com redirecionamentos de 22 URLs .html e resolução das entradas React. Demais rotas mantidas.
- Verificações: build aprovado; 89 testes aprovados, incluindo renderização das 22 páginas, normalização de URL com parâmetros/fragmentos e mapa. HTTP 200 das 22 rotas e redirecionamento dos 22 endereços antigos verificados em Vite 5174 e preview 5175.
- Corrigido retorno indevido do hook de configuração do middleware, identificado ao iniciar Vite; servidor iniciado e rotas verificadas após a correção.
- Limitações: Nginx não executado; aparência, foco e navegação em navegador permanecem sem conferência visual por navegador indisponível.
- Documentação: docs/modalidades-react.md. Próximo passo: conferir visualmente as páginas React e navegação; outros lotes aguardam orientação.

## Libras no portal existente — 11/11/2026

- Integrado VLibras pelo cabeçalho compartilhado, abrangendo home, 22 modalidades React e páginas internas existentes. Não foi alterado o piloto.
- Carregador assíncrono public/js/portal-libras.js adiciona uma única instância do script oficial https://vlibras.gov.br/app/vlibras-plugin.js. Integração conforme documentação atual do Widget 7, com inicialização automática, sem construtor duplicado.
- Foco do botão configurado pelas variáveis oficiais; falha de carregamento gera aviso acessível na barra sem bloquear o portal.
- Verificações: 92 testes aprovados e build aprovado. Testes cobrem carregamento único, falha e integração pelo shell compartilhado.
- Referência: https://vlibras.gov.br/doc/widget/installation/webpageintegration.html . Botão flutuante disponibiliza tradução automática para Libras pelo serviço oficial.
- Limitação: abertura do avatar, tradução e operação real do serviço ainda precisam de validação visual por navegador indisponível nesta sessão.
- Próximo passo: conferir o botão de Libras no portal e testar a tradução com o usuário.

## Opção Ver todas simplificada — 11/11/2026

- Ver todas no menu Modalidades agora permanece como texto simples em azul #0072e7, sem descrição adicional. Destino /#escola preservado.
- Alterados portal-header.js e portal-base.css. Cinco testes do cabeçalho e build aprovados; conferência visual pendente.

## Esporte nas Regionais — página do card Cobertura — 11/11/2026

- Implementada /esporte-nas-regionais em React no portal existente e vinculada ao card Cobertura. Cabeçalho, rodapé, VLibras e identidade preservados; nenhum site paralelo criado.
- Referência oficial consultada nas dez regionais. Importados 30 equipamentos, duas entradas de programas/entidades e 20 fotos reais. Fotos de exemplo excluídas; imagens reduzidas de cerca de 37 MB para 1,4 MB.
- Navegação por dez cards, seleção com URL, cinco filtros combináveis, cards de equipamentos, detalhes em modal, Google Maps por endereço, seção regional, programas, eventos cadastrados e galeria. Estados de carregamento, erro, ausência de resultados e campos pendentes contemplados.
- Sem GeoJSON ou coordenadas oficiais acessíveis: utilizada a alternativa por cards expressamente prevista no prompt, sem fronteiras ou localizações estimadas. Componente de mapa preparado para pontos com coordenadas confirmadas.
- Nova API GET /api/regionais/catalogo pública e POST restrita a ADMIN. Painel de edição JSON disponível na página somente para sessão administrativa. Validação de fontes/vínculos/imagens/coordenadas e persistência em arquivo atômico, sem alterar esquema do banco existente.
- Backend local reiniciado para ativar a rota. Verificações: 96 testes frontend, 78 backend e build aprovados; HTTP 200 da página/API e 20 imagens; POST sem login retornou 401.
- Limitações: endereços incompletos, horários, acessibilidade, fotos e eventos não confirmados continuam ausentes ou sinalizados. Algumas classificações territoriais da fonte merecem revisão municipal, sem correção por inferência. Conferência visual de filtros, modal e responsividade não executada por navegador indisponível.
- Detalhes de fontes, importação, atualização administrativa e critérios em docs/esporte-nas-regionais.md.
- Próximo passo: conferir visualmente com o usuário e obter GeoJSON/coords oficiais para ampliar o mapa, mediante novo lote autorizado.

## Título do card Núcleos — 11/11/2026

- Renomeado Cobertura para Núcleos, incluindo nome acessível. Valor 10 Regionais e destino /esporte-nas-regionais preservados.

- Verificação: nove testes de home/regionais aprovados. Alteração textual; conferência visual pendente.

## Publicação da versão 1.2 — 11/11/2026

- Publicação solicitada explicitamente pelo usuário no GitHub guilhermetorres02004-spec/Esportes, branch master, com tag v1.2 e Release correspondente.
- Escopo preparado: portal existente, APIs, dados/fotos oficiais e documentação. Piloto antigo, vendor do piloto, configuração Yarn desse piloto, ajustes locais da IDE e hooks de modernização preservados fora do envio.
- Verificações finais repetidas: build aprovado; 96 testes frontend e 78 backend aprovados. Arquivos preparados conferidos sem tokens/chaves privadas detectados e diff sem erros de whitespace.
- Notas da versão em docs/releases/v1.2.md. Pendências visuais e de dados geográficos permanecem documentadas, sem bloqueio da publicação do código solicitado.
