import React from 'react';
import { Link } from 'react-router-dom';

export default function Futebol() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <style>
        {`
          .marquee-container { width: 100%; overflow: hidden; background: white; padding: 40px 0; border-top: 2px solid #1e3a8a; border-bottom: 2px solid #1e3a8a; display: flex; }
          .marquee-content { display: flex; white-space: nowrap; animation: scrollMarquee 40s linear infinite; }
          .marquee-content img { width: 350px; height: 200px; object-fit: cover; margin: 0 20px; border-radius: 25px; border: 2px solid #e2e8f0; flex-shrink: 0; }
          @keyframes scrollMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        `}
      </style>

      {/* Navbar */}
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-blue-900 font-black uppercase flex items-center gap-2 hover:text-yellow-500 transition">
            <i className="fas fa-arrow-left"></i> Voltar ao Portal
          </Link>
          <img src="https://www.betim.mg.gov.br/img/logo_prefeitura.png" className="h-8" alt="Logo Prefeitura de Betim" />
        </div>
      </nav>

      {/* Header */}
      <header className="relative bg-blue-900 text-white py-20 overflow-hidden">
        <img src="Imagens/Futebol Bom Repouso.jpeg" className="absolute inset-0 w-full h-full object-cover opacity-20" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1518605368461-1e1e38ce156d?q=80&w=1200'; }} alt="Campo de Futebol" />
        <div className="relative max-w-7xl mx-auto px-4">
          <span className="bg-yellow-400 text-blue-900 px-3 py-1 rounded-full text-xs font-bold uppercase">Esporte Coletivo</span>
          <h1 className="text-5xl font-black uppercase mt-4 italic">Futebol de Betim</h1>
          <p className="text-blue-100 mt-4 max-w-2xl text-lg">A paixão nacional tem forte tradição em nossa cidade. Formando novos talentos e promovendo a inclusão social nos campos e gramados de Betim.</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-12">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-2xl font-black text-blue-900 mb-6 uppercase italic">Sobre a Modalidade</h3>
            <div className="space-y-4 text-slate-700 leading-relaxed">
              <p>O futebol é o esporte mais praticado e popular do mundo. Disputado entre duas equipes de onze jogadores, tem como objetivo marcar gols na meta adversária, exigindo habilidade, estratégia, preparo físico e forte espírito de equipe.</p>
              <p>Em Betim, o futebol vai além das quatro linhas. Nossos projetos municipais visam a formação cidadã, integração das comunidades e o desenvolvimento técnico de jovens talentos para competições regionais e estaduais de alto rendimento.</p>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-black text-blue-900 mb-6 uppercase italic pl-4 border-l-4 border-yellow-400">Galeria</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg"><img src="Imagens/Futebol Bom Repouso.jpeg" alt="Campo de Futebol Bom Repouso" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=400'; }} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" /></div>
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg"><img src="Imagens/1.jpeg" alt="Atletas de Futebol" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=400'; }} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" /></div>
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg"><img src="Imagens/2.jpeg" alt="Competição Municipal" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1431324155629-1a6d0a11f581?q=80&w=400'; }} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" /></div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-2xl font-black text-blue-900 mb-6 uppercase italic">Onde Praticar</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 border-l-4 border-yellow-400 bg-slate-50 rounded-r-lg">
                <i className="fas fa-map-marker-alt mt-1 text-blue-900"></i>
                <div><p className="font-bold">Campo do Real</p><p className="text-sm text-slate-600">Terças e Quintas: 08:00 às 11:00 (Sub-13) | 14:00 às 17:00 (Sub-15)</p></div>
              </div>
              <div className="flex items-start gap-4 p-4 border-l-4 border-blue-900 bg-slate-50 rounded-r-lg">
                <i className="fas fa-map-marker-alt mt-1 text-blue-900"></i>
                <div><p className="font-bold">Estádio Pedro Butti (Bilezão)</p><p className="text-sm text-slate-600">Segundas e Quartas: 18:00 às 20:30 (Equipes de Rendimento e Sub-17)</p></div>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-8 sticky top-24">
          <div className="bg-white p-6 rounded-3xl shadow-lg border-t-8 border-emerald-500">
            <h4 className="font-black text-blue-900 mb-4 uppercase">Inscrições Abertas</h4>
            <p className="text-sm text-slate-600 mb-6">Faça parte de nossas equipes de futebol. Verifique os requisitos e inscreva-se para as seletivas municipais.</p>
            <h5 className="font-bold text-blue-900 mb-3 uppercase text-sm">Requisitos</h5>
            <ul className="text-sm space-y-3 text-slate-600">
              <li><i className="fas fa-check text-green-500 mr-2"></i> Idade entre 10 e 17 anos</li>
              <li><i className="fas fa-check text-green-500 mr-2"></i> Estar matriculado na rede escolar</li>
              <li><i className="fas fa-check text-green-500 mr-2"></i> Cópia do RG ou Certidão</li>
              <li><i className="fas fa-check text-green-500 mr-2"></i> Comprovante de Residência</li>
              <li><i className="fas fa-check text-green-500 mr-2"></i> Atestado Médico</li>
            </ul>
            <button className="block w-full mt-8 bg-blue-900 text-white text-center py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-800 transition shadow-lg">Quero me Inscrever</button>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-lg border-t-8 border-blue-900">
            <h4 className="font-black text-blue-900 mb-4 uppercase">Federação Mineira</h4>
            <p className="text-sm text-slate-600 mb-6">Acompanhe as competições oficiais, calendário e regulamentos diretamente no site da FMF.</p>
            <a href="http://fmf.com.br/" target="_blank" rel="noreferrer" className="block w-full bg-yellow-400 text-blue-900 text-center py-4 rounded-xl font-black uppercase tracking-widest hover:bg-yellow-500 transition shadow-lg">
              Acessar FMF <i className="fas fa-external-link-alt ml-2"></i>
            </a>
          </div>
        </aside>
      </main>

      <section className="marquee-container mb-12">
        <div className="marquee-content">
          {[1, 2].map((_, iter) => (
            <React.Fragment key={iter}>
              <img src="Imagens/Futebol Bom Repouso.jpeg" alt="Campo de Futebol" onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1518605368461-1e1e38ce156d?q=80&w=600'} />
              <img src="Imagens/1.jpeg" alt="Treino Futebol" onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600'} />
              <img src="Imagens/2.jpeg" alt="Torneio" onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=600'} />
              <img src="Imagens/futebol1.jpeg" alt="Jogo de Futebol" onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1431324155629-1a6d0a11f581?q=80&w=600'} />
              <img src="Imagens/futebol2.jpeg" alt="Atletas" onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600'} />
            </React.Fragment>
          ))}
        </div>
      </section>

      <footer className="bg-blue-950 text-white py-10 text-center text-xs font-black uppercase tracking-widest border-t-[8px] border-yellow-400">
        Secretaria de Esportes - Gestão 2026 &copy; Betim
      </footer>
    </div>
  );
}