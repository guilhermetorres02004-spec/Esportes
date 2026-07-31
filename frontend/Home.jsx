import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [slideIdx, setSlideIdx] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Secretário', text: 'Olá! Sou o Secretário de Esportes. Como posso ajudar você hoje?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const videoRef = useRef(null);

  // Alternar slides
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Iniciar mapa Leaflet
  useEffect(() => {
    if (window.L && document.getElementById('map') && !document.getElementById('map')._leaflet_id) {
      const map = window.L.map('map', { scrollWheelZoom: false }).setView([-19.9678, -44.1983], 13);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      const unidades = [
        { n: "Campo Real", c: [-19.9550, -44.1880] },
        { n: "Bilezão", c: [-20.0050, -44.2450] },
        { n: "Horto Municipal", c: [-19.9678, -44.1983] },
        { n: "Riccardo Medioli", c: [-19.9450, -44.1350] },
        { n: "Bicicross", c: [-19.9720, -44.1950] }
      ];
      unidades.forEach(u => { window.L.marker(u.c).addTo(map).bindPopup(`<b>${u.n}</b>`); });
    }
  }, []);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { sender: 'User', text: chatInput }]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setChatMessages((prev) => [...prev, {
        sender: 'Secretário',
        text: "Agradeço sua mensagem. Como este é um ambiente de demonstração, minha equipe entrará em contato em breve!"
      }]);
    }, 1500);
  };

  return (
    <div className="bg-slate-50 font-sans text-slate-900">
      <style>
        {`
          html { scroll-behavior: smooth; }
          #map { height: 500px; border: 2px solid #004a8d; border-radius: 24px; z-index: 10; width: 100%; background: #e5e7eb; }
          .carousel-container { position: relative; width: 100%; height: 500px; overflow: hidden; background: #0f172a; }
          .slide { position: absolute; inset: 0; opacity: 0; transition: opacity 1s; }
          .slide.active { opacity: 1; z-index: 5; }
          .slide-bg { width: 100%; height: 100%; object-cover; opacity: 0.5; }
          .slogan-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 20; pointer-events: none; }
          .news-main-card { height: 550px; }
          .news-side-card { height: 173px; display: flex; align-items: center; padding: 25px; transition: 0.3s; background: white; border-radius: 25px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
          .rendimento-card { background: white; border-radius: 12px; padding: 24px; transition: 0.3s; border: 3px solid transparent; text-align: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); cursor: pointer; }
          .rendimento-card:hover { transform: translateY(-5px); box-shadow: 0 10px 15px rgba(0,0,0,0.1); }
          .escola-card { background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%); border: 3px dashed; border-radius: 24px; transition: 0.3s; text-align: center; padding: 30px 20px; }
          .escola-card:hover { transform: scale(1.05); border-style: solid; }
          .marquee-container { width: 100%; overflow: hidden; background: white; padding: 40px 0; border-top: 2px solid #004a8d; border-bottom: 2px solid #004a8d; display: flex; }
          .marquee-content { display: flex; white-space: nowrap; animation: scrollMarquee 40s linear infinite; }
          .marquee-content img { width: 350px; height: 200px; object-fit: cover; margin: 0 20px; border-radius: 25px; border: 2px solid #e2e8f0; flex-shrink: 0; }
          @keyframes scrollMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        `}
      </style>

      <header className="bg-blue-950 text-white py-2 text-[10px] font-bold uppercase tracking-widest">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-3">
          <span>Prefeitura Municipal de Betim - Secretaria Municipal de Esportes</span>
        </div>
      </header>

      <nav className="bg-white border-b sticky top-0 z-50 shadow-sm h-24 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="bg-blue-900 text-white font-black p-2 rounded-lg text-2xl w-12 h-12 flex items-center justify-center">B</div>
            <h1 className="text-blue-900 font-black text-2xl uppercase italic tracking-tighter">Portal do Esporte</h1>
          </div>
          <ul className="hidden lg:flex gap-8 font-bold text-gray-700 uppercase text-[12px] items-center">
            <li className="cursor-pointer hover:text-blue-900" onClick={() => window.scrollTo(0,0)}>Início</li>
            <li><a href="#unidades" className="hover:text-blue-900">Unidades</a></li>
            <li><button className="bg-blue-900 text-white px-8 py-3 rounded-full font-black hover:bg-yellow-400 hover:text-blue-900 transition shadow-lg">Inscreva-se</button></li>
          </ul>
        </div>
      </nav>

      <div className="carousel-container">
        <div className="slogan-overlay">
          <h2 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter text-white text-center">Betim Respira <br /><span className="text-yellow-400">Esporte</span></h2>
        </div>
        <div className={`slide ${slideIdx === 0 ? 'active' : ''}`}><img src="Imagens/Poliesportivo Divino Braga.jpeg" className="slide-bg" onError={(e) => e.target.src='https://images.unsplash.com/photo-1519315901367-f34ff9154487?q=80&w=1200'} alt="Slide 1" /></div>
        <div className={`slide ${slideIdx === 1 ? 'active' : ''}`}><img src="Imagens/Poliesportivo Ricardo Mediole.jpeg" className="slide-bg" onError={(e) => e.target.src='https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200'} alt="Slide 2" /></div>
        <div className={`slide ${slideIdx === 2 ? 'active' : ''}`}><img src="Imagens/Futebol Bom Repouso.jpeg" className="slide-bg" onError={(e) => e.target.src='https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200'} alt="Slide 3" /></div>
      </div>

      {/* Indicadores Principais */}
      <section className="max-w-7xl mx-auto px-4 -mt-16 relative z-30">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-6 rounded-[30px] shadow-xl border-b-4 border-blue-900 transform transition hover:-translate-y-2">
            <div className="flex items-center justify-between mb-2"><div className="bg-blue-100 p-2 rounded-xl"><i className="fas fa-map-marked-alt text-xl text-blue-900"></i></div><span className="text-blue-900/10 font-black text-2xl">10</span></div>
            <h4 className="text-slate-500 font-bold uppercase text-[9px] tracking-widest">Cobertura</h4>
            <p className="text-lg font-black text-blue-950 uppercase italic">10 Regionais</p>
          </div>
          <div className="bg-white p-6 rounded-[30px] shadow-xl border-b-4 border-yellow-400 transform transition hover:-translate-y-2">
            <div className="flex items-center justify-between mb-2"><div className="bg-yellow-100 p-2 rounded-xl"><i className="fas fa-users text-xl text-yellow-600"></i></div><span className="text-yellow-400/10 font-black text-2xl">6k</span></div>
            <h4 className="text-slate-500 font-bold uppercase text-[9px] tracking-widest">Inclusão</h4>
            <p className="text-lg font-black text-blue-950 uppercase italic">6.500 Jovens</p>
          </div>
          <div className="bg-white p-6 rounded-[30px] shadow-xl border-b-4 border-emerald-500 transform transition hover:-translate-y-2">
            <div className="flex items-center justify-between mb-2"><div className="bg-emerald-100 p-2 rounded-xl"><i className="fas fa-wheelchair text-xl text-emerald-600"></i></div></div>
            <h4 className="text-slate-500 font-bold uppercase text-[9px] tracking-widest">Acessibilidade</h4>
            <p className="text-lg font-black text-blue-950 uppercase italic">450 PCDs</p>
          </div>
          <div className="bg-white p-6 rounded-[30px] shadow-xl border-b-4 border-red-600 transform transition hover:-translate-y-2">
            <div className="flex items-center justify-between mb-2"><div className="bg-red-100 p-2 rounded-xl"><i className="fas fa-building text-xl text-red-600"></i></div></div>
            <h4 className="text-slate-500 font-bold uppercase text-[9px] tracking-widest">Estrutura</h4>
            <p className="text-lg font-black text-blue-950 uppercase italic">17 Núcleos</p>
          </div>
          <div className="bg-white p-6 rounded-[30px] shadow-xl border-b-4 border-purple-600 transform transition hover:-translate-y-2">
            <div className="flex items-center justify-between mb-2"><div className="bg-purple-100 p-2 rounded-xl"><i className="fas fa-swimmer text-xl text-purple-600"></i></div></div>
            <h4 className="text-slate-500 font-bold uppercase text-[9px] tracking-widest">Diversidade</h4>
            <p className="text-lg font-black text-blue-950 uppercase italic">22 Modais</p>
          </div>
          <div className="bg-white p-6 rounded-[30px] shadow-xl border-b-4 border-orange-500 transform transition hover:-translate-y-2">
            <div className="flex items-center justify-between mb-2"><div className="bg-orange-100 p-2 rounded-xl"><i className="fas fa-medal text-xl text-orange-600"></i></div></div>
            <h4 className="text-slate-500 font-bold uppercase text-[9px] tracking-widest">Conquistas</h4>
            <p className="text-lg font-black text-blue-950 uppercase italic">120 Medalhas</p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-20">
        {/* Seção Notícias */}
        <section id="noticias" className="mb-32">
          <div className="flex justify-between items-end mb-12 border-l-8 border-blue-900 pl-6"><h3 className="text-4xl font-black text-blue-900 uppercase italic tracking-tighter leading-none">Notícias</h3></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 relative rounded-[40px] news-main-card overflow-hidden bg-black shadow-2xl">
              <img src="Imagens/Rio.jpeg" className="absolute inset-0 w-full h-full object-cover opacity-50" onError={(e) => e.target.src='https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800'} alt="Noticia Principal" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent p-12 flex flex-col justify-end z-20">
                <span className="bg-yellow-400 text-blue-900 text-xs font-black uppercase px-4 py-1 w-fit mb-4 italic">Rumo ao Rio</span>
                <h4 className="text-white text-4xl font-black uppercase italic mb-4">Partiu Rio de Janeiro!</h4>
                <p className="text-white/80 text-lg leading-relaxed max-w-2xl">Grand Slam de Taekwondo - seletiva 2026. Agradeço à Secretaria de Esportes por todo apoio e suporte.</p>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="news-side-card border-l-8 border-blue-600"><div><span className="text-blue-600 text-[10px] font-black uppercase">Editais</span><h5 className="font-black text-blue-900 uppercase italic text-lg mt-1">Bolsa Atleta 2026: Inscrições Abertas</h5></div></div>
              <div className="news-side-card border-l-8 border-green-600"><div><span className="text-green-600 text-[10px] font-black uppercase">Infraestrutura</span><h5 className="font-black text-blue-900 uppercase italic text-lg mt-1">Novo piso no Divino Braga</h5></div></div>
              <div className="news-side-card border-l-8 border-purple-600"><div><span className="text-purple-600 text-[10px] font-black uppercase">Educação</span><h5 className="font-black text-blue-900 uppercase italic text-lg mt-1">Recorde nos Jogos Escolares</h5></div></div>
            </div>
          </div>
        </section>

        {/* Rendimento com Link para Futebol */}
        <section id="rendimento" className="mb-32">
          <div className="flex items-center gap-4 mb-12 border-l-8 border-red-600 pl-6"><h3 className="text-3xl font-black text-blue-900 uppercase italic tracking-tighter">Esporte de Rendimento</h3></div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <Link to="/futebol">
              <div className="rendimento-card border-[#10b981] border-[3px] border-emerald-500">
                <i className="fas fa-futbol text-3xl text-emerald-600 mb-2"></i>
                <h4 className="text-xs font-black uppercase mt-4 italic">Futebol</h4>
              </div>
            </Link>
            <div className="rendimento-card border-amber-500 border-[3px]"><i className="fas fa-running text-3xl text-amber-600 mb-2"></i><h4 className="text-xs font-black uppercase mt-4 italic">Atletismo</h4></div>
            <div className="rendimento-card border-blue-500 border-[3px]"><i className="fas fa-swimmer text-3xl text-blue-600 mb-2"></i><h4 className="text-xs font-black uppercase mt-4 italic">Natação</h4></div>
            <div className="rendimento-card border-emerald-500 border-[3px]"><i className="fas fa-volleyball-ball text-3xl text-emerald-600 mb-2"></i><h4 className="text-xs font-black uppercase mt-4 italic">Voleibol</h4></div>
            <div className="rendimento-card border-purple-500 border-[3px]"><i className="fas fa-basketball-ball text-3xl text-purple-600 mb-2"></i><h4 className="text-xs font-black uppercase mt-4 italic">Basquete</h4></div>
          </div>
        </section>

        {/* Viva o Esporte */}
        <section id="viva-esporte" className="mb-32">
          <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border-2 border-blue-900">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-16 flex flex-col justify-center">
                <div className="bg-yellow-400 text-blue-900 font-black px-4 py-1 w-fit mb-6 uppercase italic text-sm">Edição 2026</div>
                <h3 className="text-5xl font-black text-blue-900 uppercase italic leading-none mb-6">Programa <br />Viva o Esporte</h3>
                <div className="space-y-4 text-slate-600 text-sm leading-relaxed text-justify">
                  <p>O esporte volta a ganhar espaço, em Betim, a partir desta segunda-feira com o início das atividades da edição 2026 do programa Viva o Esporte. A iniciativa, executada pela Prefeitura de Betim, por meio da Secretaria Municipal de Esportes.</p>
                </div>
              </div>
              <div className="relative min-h-[500px]">
                <img src="https://www.betim.mg.gov.br/fotos/88a498819481063584ddadff1af2d4b6.jpg" className="absolute inset-0 w-full h-full object-cover" alt="Projeto Viva o Esporte" />
                <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Leaflet */}
        <section id="unidades" className="mb-20">
          <div className="border-l-8 border-yellow-400 pl-6 mb-8"><h3 className="text-3xl font-black text-blue-900 uppercase italic tracking-tighter">Onde Treinar em Betim</h3></div>
          <div id="map" className="shadow-2xl"></div>
        </section>
      </main>

      {/* Marquee Footer */}
      <section className="marquee-container mb-12">
        <div className="marquee-content">
          {[1, 2].map((_, iter) => (
            <React.Fragment key={iter}>
              <img src="Imagens/Poliesportivo Divino Braga.jpeg" alt="Divino Braga" onError={(e) => e.target.src='https://images.unsplash.com/photo-1518605368461-1e1e38ce156d?q=80&w=400'}/>
              <img src="Imagens/Futebol Bom Repouso.jpeg" alt="Futebol Betim" onError={(e) => e.target.src='https://images.unsplash.com/photo-1518605368461-1e1e38ce156d?q=80&w=400'}/>
              <img src="Imagens/1.jpeg" alt="Sementes" onError={(e) => e.target.src='https://images.unsplash.com/photo-1518605368461-1e1e38ce156d?q=80&w=400'}/>
              <img src="Imagens/2.jpeg" alt="Competição" onError={(e) => e.target.src='https://images.unsplash.com/photo-1518605368461-1e1e38ce156d?q=80&w=400'}/>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Chat do Secretário */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
        <div className={`bg-white w-80 rounded-2xl shadow-2xl overflow-hidden mb-4 border-2 border-blue-900 transition-all duration-300 origin-bottom-right flex-col h-[400px] ${isChatOpen ? 'flex scale-100 opacity-100' : 'hidden scale-0 opacity-0'}`}>
          <div className="bg-blue-900 text-white p-4 flex justify-between items-center shadow-md z-10 relative">
            <div className="flex items-center gap-3">
              <img src="https://ui-avatars.com/api/?name=Secretario&background=facc15&color=1e3a8a" className="w-10 h-10 rounded-full border-2 border-white" alt="Avatar" />
              <div>
                <h4 className="font-black text-sm uppercase italic leading-none">Secretário</h4>
                <span className="text-[10px] text-blue-200">Online agora</span>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-white hover:text-red-400 transition"><i className="fas fa-times text-lg"></i></button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3 text-sm">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2 ${msg.sender === 'User' ? 'justify-end' : ''}`}>
                {msg.sender !== 'User' && <img src="https://ui-avatars.com/api/?name=Secretario&background=facc15&color=1e3a8a" className="w-8 h-8 rounded-full shadow-sm" alt="Avatar" />}
                <div className={`p-3 rounded-2xl shadow-sm max-w-[85%] break-words ${msg.sender === 'User' ? 'bg-blue-900 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2">
                <img src="https://ui-avatars.com/api/?name=Secretario&background=facc15&color=1e3a8a" className="w-8 h-8 rounded-full shadow-sm" alt="Avatar" />
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-3 bg-white border-t border-slate-200 flex gap-2 z-10 relative">
            <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Digite sua mensagem..." className="flex-1 bg-slate-100 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900" />
            <button onClick={sendMessage} className="bg-blue-900 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-blue-900 transition-all shadow-md">
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>

        <button onClick={() => setIsChatOpen(!isChatOpen)} className="bg-blue-900 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:bg-yellow-400 hover:text-blue-900 transition-all hover:scale-110 relative border-2 border-white">
          <i className="fas fa-comments text-3xl"></i>
          {!isChatOpen && <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">1</span>}
        </button>
      </div>

      <footer className="bg-blue-950 text-white py-16 text-center text-xs font-black uppercase tracking-widest border-t-[12px] border-yellow-400">
        Prefeitura de Betim - Secretaria Municipal de Esportes &copy; 2026
      </footer>
    </div>
  );
}