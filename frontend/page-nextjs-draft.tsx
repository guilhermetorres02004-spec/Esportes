import React from 'react';
import Image from 'next/image';
// Importando ícones equivalentes do FontAwesome via react-icons
import { 
  FaUniversalAccess, FaSearch, FaPaperPlane, FaUsers, 
  FaMapMarkedAlt, FaMedal, FaCalendarCheck, FaBicycle, 
  FaUserNinja, FaVolleyballBall, FaFutbol, FaChess, 
  FaChild, FaHeartbeat, FaWalking, FaFileInvoice,
  FaInstagram, FaFacebook, FaYoutube
} from 'react-icons/fa';

export default function SportPortal() {
  return (
    <div className="bg-slate-50 font-sans text-slate-900 min-h-screen">
      
      {/* Top Bar */}
      <div className="bg-blue-950 text-white py-2 text-[10px] font-bold uppercase tracking-widest px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-4">
            <span className="hover:text-yellow-400 cursor-pointer flex items-center gap-1">
              <FaUniversalAccess /> Acessibilidade
            </span>
            <span className="hover:text-yellow-400 cursor-pointer flex items-center gap-1">
              <FaSearch /> Transparência
            </span>
          </div>
          <div className="hidden md:block italic opacity-80 uppercase tracking-tighter">
            Secretaria Municipal de Esportes e Lazer de Betim - MG
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-24">
          <div className="flex items-center gap-4">
            <div className="bg-blue-900 p-2 rounded-lg shadow-inner">
              <img 
                src="https://www.betim.mg.gov.br/img/logo_prefeitura.png" 
                alt="Logo Betim" 
                className="h-12"
              />
            </div>
            <div className="border-l-2 border-gray-200 pl-4">
              <h1 className="text-blue-900 font-black text-xl leading-none tracking-tighter uppercase">Esporte e Lazer</h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Betim / Minas Gerais</p>
            </div>
          </div>

          <ul className="hidden lg:flex gap-8 font-bold text-gray-700 uppercase text-xs tracking-wider items-center">
            <li className="cursor-pointer text-blue-900 italic font-black border-b-2 border-yellow-400">Início</li>
            <li className="hover:text-blue-900 cursor-pointer transition-colors">Modalidades</li>
            <li className="hover:text-blue-900 cursor-pointer transition-colors">Editais</li>
            <li className="hover:text-blue-900 cursor-pointer transition-colors">Notícias</li>
            <li>
              <button className="bg-yellow-400 text-blue-950 px-5 py-2 rounded-full font-black hover:bg-yellow-500 transition shadow-md flex items-center gap-2">
                <FaPaperPlane size={12} /> Inscrições 2026
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative w-full h-[400px] bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 flex flex-col justify-center px-4 md:px-20 text-white z-10">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-4 leading-tight italic">
            O Futuro do Esporte<br />começa aqui.
          </h2>
          <p className="text-lg opacity-90 max-w-xl font-light">
            Participe dos nossos programas de incentivo. Betim é referência em esporte especializado e lazer para a família.
          </p>
        </div>
        <img 
          src="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=1200" 
          alt="Sports"
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      <main className="max-w-7xl mx-auto px-4 py-16">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-20">
          <StatCard icon={<FaUsers size={30} />} value="15k+" label="Alunos Atendidos" highlight />
          <StatCard icon={<FaMapMarkedAlt size={30} />} value="42" label="Núcleos Esportivos" />
          <StatCard icon={<FaMedal size={30} />} value="120" label="Atletas Bolsistas" />
          <StatCard icon={<FaCalendarCheck size={30} />} value="08" label="Eventos este mês" />
        </div>

        {/* Section Title */}
        <div className="flex items-center gap-3 mb-10">
          <div className="h-8 w-2 bg-yellow-400"></div>
          <h3 className="text-3xl font-black text-blue-900 uppercase italic">Modalidades Disponíveis</h3>
        </div>
        
        {/* Modalidades Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-24">
          <ModalityCard icon={<FaBicycle />} label="Bicicross" color="text-orange-600" borderColor="border-orange-600" />
          <ModalityCard icon={<FaUserNinja />} label="Judô" color="text-blue-700" borderColor="border-blue-700" />
          <ModalityCard icon={<FaVolleyballBall />} label="Vôlei" color="text-yellow-500" borderColor="border-yellow-500" />
          <ModalityCard icon={<FaFutbol />} label="Futsal" color="text-green-700" borderColor="border-green-700" />
          <ModalityCard icon={<FaChess />} label="Xadrez" color="text-slate-700" borderColor="border-slate-700" />
          <ModalityCard icon={<FaChild />} label="Rua Lazer" color="text-red-600" borderColor="border-red-600" />
        </div>

        <div className="grid lg:grid-cols-3 gap-12 mb-20">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h4 className="text-2xl font-black text-blue-900 uppercase mb-6 italic tracking-tighter">O Esporte Transformando Betim</h4>
              <div className="text-slate-600 leading-relaxed space-y-4">
                <p>A Secretaria Municipal de Esportes e Lazer (SEME) é o órgão responsável por formular e executar políticas públicas que promovem a saúde física e mental dos cidadãos betinenses.</p>
                <p>Através de parcerias estratégicas, mantemos complexos esportivos de ponta, como o <strong>Ginásio Divino Braga</strong> e o <strong>Horto Municipal</strong>.</p>
              </div>
            </section>

            <div className="grid md:grid-cols-2 gap-6">
              <ProgramCard 
                icon={<FaHeartbeat />} 
                title="Academia na Praça" 
                desc="Equipamentos de ginástica ao ar livre com acompanhamento profissional."
                theme="emerald"
              />
              <ProgramCard 
                icon={<FaWalking />} 
                title="Caminhada Orientada" 
                desc="Grupos de caminhada monitorados por fisioterapeutas nos parques de Betim."
                theme="blue"
              />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
              <h4 className="font-black uppercase text-slate-800 mb-6 flex items-center gap-2">
                <FaFileInvoice className="text-blue-600" /> Editais Abertos
              </h4>
              <div className="space-y-6">
                <EditalItem code="005/2026" title="Seleção de Instrutores de Judô para o Projeto Sementes" />
                <EditalItem code="008/2026" title="Manutenção de Quadras Poliesportivas - Regional Imbiruçu" />
              </div>
              <button className="w-full mt-6 bg-blue-900 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-800 transition shadow-lg">
                Ver todos os documentos
              </button>
            </div>

            <div className="bg-gradient-to-br from-yellow-400 to-orange-400 p-8 rounded-3xl text-blue-950">
              <h5 className="font-black uppercase text-lg mb-2 italic tracking-tighter leading-tight">Sugestões e Críticas?</h5>
              <p className="text-xs font-bold opacity-80 mb-4">Ajude a melhorar o esporte na sua comunidade.</p>
              <a href="#" className="text-xs font-black uppercase underline tracking-widest">Acessar Formulário</a>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-950 text-white pt-16 pb-8 border-t-8 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <h5 className="font-black uppercase mb-4 italic tracking-widest text-sm underline decoration-yellow-400 decoration-4 underline-offset-8">Betim Esportes</h5>
            <p className="text-[11px] text-blue-200 leading-relaxed font-light mt-6">Rua Pará de Minas, 640 - Centro, Betim/MG</p>
          </div>
          <div>
            <h5 className="font-black uppercase mb-4 italic tracking-widest text-sm">Links Rápidos</h5>
            <ul className="text-[11px] text-blue-200 space-y-2 font-medium uppercase tracking-widest">
              <li className="hover:text-yellow-400 cursor-pointer transition">Portal da Transparência</li>
              <li className="hover:text-yellow-400 cursor-pointer transition">Agenda do Secretário</li>
            </ul>
          </div>
          <div className="flex flex-col gap-4 italic font-bold text-xs">
            <p className="text-[10px] uppercase opacity-50 mb-2">Redes Sociais Oficiais</p>
            <div className="flex gap-4 text-xl">
              <FaInstagram className="hover:text-yellow-400 cursor-pointer" />
              <FaFacebook className="hover:text-yellow-400 cursor-pointer" />
              <FaYoutube className="hover:text-yellow-400 cursor-pointer" />
            </div>
          </div>
        </div>
        <div className="text-center border-t border-white/10 pt-8 flex flex-col gap-2">
          <p className="text-[9px] uppercase font-bold tracking-[3px] opacity-40 italic">© 2026 Prefeitura Municipal de Betim</p>
          <p className="text-[10px] font-medium tracking-widest text-blue-300 uppercase">
            Desenvolvido por: <span className="text-yellow-400 font-black tracking-widest">Fundação Beta</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

/* Componentes Auxiliares para Limpeza do Código */

function StatCard({ icon, value, label, highlight = false }: any) {
  return (
    <div className={`${highlight ? 'bg-blue-900 text-white' : 'bg-white border border-slate-200 text-blue-900'} p-6 rounded-2xl flex items-center gap-4 shadow-sm`}>
      <span className={highlight ? 'text-yellow-400' : 'text-blue-900'}>{icon}</span>
      <div>
        <p className="text-2xl font-black">{value}</p>
        <p className={`text-[10px] uppercase font-bold tracking-widest ${highlight ? 'opacity-70' : 'text-slate-500'}`}>{label}</p>
      </div>
    </div>
  );
}

function ModalityCard({ icon, label, color, borderColor }: any) {
  return (
    <div className={`bg-white p-8 rounded-3xl ${color} text-center transition-transform hover:-translate-y-2 shadow-lg border-b-8 ${borderColor} cursor-pointer group`}>
      <div className="text-4xl mb-4 group-hover:scale-110 transition flex justify-center">{icon}</div>
      <p className="font-black uppercase text-xs text-slate-800">{label}</p>
    </div>
  );
}

function ProgramCard({ icon, title, desc, theme }: any) {
  const styles: any = {
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-900 icon-bg-emerald-600",
    blue: "bg-blue-50 border-blue-100 text-blue-900 icon-bg-blue-600"
  };
  return (
    <div className={`${theme === 'emerald' ? 'bg-emerald-50 border-emerald-100' : 'bg-blue-50 border-blue-100'} p-8 rounded-3xl border group`}>
      <div className={`${theme === 'emerald' ? 'bg-emerald-600' : 'bg-blue-600'} text-white w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
        {icon}
      </div>
      <h5 className="text-xl font-black uppercase mb-2">{title}</h5>
      <p className="text-sm opacity-80 mb-4 leading-relaxed font-medium">{desc}</p>
      <span className="font-bold text-xs uppercase cursor-pointer hover:underline tracking-widest">Saber mais →</span>
    </div>
  );
}

function EditalItem({ code, title }: any) {
  return (
    <div className="border-b pb-4 last:border-0">
      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Edital {code}</p>
      <h6 className="font-bold text-sm hover:text-blue-900 cursor-pointer transition">{title}</h6>
    </div>
  );
}