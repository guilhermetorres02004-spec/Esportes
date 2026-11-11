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
- Preservar menus por hover, Inscreva-se oculto e botão Entrar visível para visitantes, seis conquistas por ano, notícias de Betim e descrição apenas no marco da timeline.
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
- Publicação confirmada: commit f02aa2170acdee1a8b0cdb67278ba4de1afaa5e0 enviado à master e tag anotada v1.2; Release pública criada em https://github.com/guilhermetorres02004-spec/Esportes/releases/tag/v1.2 . Referências remotas conferidas após envio.

## Pequenos saltos nos ícones da home — 11/11/2026

- Ícones circulares dos seis indicadores da home receberam dois saltos discretos (5px e 2px) em ciclo de 3,6 segundos, com início escalonado entre os cards.
- Centralização dos círculos preservada; animação desativada para prefers-reduced-motion. Alteração somente em home.css, sem envio adicional ao GitHub solicitado.
- Verificação: build aprovado. Conferência visual permanece pendente por navegador indisponível.
- Próximo passo: conferir a intensidade dos saltos no portal.

## Núcleos com Google Maps e seleção prévia — 11/11/2026

- Entrada da página agora mostra Google Maps de Betim e botões das dez regionais; informações, filtros, equipamentos, programas, eventos e fotos somente após seleção válida. Limpar filtros mantém a regional; Escolher outra regional retorna ao estado inicial.
- Mapa integrado consulta o endereço publicado da administração regional selecionada, sem coordenadas inferidas ou fronteiras desenhadas. Referências em src/regionais/mapas-regionais.js; cada equipamento preserva seu próprio Como chegar.
- Google Maps incorporado verificado por HTTP 200 e redirecionamento ao endpoint /maps/embed. Botão de abertura externa e aviso de falha disponíveis. GeoJSON municipal consultado continua indisponível.
- Verificações: cinco testes específicos e build aprovados; suíte completa final com 97 testes aprovados. Renders verificam ausência de dados antes da seleção e dados exclusivos do Centro após selecionar; endereços das dez regionais testados nas consultas do Maps.
- Limitação: interação real com o iframe e conferência visual pendentes por navegador indisponível. Alterações locais, sem novo envio ao GitHub solicitado.
- Próximo passo: conferir o mapa e seleção no portal com o usuário.

## Dez pins pré-definidos nas regionais — 11/11/2026

- Usuário escolheu explicitamente usar o mapa interativo do portal com links para Google Maps. RegionalMap usa Leaflet existente e mostra dez pins desde a abertura.
- Pins nomeados e acessíveis por teclado; clique escolhe a regional, destaca o pin em amarelo e revela as informações, preservando a regra de seleção prévia. Botões regionais seguem como alternativa.
- Pontos das dez relações administrativas do OpenStreetMap confirmados via Nominatim em consultas pontuais, identificadas, limitadas e cacheadas. Não são sedes exatas nem fronteiras oficiais; precisão explicitada na interface. Centro usa a referência Sede do OSM. Tentativas de endereço ambíguas não foram usadas como posição.
- Dados e proveniência em src/regionais/pins-regionais.json; respostas de pesquisa em docs/regionais-geocodificacao.json. Nenhuma consulta de geocodificação é feita a cada visita.
- Verificações: oito testes específicos de pins/regionais e build aprovados; suíte frontend completa com 100 testes aprovados. Mocks verificam dez marcadores, IDs de clique, destaque e desmontagem.
- Limitação: aparência dos pins e navegação real em navegador ainda pendentes por navegador indisponível. Alterações locais, sem novo envio ao GitHub solicitado.
- Próximo passo: conferir pins e seleção no mapa com o usuário.
## Zoom e pins dos equipamentos — 11/11/2026

- Selecionar uma regional aproxima o mapa e mostra seus equipamentos com posição confirmada. Clicar no equipamento amplia até zoom 16 e abre balão com foto (quando disponível), nome, categoria, regional/bairro, descrição e botão Conhecer espaço, ligado ao modal existente.
- Pins com cores e ícones por categoria: campo, quadra, praça/parque, complexo e pista. Legenda sobre o mapa, com adaptação para telas pequenas.
- Nove dos 30 equipamentos receberam referências verificadas no OpenStreetMap; os outros 21 continuam na lista e são sinalizados como pendentes de coordenadas, sem posições inventadas. Proveniência e precisão em frontend/src/regionais/equipamentos-pins.json; pesquisa cacheada em docs/equipamentos-geocodificacao.json. Resultados ambíguos foram descartados; consultas complementares ao Overpass falharam por indisponibilidade.
- Verificação final: 102 testes frontend e build aprovados. Testes cobrem classificação, ausência de coordenadas, zoom, conteúdo do balão e abertura dos detalhes. Conferência visual e interação real continuam pendentes por navegador indisponível nesta sessão.
- Alterações locais, sem novo envio ao GitHub. Próximo passo: conferir visualmente e obter coordenadas confirmadas para os 21 locais restantes.

