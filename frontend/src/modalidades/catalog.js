export const fonteNucleos = 'https://www.betim.mg.gov.br/portal/secretarias-paginas/279/programa-viva-o-esporte/';
const h = 'Horto Municipal', r = 'Complexo Esportivo Riccardo Medioli';
const c = 'Galpão da Ginástica e Anexa (Caic)', a = 'Alterosa', p = 'Petrópolis';
const m = 'Ramacrisna', g = 'Anexo Horto (Girassol)';

// Nomes e oferta por núcleo: pesquisa documentada em docs/pesquisa-modalidades.md.
export const modalidadesEscola = [
    ['futsal', 'Futsal', 'fa-futbol', [h, r, a, p, m]],
    ['volei-quadra', 'Vôlei de Quadra', 'fa-volleyball-ball', [h, r, a, m], 'volei.html'],
    ['volei-praia', 'Vôlei de Praia', 'fa-volleyball-ball', [h]],
    ['handebol', 'Handebol', 'fa-futbol', [h]],
    ['basquete', 'Basquete', 'fa-basketball-ball', [h, r]],
    ['iniciacao-esportiva', 'Iniciação Esportiva', 'fa-child', [h, r, m]],
    ['atletismo', 'Atletismo', 'fa-running', [h, r]],
    ['atletismo-adaptado', 'Atletismo Adaptado (PCD/AFA)', 'fa-universal-access', [h, r]],
    ['taekwondo', 'Taekwondo', 'fa-fist-raised', [h, r, c, a]],
    ['hidroginastica', 'Hidroginástica', 'fa-water', [h, g]],
    ['pilates-solo', 'Pilates Solo', 'fa-person-walking', [h, r, a], 'pilates.html'],
    ['ginastica-para-todos', 'Ginástica para Todos', 'fa-users', [h, r, c, p, g]],
    ['lian-gong', 'Lian Gong', 'fa-spa', [h]],
    ['futebol-campo', 'Futebol de Campo', 'fa-futbol', [r], 'futebol.html'],
    ['bale', 'Balé', 'fa-music', [r]],
    ['judo', 'Judô', 'fa-fist-raised', [r, p, m], 'detalhe-modalidade.html'],
    ['zumba', 'Zumba', 'fa-music', [r]],
    ['ginastica-artistica', 'Ginástica Artística', 'fa-child', [c]],
    ['xadrez', 'Xadrez', 'fa-chess', [m]],
    ['bicicross', 'Bicicross', 'fa-bicycle', ['Pista de Bicicross']],
    ['natacao', 'Natação', 'fa-swimmer', [], null, 'https://www.betim.mg.gov.br/portal/noticias/0/3/15253/betim-abre-nova-seletiva-para-reforcar-equipe-de-natacao-de-alto-rendimento'],
    ['ginastica-ritmica', 'Ginástica Rítmica', 'fa-child', [], null, 'https://www.betim.mg.gov.br/portal/noticias/0/3/15518/prefeitura-de-betim-distribui-as-camisas-oficiais-para-o-jeb-e-prepara-para-cerimonia-de-abertura-dos-jogos/'],
].map(([id, nome, icon, nucleos, existente, noticia]) => ({
    id, nome, icon, nucleos, existente, legacyHref: existente || `${id}.html`,
    href: `/${existente === 'detalhe-modalidade.html' ? 'judo' : existente ? existente.replace('.html', '') : id}`,
    tipo: noticia ? 'Equipe competitiva' : null, fonte: noticia || fonteNucleos,
}));
