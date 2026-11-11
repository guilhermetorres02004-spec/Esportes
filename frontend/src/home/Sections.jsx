import React from 'react';
import SchoolCarousel from './SchoolCarousel.jsx';
import VivaPhotos from './VivaPhotos.jsx';

const indicators = [
    { title: 'Núcleos', value: '10 Regionais', icon: 'fa-map-marked-alt', href: '/esporte-nas-regionais' },
    { title: 'Inclusão', value: '6.500 Jovens', icon: 'fa-users' },
    { title: 'Acessibilidade', value: '450 PCDs', icon: 'fa-wheelchair' },
    { title: 'Estrutura', value: '17 Núcleos', icon: 'fa-building' },
    { title: 'Diversidade', value: '22 Modalidades', icon: 'fa-swimmer' },
    { title: 'Conquistas', value: '1.452 Medalhas', icon: 'fa-medal', href: 'conquistas.html' },
];

export function Indicators() {
    return <section className="home-indicators" aria-label="Esporte de Betim em números">
        <div className="home-indicators-grid">
            {indicators.map(({ title, value, icon, href }) => {
                const Tag = href ? 'a' : 'div';
                return <Tag key={title} className="home-indicator" href={href}
                    aria-label={href ? title === 'Conquistas' ? 'Conquistas: conheça o Hall da Fama do esporte de Betim em 2026 e 2025' : 'Núcleos: conheça o esporte nas dez regionais de Betim' : undefined}>
                    <span className="home-indicator-icon" aria-hidden="true"><i className={`fas ${icon}`} /></span>
                    <h2>{title}{href && <span className="home-indicator-arrow" aria-hidden="true"> →</span>}</h2>
                    <p>{value}</p>
                </Tag>;
            })}
        </div>
    </section>;
}
export function Videos() {
    return (
<section id="video-destaque" className="mb-32">
                <div className="flex items-center gap-3 mb-10 border-l-8 border-red-600 pl-4">
                    <h3 className="text-3xl font-black text-blue-900 uppercase italic tracking-tighter leading-none">Ação em Vídeo</h3>
                </div>
                <div className="flex flex-wrap justify-center items-stretch gap-6">
                    <video controls className="rounded-[24px] shadow-2xl bg-black" style={{"maxWidth":"400px","width":"100%"}}>
                        <source src="Videos/VideoEsporte.mp4" type="video/mp4" />
                    </video>
                    <video controls className="rounded-[24px] shadow-2xl bg-black" style={{"maxWidth":"400px","width":"100%"}}>
                        <source src="Videos/VideoEsporte1.mp4" type="video/mp4" />
                    </video>
                    <div className="flex flex-col gap-6" style={{"maxWidth":"200px","width":"100%"}}>
                        <video controls className="rounded-[16px] shadow-lg bg-black w-full flex-1" style={{"minHeight":"0","objectFit":"cover"}}>
                            <source src="Videos/VideoEsporte2.mp4" type="video/mp4" />
                        </video>
                        <video controls className="rounded-[16px] shadow-lg bg-black w-full flex-1" style={{"minHeight":"0","objectFit":"cover"}}>
                            <source src="Videos/videoesporte3.mp4" type="video/mp4" />
                        </video>
                    </div>
                </div>
            </section>
    );
}

export function Activities() {
    return (
<section id="atividades-esportivas" className="mb-32">
                <div className="flex items-center gap-4 mb-12 border-l-8 border-emerald-500 pl-6">
                    <h3 className="text-3xl font-black text-blue-900 uppercase italic tracking-tighter">Atividades Esportivas</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-7 rounded-[24px] shadow-lg border-l-8 border-blue-600 hover:-translate-y-1 transition">
                        <i className="fas fa-child text-3xl text-blue-600 mb-4"></i>
                        <h4 className="font-black text-blue-900 uppercase italic">I.E. Iniciação Esportiva</h4>
                        <p className="text-xs text-slate-500 font-bold mt-2">Primeiro contato com práticas esportivas, coordenação motora e convivência nos núcleos de Betim.</p>
                    </div>
                    <div className="bg-white p-7 rounded-[24px] shadow-lg border-l-8 border-emerald-600 hover:-translate-y-1 transition">
                        <i className="fas fa-heart-pulse text-3xl text-emerald-600 mb-4"></i>
                        <h4 className="font-black text-blue-900 uppercase italic">Ginástica para a saúde</h4>
                        <p className="text-xs text-slate-500 font-bold mt-2">Atividade orientada para promoção da saúde, bem-estar e qualidade de vida.</p>
                    </div>
                    <div className="bg-white p-7 rounded-[24px] shadow-lg border-l-8 border-purple-600 hover:-translate-y-1 transition">
                        <i className="fas fa-universal-access text-3xl text-purple-600 mb-4"></i>
                        <h4 className="font-black text-blue-900 uppercase italic">AFA - Atividade Física Adaptada</h4>
                        <p className="text-xs text-slate-500 font-bold mt-2">Práticas adaptadas para ampliar participação, autonomia e inclusão pelo esporte.</p>
                    </div>
                    <a href="/pilates" className="block">
                        <div className="h-full bg-white p-7 rounded-[24px] shadow-lg border-l-8 border-orange-500 hover:-translate-y-1 transition">
                            <i className="fas fa-person-walking text-3xl text-orange-500 mb-4"></i>
                            <h4 className="font-black text-blue-900 uppercase italic">Pilates</h4>
                            <p className="text-xs text-slate-500 font-bold mt-2">Fortalecimento, postura, mobilidade e controle corporal com acompanhamento orientado.</p>
                        </div>
                    </a>
                    <div className="bg-white p-7 rounded-[24px] shadow-lg border-l-8 border-red-500 hover:-translate-y-1 transition">
                        <i className="fas fa-spa text-3xl text-red-500 mb-4"></i>
                        <h4 className="font-black text-blue-900 uppercase italic">Lian Gong</h4>
                        <p className="text-xs text-slate-500 font-bold mt-2">Prática corporal chinesa com foco em alongamento, respiração, equilíbrio e prevenção de dores.</p>
                    </div>
                    <div className="bg-white p-7 rounded-[24px] shadow-lg border-l-8 border-cyan-500 hover:-translate-y-1 transition">
                        <i className="fas fa-water text-3xl text-cyan-500 mb-4"></i>
                        <h4 className="font-black text-blue-900 uppercase italic">Atividade Aquática Adaptada</h4>
                        <p className="text-xs text-slate-500 font-bold mt-2">Atendimento aquático inclusivo, respeitando necessidades, segurança e desenvolvimento dos participantes.</p>
                    </div>
                </div>
            </section>
    );
}