## Cliques sem zoom automático — 11/11/2026

- Conforme nova orientação, selecionar regionais ou clicar em equipamentos preserva o zoom atual. Removidos os reenquadramentos automáticos após a seleção; o enquadramento inicial das dez regionais permanece.
- Balões, pins e abertura dos detalhes preservados. Texto de orientação atualizado.
- Verificação: dez testes de pins/regionais aprovados, incluindo ausência de setView e de fitBounds adicional ao selecionar ou abrir um local. Conferência visual pendente por navegador indisponível.
## Espaçamento dos nomes no mapa — 11/11/2026

- Ampliada a altura do mapa no desktop de 480 para 640px e permitido enquadramento inicial até zoom 13, preservando todos os pontos no enquadramento.
- Rótulos de Alterosas, Imbiruçu, Teresópolis e PTB distribuídos nas laterais dos pins para reduzir a sobreposição no trecho central. Cliques continuam sem alterar o zoom.
- Verificação: dez testes de pins/regionais aprovados. Ajuste visual ainda requer conferência no navegador, indisponível nesta sessão.

## Mapa fixo sem navegação manual — 11/11/2026

- Desativados arraste, gestos de zoom, duplo clique, seleção de área, navegação pelo teclado e controles de zoom. Pins continuam acessíveis por teclado e clicáveis.
- Desativado deslocamento automático ao focar pins ou abrir balões, preservando o enquadramento inicial.
- Verificação: testes de pins/regionais executados após alteração; conferência visual no navegador permanece pendente.

## Balão legível e fechamento no segundo clique — 11/11/2026

- Balão dos equipamentos reposicionado no topo central do mapa, com largura responsiva, altura limitada e rolagem interna para evitar corte da foto e dos textos nas bordas. Fundo branco, contraste explícito e quebra de títulos longos.
- Removido o handler que reabria o balão após o fechamento nativo do Leaflet: segundo clique no mesmo ícone agora alterna o fechamento. Mapa continua fixo.
- Verificação: dez testes de pins/regionais aprovados, incluindo segundo clique. Conferência visual no navegador permanece pendente nesta sessão.

## Página de conquistas em React — 11/11/2026

- Criada ConquistasPage em React na rota /conquistas, preservando apresentação, nove perfis, fontes, linhas do tempo em diálogo nativo, foco e bloqueio de rolagem durante o perfil.
- Consulta da API /api/conquistas migrada para effect com cancelamento e limpeza de timer/listener. Mantidos intervalo de um minuto, pausa em aba oculta, validação, fallback local e seleção de até seis destaques por ano com regras existentes.
- Cards iniciais extraídos do HTML existente para src/conquistas/cards.json; script scripts/extract-conquistas.mjs permite repetir a extração. HTML original e scripts legados preservados como referência, sem execução na rota React.
- Link da home usa /conquistas. Desenvolvimento/preview e build atendem rota limpa; conquistas.html redireciona mantendo consulta e fragmento no build. Cabeçalho compartilhado e acessibilidade permanecem na entrada do portal.
- Verificação: build e 104 testes frontend aprovados, incluindo renderização dos nove perfis e entradas publicadas. Conferência visual e operação real dos diálogos em navegador permanecem pendentes nesta sessão. Sem novo envio ao GitHub.

## Imagem do troféu em conquistas — 11/11/2026

- Imagem enviada pelo usuário adicionada ao destaque da página React /conquistas, substituindo a foto anterior de atletismo. Mantida proporção original e descrição acessível; retirada legenda que atribuía a imagem anterior à Prefeitura.
- Arquivo local em frontend/public/Imagens/conquistas/trofeu-destaque-esportivo-betim.png. Verificação de tamanho da cópia: 2.229.316 bytes; testes React de conquistas executados após alteração.

## Padronização visual de conquistas — 11/11/2026

