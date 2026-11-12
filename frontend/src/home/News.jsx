import React from 'react';
import { OfficialImage, useOfficialPhoto } from './OfficialPhotos.jsx';

const fallback = 'https://www.betim.mg.gov.br/portal/noticias/0/3/15692/confira-as-conquistas-dos-atletas-de-betim-desta-semana/';
const laterais = [
    { categoria: 'Editais', titulo: 'Bolsa Atleta 2026: Inscrições Abertas', cor: 'blue', borderClass: 'border-blue-600', textClass: 'text-blue-600' },
    { categoria: 'Infraestrutura', titulo: 'Novo piso no Divino Braga', cor: 'green', borderClass: 'border-green-600', textClass: 'text-green-600' },
    { categoria: 'Educação', titulo: 'Recorde nos Jogos Escolares', cor: 'purple', borderClass: 'border-purple-600', textClass: 'text-purple-600' },
];
function SideNews({ indice, original }) {
    const foto = useOfficialPhoto('principal', indice);
    return <div className={`news-side-card border-l-8 ${original.borderClass}`}><div>
        <span className={`${original.textClass} text-[10px] font-black uppercase`}>{foto ? 'Esportes · Prefeitura de Betim' : original.categoria}</span>
        <h5 className="font-black text-blue-900 uppercase italic text-lg mt-1">{foto ? <a href={foto.origem} target="_blank" rel="noopener noreferrer">{foto.titulo}</a> : original.titulo}</h5>
    </div></div>;
}
export default function News() {
    const foto = useOfficialPhoto('principal');
    return <section id="noticias" className="mb-32">
        <div className="flex justify-between items-end mb-12 border-l-8 border-blue-900 pl-6"><h3 className="text-4xl font-black text-blue-900 uppercase italic tracking-tighter leading-none">Notícias</h3></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 relative rounded-[40px] news-main-card overflow-hidden bg-black shadow-2xl">
                <OfficialImage data-foto-categoria="principal" id="noticia-img-principal" src="/Imagens/2026/conquistas-outubro-2026.jpg" width="800" height="533" loading="lazy" alt="Raysa Mendonça em prova de lançamento de dardo" className="absolute inset-0 w-full h-full object-contain z-10 mx-auto" />
                <OfficialImage data-foto-categoria="principal" id="noticia-img-blur" src="/Imagens/2026/conquistas-outubro-2026.jpg" loading="lazy" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent p-12 flex flex-col justify-end z-20">
                    <span className="bg-yellow-400 text-blue-900 text-xs font-black uppercase px-4 py-1 w-fit mb-4 italic">{foto ? 'Esportes · Notícia oficial' : 'Conquistas de 2026'}</span>
                    <h4 className="text-white text-4xl font-black uppercase italic mb-4">{foto?.titulo || 'Betim em destaque no esporte'}</h4>
                    <p className="text-white/80 text-lg leading-relaxed max-w-2xl">{foto ? 'Leia a notícia completa no portal oficial da Prefeitura de Betim.' : 'Atletas de atletismo e wrestling recebem convocações para representar o Brasil em competições internacionais.'}</p>
                    <a href={foto?.origem || fallback} target="_blank" rel="noopener noreferrer" className="text-white text-xs mt-4 underline">{foto ? `Leia a notícia · Prefeitura de Betim${foto.publicadoEm ? ` · ${foto.publicadoEm}` : ''}` : 'Leia a notícia · Imagem e fonte: Prefeitura de Betim · 19/10/2026'}</a>
                </div>
            </div>
            <div className="flex flex-col gap-6">{laterais.map((original, i) => <SideNews key={original.cor} indice={i + 1} original={original} />)}</div>
        </div>
    </section>;
}
