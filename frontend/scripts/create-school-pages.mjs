import { writeFileSync, existsSync, readFileSync } from 'node:fs';
import { modalidadesEscola } from '../src/modalidades/catalog.js';

const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
for (const modalidade of modalidadesEscola.filter(item => !item.existente)) {
    const { nome, nucleos, tipo, fonte, legacyHref: href } = modalidade;
    const target = new URL(`../${href}`, import.meta.url);
    // Atualiza somente páginas deste modelo quando --refresh for solicitado; preserva os destinos legados.
    if (existsSync(target) && (!process.argv.includes('--refresh') || !readFileSync(target, 'utf8').includes('/css/modalidade-escola.css'))) continue;
    const conteudo = tipo
        ? `<p>Esta modalidade possui equipe competitiva do Programa Viva o Esporte, conforme publicação da Prefeitura de Betim.</p><p>A participação pode depender de avaliação ou seleção. A notícia citada registra uma ação do programa e não representa inscrição ou seletiva aberta atualmente.</p>`
        : `<p>${escape(nome)} integra a relação de atividades do Programa Viva o Esporte divulgada pela Prefeitura de Betim para 2026.</p><h2>Núcleos com a atividade na relação oficial</h2><ul>${nucleos.map(nucleo => `<li>${escape(nucleo)}</li>`).join('')}</ul><p>Confirme com o núcleo a oferta atual, a faixa etária, os horários e a disponibilidade de vagas.</p>`;
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escape(nome)} — Portal do Esporte Betim</title>
    <script src="/js/portal-preferencias.js"></script>
    <link rel="stylesheet" href="/css/portal-acessibilidade.css">
    <link rel="stylesheet" href="/css/tailwind.css">
    <link rel="stylesheet" href="/css/portal-header.css">
    <link rel="stylesheet" href="/css/portal-base.css">
    <link rel="stylesheet" href="/css/modalidade-escola.css">
</head>
<body class="portal-standard">
    <a class="portal-skip-link" href="#conteudo">Ir para o conteúdo</a>
    <script src="/js/portal-header.js"></script>
    <header class="modalidade-hero">
        <div class="modalidade-hero-inner">
            <span class="modalidade-badge">${tipo || 'Escola de Esportes'}</span>
            <h1>${escape(nome)}</h1>
            <p>Conheça ${escape(nome)} no Programa Viva o Esporte de Betim.</p>
        </div>
    </header>
    <main id="conteudo" class="modalidade-page" tabindex="-1">
        <nav aria-label="Caminho da página"><a href="/#escola">Escola de Esportes</a><span aria-hidden="true"> / </span><span aria-current="page">${escape(nome)}</span></nav>
        <div class="modalidade-layout">
            <div>
                <section class="modalidade-panel"><h2>${escape(nome)} em Betim</h2>${conteudo}</section>
                <section class="modalidade-panel"><h2>Galeria de fotos oficiais</h2>
                    <div data-fotos-galeria="${modalidade.id}" class="modalidade-gallery"><p>As fotos desta modalidade serão exibidas quando estiverem disponíveis no acervo oficial da Prefeitura de Betim.</p></div>
                </section>
                <section class="modalidade-panel"><h2>Fonte e informações atualizadas</h2>
                    <a href="${escape(fonte)}">Consultar a publicação oficial da Prefeitura de Betim</a>
                    <p class="modalidade-source">Fonte consultada em 11/11/2026. A oferta pode mudar.</p>
                </section>
            </div>
            <aside class="modalidade-sidebar" aria-label="Participação e agenda">
                <section class="modalidade-panel modalidade-enrollment"><h2>${tipo ? 'Como acompanhar' : 'Como participar'}</h2>
                    <p>${tipo ? 'Consulte as publicações e orientações da Secretaria de Esportes para acompanhar as equipes e os processos de seleção.' : 'Procure o núcleo de interesse para confirmar as condições de participação antes de realizar a inscrição.'}</p>
                    ${tipo ? '' : '<h3>Antes da inscrição</h3><p>Confirme a faixa etária, os documentos exigidos, os horários e as vagas com o núcleo responsável.</p>'}
                    <a class="modalidade-action" href="${escape(fonte)}"${tipo ? '' : ' target="_blank" rel="noopener noreferrer"'}>${tipo ? 'Consultar a equipe' : 'Consultar participação'}</a>
                </section>
                <section class="modalidade-panel modalidade-network"><h2>Rede Municipal</h2><p>Acompanhe os eventos e as ações esportivas publicados no portal.</p><a class="modalidade-action modalidade-action-secondary" href="agenda.html">Ver agenda</a></section>
            </aside>
        </div>
        <a class="modalidade-back" href="/#escola">← Voltar às modalidades</a>
    </main>
    <footer class="modalidade-footer"><p>Portal do Esporte Betim</p><a href="https://www.betim.mg.gov.br/portal/secretarias/13/secretaria-municipal-de-esportes-semes">Secretaria Municipal de Esportes</a></footer>
</body>
</html>
`;
    writeFileSync(target, html);
    console.log(`Criada: ${href}`);
}