- Aplicados tokens existentes de largura, superfícies, bordas, raios e sombras na página React. Destaque azul institucional com troféu preservado, tipografia Montserrat/Karla e navegação por anos com alvos de pelo menos 44px.
- Cards com bordas discretas, títulos azuis, textos ajustáveis e botões azuis. Diálogo com linha do tempo azul, foco visível, fechamento de 44px e disposição em uma coluna para datas/textos em telas pequenas.
- Incluído rodapé institucional compartilhado. Estilos específicos em frontend/src/conquistas/conquistas.css; API, nove perfis, seleção por relevância e rotas preservados.
- Verificação: build e 104 testes frontend aprovados. Conferência visual/responsiva no navegador permanece pendente por indisponibilidade nesta sessão. Alterações locais, sem publicação.

## Atalho :skill com padrões e React para as IAs — 11/11/2026

- Criada referência comum docs/padroes-portal.md com identidade visual, componentes compartilhados, acessibilidade, rotas React e critérios de continuidade.
- AGENTS.md e a skill local decompor-tarefas agora incluem essa referência ao ativar :skill. Entradas de Copilot, Claude, Gemini e Cursor apontam para as mesmas regras; Codex segue AGENTS.md.
- Registrado o estado real: home, 22 modalidades, Núcleos e Conquistas já em React. Páginas legadas devem ser adaptadas quando estiverem no escopo, sem declarar migração global concluída nem recriar o portal.
- Alteração somente de instruções; não modifica páginas ou instala extensões. Aplicação depende de cada ferramenta carregar suas instruções locais. Verificados caminhos de referência e consistência das cinco entradas.

## Atalho :commit com versão sequencial — 11/11/2026

- Definido em AGENTS.md e referenciado nas entradas de Copilot, Claude, Gemini e Cursor. Invocar :commit autoriza commit local e tag anotada v1.N, incrementando o inteiro da maior tag da série, com revisão, verificações e notas de versão.
- Tags locais verificadas neste momento: v1.1 e v1.2; a próxima local seria v1.3, sujeita à consulta remota ao executar o atalho. Sequência numérica prevê v1.9 → v1.10.
- Sem alterações, não cria versão vazia. Não inclui automaticamente arquivos locais excluídos anteriormente, segredos ou dados operacionais. Push/Release/deploy exigem pedido adicional.
- Verificação documental: referências do atalho conferidas nas cinco entradas; nenhum commit, tag ou envio executado durante a criação do comando.

## Skills externas para atalhos — 11/11/2026

- Criadas três skills independentes em `C:\Users\walter\Desktop\skills`: `decompor-tarefas` (`:skill`), `retomada` (`:return`) e `commit` (`:commit`).
- Cada pasta contém um `SKILL.md` com frontmatter e instruções adaptadas das regras vigentes; os arquivos de instrução originais não foram alterados nesta tarefa.
- Conferidos os três arquivos, nomes, frontmatter e regras essenciais. A instalação/configuração para descoberta automática pela ferramenta não foi solicitada nem realizada.

## Limpeza de logs de testes — 11/11/2026

- Removidos da raiz 15 logs temporários com nomes `*-tests.log`: saídas de execuções Node.js e Maven sem referências no código/documentação e já ignoradas pela regra `*.log`.
- Não foram removidos logs de runtime. `regionais-runtime.log` e `viva-api-runtime.log` permaneceram presentes na verificação final.
- Verificação: nenhum arquivo `*tests.log` restou na raiz. Os logs foram descartados como saídas reproduzíveis de testes; não houve alteração de código nem execução de testes.

## Topo da página ao recarregar — 11/11/2026

- Em `frontend/public/js/section-navigation.js`, uma recarga manual agora desativa a restauração automática do scroll até o evento `load`, força a página ao topo e depois restaura a preferência anterior do navegador.
- O fragmento não reposiciona a página durante essa recarga; depois de `load`, os eventos de fragmento voltam a navegar normalmente. Navegações sem recarga preservam o comportamento anterior.
- Testes: `node --test tests/section-navigation.test.mjs` (2/2); suíte frontend (`node --test tests/*.test.mjs`, 106/106); `npm run build` concluído. Desenvolvimento serviu `/` e `/js/section-navigation.js` com HTTP 200.
- Próximo passo deste ajuste: confirmar no navegador que uma recarga manual feita após rolar a página retorna ao topo; a sessão não forneceu ferramenta de interação com navegador.

## Entrada de usuário no cabeçalho — 11/11/2026

