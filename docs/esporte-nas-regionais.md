# Esporte nas Regionais

Página React integrada ao portal existente em `/esporte-nas-regionais`, acessível pelo card Cobertura. Cabeçalho compartilhado, VLibras, preferências visuais e rodapé institucional preservados.

## Dados e fontes

Consulta em 11/11/2026. A referência inicial foi `https://regionais.betim.digital/regional/centro/esporte`. Foram consultadas as dez páginas públicas de esporte: Centro, Norte, Alterosas, PTB, Icaivera, Citrolândia, Imbiruçu, Teresópolis, Petrovale e Vianópolis.

O catálogo público usado pelo próprio site municipal foi localizado em seu JavaScript estático. A importação faz somente análise sintática de literais, sem executar código remoto. O vínculo de cada equipamento com uma regional foi conferido nos cards renderizados das respectivas páginas. Não foi identificada uma API pública de leitura esportiva ou feed documentado; a API de solicitações encontrada no código não foi utilizada.

- 30 equipamentos, duas entradas de programas/entidades e 20 fotos reais importadas.
- Fotos de exemplo (`placehold.co`) não foram importadas. Locais sem fotografia mostram pendência de cadastro.
- Fotos redimensionadas e comprimidas localmente: cerca de 37 MB para 1,4 MB, com créditos para a fonte municipal.
- Bairros, nomes, endereços e classificação regional são reproduzidos como publicados. Alguns registros têm endereço incompleto ou associações territoriais que precisam de revisão municipal; não houve correção por suposição.
- A vinculação de um programa à página de uma regional significa que a plataforma o publica ali; não comprova turmas abertas ou execução em todos os bairros.
- Modalidades por equipamento são incluídas somente quando explicitamente mencionadas no nome/descrição. Demais horários, acessibilidade, coordenadas e eventos ficam ausentes ou marcados como pendentes.

Fontes complementares: `https://www.betim.mg.gov.br/portal/secretarias-paginas/279/programa-viva-o-esporte/` para consulta de participação por núcleo; `https://regionais.betim.digital/` para a lista atual das dez regionais.

## Mapa e alternativa prevista no pedido

Foi localizado o serviço geográfico municipal `https://zeus.betim.mg.gov.br/geoserver/gwc/demo`, com referência à camada REGIONAL. A consulta do serviço falhou; também não foi possível obter GetCapabilities do WFS. Nenhum limite territorial ou coordenada foi desenhado por estimativa.

A entrada mostra um Google Maps incorporado do município de Betim e os botões das dez regionais. As informações de núcleos, filtros, programas, eventos e galeria só aparecem após selecionar uma regional; o mapa passa a consultar o endereço oficial de sua administração. Essas referências não são limites territoriais. Cada equipamento mantém sua rota própria no Google Maps pelo nome e endereço publicados. Polígonos só devem ser integrados após validação do GeoJSON oficial.

## Uso e atualização

- Cinco filtros combináveis: regional, bairro, modalidade, tipo e programa.
- Detalhes em modal nativo, com fechamento por Escape e controle de foco do navegador.
- Seleção regional persistida no parâmetro `?regional=centro`, por exemplo.
- Estados de carregamento, erro, cópia local disponível e ausência de resultados.
- Seção da regional com modalidades publicadas, programas, eventos cadastrados e galeria de locais.
- Nenhum evento foi criado para preencher a seção vazia.

### API e painel administrativo

`GET /api/regionais/catalogo` é público. `POST /api/regionais/catalogo` exige sessão com papel ADMIN. O painel “Administrar catálogo de regionais” aparece no final da página somente para o administrador autenticado e permite editar o catálogo JSON.

O backend valida as dez regionais, IDs únicos, vínculos, fontes oficiais HTTPS, textos, imagens locais e coordenadas com fonte. Grava em arquivo temporário e substitui o catálogo de forma atômica quando suportado. O catálogo salvo persiste em `backend/data/regionais/catalogo.json` e tem precedência sobre a cópia inicial do classpath. Os testes usam pastas temporárias e banco em memória.

