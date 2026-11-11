import React from 'react';

// Conteúdo preservado do administrativo.html; interações controladas por React.
export default function AdminContent({ onDocument }) {
    return (<main id="conteudo" tabIndex={-1} className="admin-page">
        <div className="border-l-8 border-blue-900 pl-6 mb-10">
            <h1 className="text-4xl font-black text-blue-900 uppercase italic tracking-tighter leading-none">Gestão Administrativa</h1>
            <p className="text-slate-500 font-bold uppercase text-xs mt-2 tracking-widest">Controle Interno e Organização</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <a href="/agendamento-quadras.html" className="admin-card border-blue-900 shadow-md block">
                <h3 className="text-lg font-black text-blue-900 uppercase italic mb-4">Quadras do Horto</h3>
                <div className="doc-item"><span>Agendamento e disponibilidade</span><i className="fas fa-calendar-check text-blue-900"></i></div>
            </a>
            <div className="admin-card border-blue-900 shadow-md">
                <h3 className="text-lg font-black text-blue-900 uppercase italic mb-4">Legislação</h3>
                <button type="button" className="doc-item" data-documento="lei-incentivo" onClick={() => onDocument('lei-incentivo')} aria-haspopup="dialog" aria-controls="adminDocumento"><span>Lei de Incentivo ao Esporte</span><i className="fas fa-file-pdf text-red-500"></i></button>
                <button type="button" className="doc-item" data-documento="regimento" onClick={() => onDocument('regimento')} aria-haspopup="dialog" aria-controls="adminDocumento"><span>Regimento e competências</span><i className="fas fa-file-pdf text-red-500"></i></button>
            </div>
            <div className="admin-card border-yellow-400 shadow-md">
                <h3 className="text-lg font-black text-blue-900 uppercase italic mb-4">Recursos Humanos</h3>
                <button type="button" className="doc-item" data-documento="manual-instrutor" onClick={() => onDocument('manual-instrutor')} aria-haspopup="dialog" aria-controls="adminDocumento"><span>Manual do Instrutor</span><i className="fas fa-file-word text-blue-500"></i></button>
                <button type="button" className="doc-item" data-documento="codigo-etica" onClick={() => onDocument('codigo-etica')} aria-haspopup="dialog" aria-controls="adminDocumento"><span>Código de Ética</span><i className="fas fa-file-pdf text-red-500"></i></button>
            </div>
            <div className="admin-card border-emerald-500 shadow-md">
                <h3 className="text-lg font-black text-blue-900 uppercase italic mb-4">Atos Oficiais</h3>
                <button type="button" className="doc-item" data-documento="portarias" onClick={() => onDocument('portarias')} aria-haspopup="dialog" aria-controls="adminDocumento"><span>Portarias 2026</span><i className="fas fa-file-pdf text-red-500"></i></button>
                <button type="button" className="doc-item" data-documento="editais" onClick={() => onDocument('editais')} aria-haspopup="dialog" aria-controls="adminDocumento"><span>Editais e Chamamentos</span><i className="fas fa-external-link-alt text-slate-400"></i></button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="admin-card border-red-600 shadow-md">
                <h3 className="text-lg font-black text-blue-900 uppercase italic mb-4">Controle de Frota</h3>
                <button type="button" className="doc-item" data-documento="veiculos" onClick={() => onDocument('veiculos')} aria-haspopup="dialog" aria-controls="adminDocumento"><span>Veículos</span><i className="fas fa-car-side text-blue-900"></i></button>
                <button type="button" className="doc-item" data-documento="motoristas" onClick={() => onDocument('motoristas')} aria-haspopup="dialog" aria-controls="adminDocumento"><span>Motoristas</span><i className="fas fa-calendar-alt text-slate-400"></i></button>
            </div>
            <div className="admin-card border-purple-600 shadow-md">
                <h3 className="text-lg font-black text-blue-900 uppercase italic mb-4">Almoxarifado</h3>
                <button type="button" className="doc-item" data-documento="estoque" onClick={() => onDocument('estoque')} aria-haspopup="dialog" aria-controls="adminDocumento"><span>Estoque</span><i className="fas fa-boxes text-purple-600"></i></button>
                <button type="button" className="doc-item" data-documento="pedidos" onClick={() => onDocument('pedidos')} aria-haspopup="dialog" aria-controls="adminDocumento"><span>Pedidos</span><i className="fas fa-clipboard-list text-slate-400"></i></button>
            </div>
            <div className="admin-card border-orange-500 shadow-md">
                <h3 className="text-lg font-black text-blue-900 uppercase italic mb-4">Contratos</h3>
                <button type="button" className="doc-item" data-documento="termos" onClick={() => onDocument('termos')} aria-haspopup="dialog" aria-controls="adminDocumento"><span>Termos</span><i className="fas fa-file-signature text-orange-500"></i></button>
                <button type="button" className="doc-item" data-documento="gestao" onClick={() => onDocument('gestao')} aria-haspopup="dialog" aria-controls="adminDocumento"><span>Gestão</span><i className="fas fa-handshake text-slate-400"></i></button>
            </div>
        </div>

        <section className="max-w-xl mx-auto border-t pt-10 mb-12 text-center">
            <div className="flex items-center gap-2 mb-4 justify-center">
                <i className="fas fa-coins text-blue-900 text-sm"></i>
                <h3 className="text-sm font-black text-blue-900 uppercase italic">Custo da folha 2026</h3>
            </div>
            <div className="shadow-sm rounded-xl overflow-hidden border border-slate-200">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th scope="col" className="text-left pl-4">Secretaria</th>
                            <th scope="col">jan/26</th>
                            <th scope="col">fev/26</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="text-left pl-4 uppercase text-xs cargo-cell">Secretaria Municipal de Esportes</td>
                            <td className="value-cell">664.797,00</td>
                            <td className="value-cell">582.372,18</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <section className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-200 lg:col-span-1">
                <div className="flex items-center gap-3 mb-6">
                    <i className="fas fa-sitemap text-blue-900"></i>
                    <h3 className="text-xl font-black text-blue-900 uppercase italic">Estrutura</h3>
                </div>
                <div className="struct-container">
                    <div className="font-black text-blue-900 mb-2">1 - Secretaria de Esportes</div>
                    <div className="struct-node"><div className="font-bold text-slate-700">1.0.1 - Setor Administrativo</div></div>
                    <div className="struct-node"><div className="font-bold text-slate-700">1.0.2 - Setor Jurídico</div></div>
                    <div className="struct-node">
                        <div className="font-bold text-slate-700">1.1 - Superintendência de Mobilização Comunitária</div>
                        <div className="struct-node">1.1.1 Setor de Comunicação e Eventos</div>
                    </div>
                    <div className="struct-node">
                        <div className="font-bold text-slate-700">1.2 - Superintendência de Esportes Especializados</div>
                        <div className="struct-node">1.2.1 - Setor Viva o Esporte</div>
                    </div>
                    <div className="struct-node"><div className="font-bold text-slate-700">1.3 - Superintendência de Futebol</div></div>
                    <div className="struct-node"><div className="font-bold text-slate-700">1.4 - Superintendência de Equipamentos Esportivos</div></div>
                </div>
            </section>

            <section className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-200 lg:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                    <i className="fas fa-users text-blue-900"></i>
                    <h3 className="text-xl font-black text-blue-900 uppercase italic">Quadro de Cargos</h3>
                </div>
                <div className="shadow-sm rounded-xl border border-slate-200 overflow-hidden">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th scope="col" width="25%">Comissionados</th>
                                <th scope="col" width="25%">Comissionados/Efetivos</th>
                                <th scope="col" width="25%">Efetivos</th>
                                <th scope="col" width="25%">Estagiários</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="cargo-cell">
                                    <div className="item-row"><span>Secretário Municipal</span> <span className="qty-cell">1</span></div>
                                    <div className="item-row"><span>Assessor Especial</span> <span className="qty-cell">1</span></div>
                                    <div className="item-row"><span>Assessor V</span> <span className="qty-cell">10</span></div>
                                    <div className="item-row"><span>Assessor VI</span> <span className="qty-cell">12</span></div>
                                    <div className="item-row"><span>Assessor VIII</span> <span className="qty-cell">3</span></div>
                                </td>
                                <td className="cargo-cell">
                                    <div className="item-row"><span>Superintendente</span> <span className="qty-cell">4</span></div>
                                    <div className="item-row"><span>Auxiliar de Administração 40h Médio</span> <span className="qty-cell">1</span></div>
                                    <div className="item-row"><span>Educador Social 40h Superior</span> <span className="qty-cell">1</span></div>
                                </td>
                                <td className="cargo-cell">
                                    <div className="item-row"><span>Professor P-II</span> <span className="qty-cell">15</span></div>
                                    <div className="item-row"><span>Professor P-III</span> <span className="qty-cell">1</span></div>
                                    <div className="item-row"><span>Oficial de Administração 40h Médio</span> <span className="qty-cell">1</span></div>
                                    <div className="item-row"><span>Oficial de Administração 40h Superior</span> <span className="qty-cell">1</span></div>
                                    <div className="item-row"><span>Agente de Serviços Escolares</span> <span className="qty-cell">1</span></div>
                                    <div className="item-row"><span>Ajudante de Obras</span> <span className="qty-cell">2</span></div>
                                    <div className="item-row"><span>Bombeiro Hidráulico 40h Médio</span> <span className="qty-cell">1</span></div>
                                    <div className="item-row"><span>Pedreiro 40h Médio</span> <span className="qty-cell">1</span></div>
                                    <div className="item-row"><span>Servente / Serviçal</span> <span className="qty-cell">2</span></div>
                                    <div className="item-row"><span>Guarda Patrimonial</span> <span className="qty-cell">1</span></div>
                                </td>
                                <td className="cargo-cell">
                                    <div className="item-row"><span>Nível Médio Geral</span> <span className="qty-cell">3</span></div>
                                    <div className="item-row"><span>Nível Superior Geral</span> <span className="qty-cell">8</span></div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    </main>);
}