export function School() {
    return (
<section id="escola" className="mb-32 bg-blue-100 rounded-[50px] p-16 text-center shadow-inner">
                <h3 className="text-5xl font-black text-blue-950 uppercase italic mb-12">Escola de <span className="text-blue-600">Esportes</span></h3>
                <SchoolCarousel />
                <p className="school-source">As atividades variam por núcleo. Consulte a oferta e as vagas no núcleo de interesse.</p>
                <a className="school-source" href="https://www.betim.mg.gov.br/portal/secretarias-paginas/279/programa-viva-o-esporte/">Consultar atividades por núcleo na Prefeitura de Betim →</a>
            </section>
    );
}

export function VivaEsporte() {
    return (
<section id="viva-esporte" className="mb-32">
                <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border-2 border-blue-900">
                    <div className="viva-layout grid grid-cols-1 lg:grid-cols-2">
                        <div className="viva-content p-8 lg:p-16 flex flex-col justify-center">
                            <div className="bg-yellow-400 text-blue-900 font-black px-4 py-1 w-fit mb-6 uppercase italic text-sm">Edição 2026</div>
                            <h3 className="text-5xl font-black text-blue-900 uppercase italic leading-none mb-6">Programa Viva o Esporte</h3>

                            <div className="space-y-4 text-slate-600 text-sm leading-relaxed text-justify">
                                <p>O esporte volta a ganhar espaço, em Betim, a partir desta segunda-feira (16), com o início das atividades da edição 2026 do programa Viva o Esporte. A iniciativa, executada pela Prefeitura de Betim, por meio da Secretaria Municipal de Esportes, levará ao local uma programação regular de aulas e treinamentos voltados para crianças, jovens e adultos.</p>

                                <p>A abertura das atividades contará, no período da noite, com a apresentação da equipe de treinamento de judô, marcando o início das práticas esportivas no espaço, que passa a sediar um dos núcleos do programa municipal.</p>

                                <p>A partir dos dias seguintes, as aulas da Escola de Esportes passam a ocorrer regularmente nos turnos da manhã e da tarde, com modalidades como basquetebol, futsal e voleibol, destinadas a participantes a partir de 9 anos até o público adulto. No período noturno, também serão oferecidas aulas de judô e taekwondo para alunos a partir de 8 anos.</p>

                                <p>Outra novidade é a transferência do núcleo do Jardim Petrópolis para o Clube da Fiat no turno da tarde, com atividades de futsal e ginástica para a saúde. Inicialmente, o espaço atenderá 280 alunos-atletas que migraram dos núcleos Horto, Petrópolis e da Escola Gino, com previsão de abertura de novas vagas posteriormente. O atletismo também terá presença no local, com a participação de 40 atletas da modalidade. O Clube da Fiat, que passa a sediar as atividades do programa, está localizado na Praça Geni Nair, 40, no bairro São Luiz.</p>
                            </div>
                        </div>
                        <VivaPhotos />
                    </div>
                </div>
            </section>
    );
}

const finalIndicators = [
    ['34', 'Campos Iluminados', 'fa-lightbulb'],
    ['12', 'Quadras Reformadas', 'fa-tools'],
    ['45', 'Academias na Praça', 'fa-dumbbell'],
    ['28', 'Escolas de Esporte', 'fa-graduation-cap'],
    ['320', 'Atletas Rendimento', 'fa-running'],
    ['+6k', 'Vidas Impactadas', 'fa-chart-line'],
];

export function FinalIndicators() {
    return <section id="indicadores-finais" className="final-indicators" aria-label="Indicadores do esporte em Betim">
        <div className="final-indicators-grid">
            {finalIndicators.map(([value, label, icon]) => <div className="final-indicator" key={label}>
                <i className={`fas ${icon}`} aria-hidden="true" />
                <p className="final-indicator-value">{value}</p>
                <h3 className="final-indicator-label">{label}</h3>
            </div>)}
        </div>
    </section>;
}