- Ativado o acesso existente `login.html` para visitantes e apresentado como botão “Entrar”, com ícone decorativo e cápsula branca no cabeçalho azul institucional.
- A área de inscrição segue desativada; autenticação, verificação de sessão, saída e ocultação do acesso para usuário autenticado permanecem no fluxo existente.
- Verificações: testes de cabeçalho e sessão 14/14; suíte frontend 107/107; build de produção concluído; `/js/portal-header.js`, `/css/portal-base.css` e `/login.html` responderam HTTP 200 no servidor local.
- Conferência visual interativa em navegador não realizada nesta sessão.

## Posicionamento do botão Entrar — 11/11/2026

- Movido o botão “Entrar” da navegação azul para a faixa superior, à direita do título “Portal do Esporte”, preservando o mesmo link, identificador e controle de sessão.
- A cápsula branca mantém alvo mínimo de 44px e agora tem foco visível contrastante; em telas menores fica no canto superior direito, sem alterar a lógica de inscrição ou autenticação.
- Verificações: testes de cabeçalho e sessão 14/14; suíte frontend 107/107; `npm run build` concluído. A conferência visual interativa não foi realizada nesta sessão.
## Login React e conferência das skills exportadas — 11/11/2026

- Página de login migrada para React em /entrar, com estilos do portal: azul institucional, Montserrat/Karla, raios e sombras compartilhados, foto local e rodapé institucional. Formulário responsivo com labels, autocomplete, foco no erro, indicação de envio e bloqueio de duplicação.
- Preservados POST /login, conteúdo form-urlencoded, cookie de sessão e destinos administrativos existentes. Destino proxima aceita somente agendamento-quadras.html; demais valores seguem para administrativo.html. Requisição tem timeout e cancelamento ao desmontar. Sem armazenamento de senhas no navegador.
- login.html redireciona para /entrar preservando query/fragmento no build; desenvolvimento/preview atendem ambas as entradas. Endpoint /login e backend preservados. HTML original permanece como referência.
- Build e 111 testes frontend aprovados. HTTP 200 de /entrar e redirecionamento do login antigo com proxima confirmados. Login real com credenciais e conferência visual não executados nesta sessão.
- Conferida a pasta C:/Users/walter/Desktop/skills: já contém decompor-tarefas, retomada e commit, cada uma com SKILL.md e regras correspondentes aos atalhos. Arquivos existentes preservados; diretório externo não é incluído automaticamente no Git nem instalado automaticamente nas ferramentas.
- Sem commit ou publicação. Próximo passo: conferir visualmente o login e validar acesso em ambiente autorizado com credenciais do usuário.

## Marcas no cabeçalho fixo ao rolar — 11/11/2026

- Adicionadas marcas compactas na navegação compartilhada: Prefeitura à esquerda dos menus; Fundação Beta imediatamente à esquerda de Portais. Permanecem ocultas enquanto a faixa superior das marcas está visível.
- Script portal-header-scroll.js observa a saída da faixa superior com IntersectionObserver, com alternativa de scroll passivo; atualiza também no resize e pageshow. Voltar ao topo oculta as marcas compactas. Links ocultos ficam fora da navegação por teclado.
- Entrada com deslocamento de 8px e opacidade em 280ms; prefers-reduced-motion remove a animação. Em telas menores, menus ficam em linha própria para acomodar as marcas.
- Oito testes específicos de cabeçalho aprovados, incluindo saída/retorno da faixa e alternativa sem IntersectionObserver. Conferência visual no navegador permanece pendente nesta sessão. Sem publicação.

## Atalho :adpte para padronização e React — 11/11/2026

- Criada .agents/skills/adpte/SKILL.md e registrada em AGENTS.md, Copilot, Claude, Gemini e Cursor. Uso: :adpte seguido de página, arquivo ou rota; adapta aos padrões e migra para React, ou reutiliza o componente já migrado.
- Sem página explícita, usa somente destino inequívoco da tarefa ativa; caso contrário solicita o destino. Preserva conteúdo, APIs, sessão e compatibilidade das rotas, verifica a entrega e atualiza o registro. Não autoriza commit/publicação.
- Cópia adicionada a C:/Users/walter/Desktop/skills/adpte/SKILL.md, com hash idêntico ao arquivo local. Demais skills externas preservadas.
- Verificadas referências nas cinco entradas, metadados e caminhos da skill. Alteração somente de instruções; nenhuma página migrada nesta tarefa.

## Administrativo adaptado para React — 11/11/2026