Campos de cada equipamento: `id`, ome`, `regionais`, `bairro`, `endereco`, `tipo`, `descricao`, `modalidades`, `programas`, `horarios`, `acessibilidade`, `coordenadas`, `foto` e `fonte`. Campos não confirmados permanecem ull` ou listas vazias. Para adicionar coordenadas, informe também `fonteCoordenadas`. Eventos e programas seguem a mesma base, com campos opcionais `data` e `orientacao`. Não inclua dados pessoais no catálogo público.

Para renovar a cópia inicial com a referência municipal, execute em `frontend`:

```powershell
node scripts/import-regionais.mjs
./scripts/optimize-regionais.ps1
```

Isso atualiza os dados iniciais e fotos; não sobrescreve o catálogo operacional salvo pelo administrador. Se a estrutura do site de origem mudar, a importação deve ser revista, sem substituir dados confirmados por inferências.

## Verificações

- 96 testes frontend e 78 testes backend aprovados; build aprovado.
- HTTP 200 na página e na API: dez regionais, 30 equipamentos e 20 imagens carregadas.
- POST sem login verificado com HTTP 401. Edição administrativa, rejeição de dados inválidos e persistência testadas em ambiente isolado.
- Rota incluída no build. Nginx já resolve a entrada sem extensão.
- Conferência visual, modal e mapa em navegador permanecem pendentes por indisponibilidade do navegador nesta sessão. Ausência de GeoJSON oficial e de dados de parte dos campos é registrada na interface.

## Pins pré-definidos — atualização de 11/11/2026

- Usuário autorizou o mapa interativo do portal (Leaflet/OpenStreetMap), mantendo abertura externa no Google Maps.
- Dez pins fixos, nomeados e clicáveis desde a entrada; clicar seleciona a regional e revela seus núcleos. Pin escolhido ganha destaque amarelo; botões continuam como alternativa acessível.
- Pontos extraídos das dez relações administrativas identificadas no OSM, em consulta pontual ao Nominatim. Centro corresponde à referência Sede do OSM. Coordenadas, fontes e precisão estão em frontend/src/regionais/pins-regionais.json.
- São pontos de referência das regionais, sem promessa de sede exata ou limites oficiais. Tentativas por vias foram descartadas por ambiguidade; não foram escolhidos trechos de rua arbitrários.
- Respostas de pesquisa guardadas em docs/regionais-geocodificacao.json; consultas limitadas a menos de uma por segundo e nenhuma geocodificação no navegador. Política: https://operations.osmfoundation.org/policies/nominatim/ . Atribuição OSM presente no mapa.
- Verificação: oito testes específicos e build aprovados; suíte completa final com 100 testes aprovados. Interação e aparência reais no navegador permanecem pendentes nesta sessão.
## Equipamentos no mapa — 11/11/2026

Ao selecionar a regional, o mapa enquadra os equipamentos com posição cadastrada. Seus pins usam ícones e cores por categoria; o clique aproxima até zoom 16 e abre um balão com foto, nome, categoria, localização e descrição. Conhecer espaço abre os detalhes existentes. A legenda aparece sobre o mapa em telas maiores e abaixo dele em telas pequenas.

Há nove equipamentos com referências verificadas no OpenStreetMap, registradas com fonte e precisão em `frontend/src/regionais/equipamentos-pins.json`. Os outros 21 permanecem disponíveis na lista e aguardam coordenadas confirmadas. O componente também aceita coordenadas válidas e acompanhadas de `fonteCoordenadas` no catálogo. Não há geocodificação durante a visita.

A pesquisa pontual está cacheada em `docs/equipamentos-geocodificacao.json`. Correspondências ambíguas foram descartadas; as consultas complementares ao Overpass retornaram indisponibilidade. Pontos de parques, complexos e edifícios são referências das estruturas, sem promessa de entrada exata.

Verificação: 102 testes frontend e build aprovados. Os testes verificam categorias, tratamento de locais sem coordenadas, zoom, balão e abertura de detalhes. A conferência visual em navegador permanece pendente por indisponibilidade nesta sessão.

## Atualização: distância preservada ao clicar — 11/11/2026

O usuário solicitou remover o zoom automático. O mapa mantém o zoom atual ao selecionar uma regional ou abrir um equipamento. Somente a abertura inicial enquadra as dez regionais; os cliques seguintes exibem pins e balões sem reenquadrar o mapa. Dez testes de pins/regionais aprovados.
