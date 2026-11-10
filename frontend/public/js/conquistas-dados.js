const noticia = (id, slug) => `https://www.betim.mg.gov.br/portal/noticias/0/3/${id}/${slug}`;
export const fontes = {
    inicio: noticia(14315, 'atleta-de-betim-vai-representar-o-brasil-no-campeonato-mundial-de-atletismo-na-australia'),
    mundial: noticia(14447, 'atleta-de-betim-conquista-prata-e-bronze-no-campeonato-mundial-de-atletismo-na-australia'),
    brasileiro: noticia(13861, 'atletas-do-atletismo-paralimpico-do-viva-o-esporte-se-destacam-no-campeonato-brasileiro-da-cbdi-e-conquistam-12-medalhas'),
    meeting: noticia(14727, 'atletas-de-betim-conquistam-11-medalhas-no-meeting-brasileiro-de-atletismo/'),
    open: noticia(15571, 'betim-conquista-oito-medalhas-no-open-internacional-de-atletismo'),
    jovens: noticia(14461, 'atletas-do-viva-o-esporte-conquistam-seis-medalhas-no-campeonato-brasileiro-de-jovens-circuito-loterias-caixa'),
    judo: noticia(15559, 'betim-e-campea-geral-da-35-copa-betim-open-de-judo/'),
    jemg2025: noticia(14253, 'atletas-paralimpicos-do-programa-viva-o-esporte-conquistam-11-medalhas-de-ouro-no-atletismo-na-etapa-estadual-do-jemg'),
    jemg2026: noticia(15562, 'betim-conquista-21-medalhas-no-jemg-paralimpico-e-garante-vaga-para-etapa-nacional'),
};
const marco = (data, titulo, texto, fonte) => ({ data, titulo, texto, fonte });
const fotoAtletismo = { src: '/Imagens/2026/atletismo-2026.jpg', alt: 'Delegação de atletismo de Betim no Open Internacional de 2026', legenda: 'Foto coletiva da delegação, não retrato individual. Prefeitura de Betim · 2026.', fonte: fontes.open };
const fotoJovens = { src: '/Imagens/conquistas/delegacao-2025.jpg', alt: 'Atletas e comissão de Betim no Campeonato Brasileiro de Jovens de 2025', legenda: 'Foto coletiva da delegação, não retrato individual. Prefeitura de Betim · 2025.', fonte: fontes.jovens };
export const campeoes = {
    raysa: { foto: { src: '/Imagens/conquistas/raysa-convocacao.jpg', alt: 'Raysa Mendonça em prova de lançamento de dardo', legenda: 'Raysa em competição. Foto publicada pela Prefeitura de Betim · 12/09/2025.', fonte: fontes.inicio }, marcos: [
        marco('2009', 'Início no Viva o Esporte', 'Entrada no programa esportivo de Betim, conforme a notícia de sua convocação para o Mundial.', 'inicio'),
        marco('OUT 2025', 'Pódio no Mundial Virtus', 'Duas pratas, no peso e no dardo, e bronze no disco, em Brisbane, na Austrália.', 'mundial'),
        marco('DEZ 2025', 'Quatro ouros no Meeting Brasileiro', 'Primeiro lugar nos 100 m e nas provas de disco, peso e dardo.', 'meeting'),
        marco('AGO 2026', 'Open Internacional CBDI', 'Dois ouros e duas pratas em São Caetano do Sul.', 'open'),
    ] },
    juliana: { foto: fotoAtletismo, marcos: [
        marco('ABR 2025', 'Campeonato Brasileiro CBDI', 'Bronze no dardo e no revezamento 4 × 100 m feminino.', 'brasileiro'),
        marco('DEZ 2025', 'Meeting Brasileiro', 'Bronze no lançamento de dardo, com 10,58 m.', 'meeting'),
        marco('AGO 2026', 'Open Internacional CBDI', 'Prata no lançamento de dardo.', 'open'),
    ] },
    brunielle: { foto: fotoAtletismo, marcos: [
        marco('AGO 2026', 'Open Internacional CBDI', 'Bronze nos 400 m e nos 800 m.', 'open'),
    ] },
    lucas: { foto: fotoAtletismo, marcos: [
        marco('ABR 2025', 'Campeonato Brasileiro CBDI', 'Ouro no disco e prata no dardo.', 'brasileiro'),
        marco('DEZ 2025', 'Meeting Brasileiro', 'Ouro no disco, com 21,91 m, e prata no dardo.', 'meeting'),
        marco('AGO 2026', 'Open Internacional CBDI', 'Bronze no lançamento de disco.', 'open'),
    ] },
    equipe: { foto: { src: '/Imagens/2026/judo-2026.jpg', alt: 'Equipe de judô de Betim na Copa Betim Open de 2026', legenda: 'Foto coletiva da equipe de judô. Prefeitura de Betim · 2026.', fonte: fontes.judo }, marcos: [
        marco('AGO 2026', 'Campeã da 35ª Copa Betim Open', 'A equipe conquistou 130 medalhas e somou 455 pontos, liderando entre 51 agremiações.', 'judo'),
    ] },
    eduardo: { foto: fotoJovens, marcos: [
        marco('OUT 2025', 'Campeão brasileiro de jovens', 'Ouro nos 100 m da classe T-71 Sub-20 e quinto lugar no peso.', 'jovens'),
    ] },
    joao: { foto: fotoJovens, marcos: [
        marco('OUT 2025', 'Dois pódios nacionais', 'Prata nos 200 m e 400 m, na classe T-37 Sub-20, e quinto lugar nos 100 m.', 'jovens'),
    ] },
    richard: { foto: fotoJovens, marcos: [
        marco('ABR 2025', 'Campeonato Brasileiro CBDI', 'Sexto lugar no salto em distância masculino II1.', 'brasileiro'),
        marco('OUT 2025', 'Prata no Brasileiro de Jovens', 'Salto de 5,27 m na classe F-20 Sub-23.', 'jovens'),
    ] },
    raphael: { foto: fotoJovens, marcos: [
        marco('AGO 2025', 'Campeão no JEMG Paralímpico', 'Ouro no arremesso de peso e nos 200 m, na etapa estadual.', 'jemg2025'),
        marco('OUT 2025', 'Brasileiro de Jovens', 'Bronze no dardo e no peso na classe F-37.', 'jovens'),
        marco('AGO 2026', 'Dois ouros no JEMG', 'Campeão estadual no dardo e no peso.', 'jemg2026'),
    ] },
};