- Pedido :adapte administrativo.html interpretado como invocação da skill adpte. Criada rota /administrativo com componentes AdminPage, AdminContent e AdminDocument, no frontend existente.
- Preservados sete cards de gestão, 12 opções de documentos, resumos/PDFs/fontes/ações, acesso ao agendamento, estrutura, quadro de cargos e valores da folha já existentes. Conteúdo migrado de forma declarativa pelo script scripts/extract-admin-react.mjs; scripts legados não são executados na rota React.
- Mantida guarda baseada em sessão válida de /api/auth/me com cookie, sem cache, timeout e limpeza ao desmontar. Não renderiza painel antes da validação; falha redireciona a /entrar. Revalida ao retornar à aba/página. Permissões e autenticação do backend preservadas.
- Aplicados identidade azul, tipografia e tokens do portal, cards de 16px, foco visível, botões de 44px, tabelas com rolagem horizontal quando necessário, diálogo nativo com retorno de foco e rodapé compartilhado.
- administrativo.html redireciona para a rota limpa em desenvolvimento/preview e build. Query e fragmento preservados pelo redirecionamento da saída; HTML original mantido como referência.
- Verificação: build e 118 testes frontend aprovados; testes novos cobrem sessão inválida, conteúdo oculto antes de autenticar, IDs dos documentos, tabelas, PDFs/resumos e entradas publicadas. HTTP 200 de /administrativo e redirecionamento legado com query confirmados.
- Limitação: acesso real com credenciais e conferência visual/responsiva do painel e diálogos não executados por navegador indisponível. Sem commit, publicação ou alteração de banco.

## Login retorna à home e libera Eventos/Gestão — 11/11/2026

- Após autenticar em /entrar, destino agora é sempre /, inclusive quando há proxima na URL. Substitui a orientação anterior de redirecionar ao administrativo/agendamento.
- Restaurados os dois menus antigos identificados no histórico: Eventos (agenda, detalhes e Horto) e Gestão (Administrativo, Arquivos, Downloads, Almoxarifado, Presença, Matrix Impact e Página Base). Usuário confirmou Gestão e o outro menu.
- Menus iniciam ocultos e são exibidos somente após sessão válida de /api/auth/me. Logout e sessão expirada ocultam e fecham os menus. Permissões das APIs permanecem no backend; exibir links não altera autorizações.
- Ajustada quebra da navegação autenticada nas larguras intermediárias para acomodar os itens. Mantidos cabeçalho azul, marcas no scroll e menus por hover/teclado.
- Verificação: build e 119 testes frontend aprovados, incluindo destinos, menus inicialmente ocultos, exibição autenticada, expiração e logout. Conferência visual e login com credenciais reais continuam pendentes nesta sessão. Sem publicação.

## Botão Sair no lugar de Entrar — 11/11/2026

- Movido o único botão Sair da navegação para a faixa superior, na mesma posição de Entrar. Reutiliza a classe da cápsula branca, alinhamento e regra responsiva; largura mínima de 110px em ambos mantém dimensões coerentes.
- Alternância segue a sessão existente: visitante vê Entrar, autenticado vê Sair. Preservados POST /logout, bloqueio durante envio e mensagens de falha; ícone de saída decorativo adicionado.
- Verificação de estrutura cobre Sair somente na faixa superior e ausência de IDs duplicados. Conferência visual no navegador permanece pendente.

## Inscrição no menu Gestão — 11/11/2026

- Adicionada opção Inscrição no menu Gestão, após Administrativo, apontando para /Inscricao.html existente. Mantida visibilidade do menu apenas com sessão válida; botão público Inscreva-se continua oculto.
- Verificação: testes de cabeçalho e sessão executados após a alteração.

## Inscrição adaptada para React — 11/11/2026

