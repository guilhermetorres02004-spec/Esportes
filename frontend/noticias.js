// Base de matérias do Portal do Esporte de Betim.
// Para publicar uma nova matéria vinda do Instagram: crie um novo objeto no topo
// deste array com os dados do post (legenda, foto de capa e link do post) e
// preencha "instagramUrl" para o embed oficial aparecer na página da matéria.
const noticiasData = [
    {
        id: "volei-praia-top10-nacional",
        categoria: "Vôlei de Praia",
        categoriaCor: "emerald-600",
        titulo: "Dupla de Betim entre as dez melhores do país",
        resumo: "Manu e Geovania, do programa Viva o Esporte, garantem vaga no Top 10 nacional do vôlei de praia adulto feminino.",
        imagem: "Imagens/noticias/volei-praia-betim-top10.jpg",
        data: "2026-02-16",
        instagramUrl: "https://www.instagram.com/p/DU1fef3AawP/",
        creditos: "Divulgação / PMB — via @portalagita",
        corpo: [
            "A temporada 2026 do vôlei de praia começou com destaque para Betim. A dupla Manu e Geovania, da categoria adulta feminina, garantiu lugar entre as dez melhores do país na etapa realizada em Navegantes, Santa Catarina.",
            "Logo na estreia, as atletas venceram Teresa (DF) e Bárbara (RJ) por 2 sets a 1. Na rodada seguinte, enfrentaram Carol Horta (CE) e Elize Maia (ES) e foram superadas por 2 sets a 0.",
            "Classificadas para as oitavas de final, Manu e Geovania, que integram o programa Viva o Esporte, da Prefeitura de Betim, por meio da Secretaria Municipal de Esportes, encararam Giulia (RJ) e Carol Salaberry (RJ). A dupla foi derrotada por 2 sets a 0 e não avançou às quartas de final, mas assegurou o nono lugar geral na etapa, resultado que as colocou no Top 10 nacional."
        ]
    },
    {
        id: "rumo-ao-rio-taekwondo",
        categoria: "Rumo ao Rio",
        categoriaCor: "red-600",
        titulo: "Partiu Rio de Janeiro!",
        resumo: "Grand Slam de Taekwondo - seletiva 2026. Agradeço à Secretaria de Esportes por todo apoio e suporte.",
        imagem: "Imagens/Rio.jpeg",
        data: "2026-01-20",
        instagramUrl: "",
        creditos: "Secretaria Municipal de Esportes de Betim",
        corpo: [
            "Grand Slam de Taekwondo - seletiva 2026. Agradeço à Secretaria de Esportes por todo apoio e suporte."
        ]
    },
    {
        id: "bolsa-atleta-2026",
        categoria: "Editais",
        categoriaCor: "blue-600",
        titulo: "Bolsa Atleta 2026: Inscrições Abertas",
        resumo: "Estão abertas as inscrições para o programa Bolsa Atleta 2026 da Secretaria Municipal de Esportes.",
        imagem: "Imagens/Rio.jpeg",
        data: "2026-01-10",
        instagramUrl: "",
        creditos: "Secretaria Municipal de Esportes de Betim",
        corpo: [
            "Estão abertas as inscrições para o programa Bolsa Atleta 2026 da Secretaria Municipal de Esportes. Consulte o edital na Central de Downloads do portal para saber prazos e critérios."
        ]
    },
    {
        id: "novo-piso-divino-braga",
        categoria: "Infraestrutura",
        categoriaCor: "green-600",
        titulo: "Novo piso no Divino Braga",
        resumo: "Poliesportivo Divino Braga recebe novo piso esportivo para as modalidades de quadra.",
        imagem: "Imagens/Poliesportivo Divino Braga.jpeg",
        data: "2025-12-05",
        instagramUrl: "",
        creditos: "Secretaria Municipal de Esportes de Betim",
        corpo: [
            "O Poliesportivo Divino Braga recebeu um novo piso esportivo, melhorando a estrutura para as modalidades de quadra praticadas no local."
        ]
    }
];

function abrirNoticia(id) {
    const noticia = noticiasData.find(n => n.id === id);
    if (!noticia) return;
    localStorage.setItem('noticiaSelecionada', JSON.stringify(noticia));
    window.location.href = 'noticia.html';
}

function renderizarNoticias() {
    const grid = document.getElementById('noticias-grid');
    if (!grid) return;

    const [principal, ...laterais] = noticiasData;

    let html = `
        <div class="lg:col-span-2 relative rounded-[40px] news-main-card overflow-hidden bg-black shadow-2xl cursor-pointer" onclick="abrirNoticia('${principal.id}')">
            <img src="${principal.imagem}" class="absolute inset-0 w-full h-full object-contain z-10 mx-auto">
            <img src="${principal.imagem}" class="absolute inset-0 w-full h-full object-cover blur-2xl opacity-50">
            <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent p-12 flex flex-col justify-end z-20">
                <span class="bg-yellow-400 text-blue-900 text-xs font-black uppercase px-4 py-1 w-fit mb-4 italic">${principal.categoria}</span>
                <h4 class="text-white text-4xl font-black uppercase italic mb-4">${principal.titulo}</h4>
                <p class="text-white/80 text-lg leading-relaxed max-w-2xl">${principal.resumo}</p>
            </div>
        </div>
        <div class="flex flex-col gap-6">`;

    laterais.slice(0, 3).forEach(n => {
        html += `
            <div class="news-side-card border-l-8 border-${n.categoriaCor} cursor-pointer" onclick="abrirNoticia('${n.id}')">
                <div><span class="text-${n.categoriaCor} text-[10px] font-black uppercase">${n.categoria}</span><h5 class="font-black text-blue-900 uppercase italic text-lg mt-1">${n.titulo}</h5></div>
            </div>`;
    });

    html += `</div>`;
    grid.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', renderizarNoticias);