- Pedido :adapte inscricao.html aplicado com a skill adpte. Criados InscricaoPage, ImageConsent e TermText na rota /inscricao, com fontes, tokens, cards, botões azuis, labels associados, fieldsets e rodapé compartilhado. Bootstrap e scripts legados não são executados nessa rota.
- Preservados os 20 campos, cinco seções, quatro modalidades existentes e seus núcleos. Contexto por query modalidade e retorno para a modalidade mantidos. Conteúdo extraído de Inscricao.html por scripts/extract-inscricao-react.mjs; dados em src/inscricao/form-data.json.
- Preservadas máscara e validação dos CPFs opcionais do atleta/responsável. O termo de imagem mantém texto e versão 2026-11-04, sem autorização pré-marcada: sim=true, não=false, ausência=null. Retorno de foco, bloqueio de fechamento durante envio e recuperação de rolagem implementados no diálogo nativo.
- POST /api/inscricoes continua com JSON, cookie e dadosFicha completos. Confirma protocolo antes de limpar o formulário; erro mantém os dados e escolha. Bloqueio de duplicação, timeout de 20s e cancelamento ao desmontar; nenhum dado pessoal é salvo no armazenamento do navegador. Backend preservado.
- Menu Gestão aponta à rota limpa. Inscricao.html/inscricao.html continuam compatíveis em desenvolvimento/preview e build, mantendo modalidade e fragmento no redirecionamento.
- Verificação: build e 125 testes frontend aprovados. Novos testes cobrem CPF, três estados de autorização, payload, erros, protocolo, 20 campos, contextos e fluxo React com bloqueio de envio duplicado. HTTP 200 de /inscricao e redirecionamento antigo com modalidade confirmados.
- Limitação: conferência visual/responsiva e envio real com dados de inscrição não executados nesta sessão; não foram criados registros de teste no banco operacional. Sem commit/publicação.

## Inscrição conforme planilha Viva Esportes — 11/11/2026

- Página /inscricao reorganizada conforme Ficha_Inscricao_Programa_Viva_Esportes.xlsx fornecida pelo usuário, aba Ficha de Inscrição, A1:D40. Planilha original não modificada.
- Seis blocos preservados: participante, responsável, atividade, saúde/segurança, declaração e uso exclusivo da Secretaria. Agora 26 controles incluem aceite da declaração; adicionados e-mail, parentesco, telefones, turno, turma, emergência, condição/adaptação, data e nome de quem assina. Campos antigos ausentes no modelo foram substituídos.
- Responsável exigido quando menor de 18 anos; sexo sem seleção obrigatória; turnos e resposta de saúde seguem listas da planilha. Modalidade/núcleo aceitam texto livre com sugestões existentes, sem limitar Viva Esportes às quatro modalidades anteriores.
- Declaração de participação separada do uso de imagem, que continua opcional e sem seleção inicial. Área da Secretaria somente leitura: protocolo/data confirmados pela API; situação/servidor não inferidos. Não implementado editor administrativo desses campos.
- API e banco preservados. Campos completos em dadosFicha; e-mail também no campo próprio já suportado. Sem persistência de dados pessoais no navegador.
- Referência, mapeamento de células e adaptações em docs/ficha-viva-esportes.md. Script build-viva-form.mjs mantém a estrutura; extrator HTML antigo não sobrescreve a nova ficha.
- Verificação: build e 127 testes frontend aprovados. HTTP 200 da rota. Conferência visual e envio real continuam pendentes; nenhum registro inserido no banco operacional. Sem commit/publicação.

## Aplicação de :adpte na ficha Viva Esportes — 11/11/2026

- Revisada apresentação da página já em React: destaque azul institucional, título em duas linhas, etiqueta do portal e instruções com contraste sobre o fundo azul.
- Seções com numeração circular azul e títulos acessíveis; campos em duas colunas no desktop e uma no celular, com nomes/endereço/assinatura em largura ampliada. Inputs usam superfície branca e foco azul conforme padrão do portal.
- Ações finais em painel compartilhando bordas, raios e sombra dos cards; área exclusiva da Secretaria destacada com fundo suave e borda tracejada. Mantidos todos os 26 controles, seis blocos, consentimento e API.
- Verificação: build e 15 testes de inscrição aprovados. Conferência visual no navegador permanece pendente nesta sessão. Sem publicação.

## Preparação da versão 1.3 — 11/11/2026

- Atalho :commit solicitado. Tags locais e origin consultadas: maior v1.2; próxima versão v1.3. Branch master, sem arquivos staged anteriores à preparação.
- Escopo: mudanças do portal desde v1.2, componentes React, inscrição Viva Esportes, mapas, cabeçalho/sessão, imagens, testes e instruções. Excluídos ajustes .vscode, frontend/piloto, frontend/vendor e frontend/.yarnrc.yml, conforme orientação vigente.
- Verificação final repetida: build de produção e 127 testes frontend aprovados. Notas em docs/releases/v1.3.md, incluindo limitações visuais, dados geográficos pendentes e arquivos externos não incluídos.
- Preparar commit release: v1.3 e tag anotada local. Sem autorização de push/publicação neste pedido.
