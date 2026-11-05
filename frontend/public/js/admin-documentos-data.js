const pasta = '/docs/administrativo/';

export const documentosAdministrativos = {
    'lei-incentivo': {
        titulo: 'Lei de Incentivo ao Esporte', categoria: 'Legislação',
        documento: 'Lei Municipal nº 7.077, de 31 de maio de 2022', origem: 'Câmara Municipal de Betim', abrangencia: 'Municipal',
        fonte: 'https://legislativo.camarabetim.mg.gov.br/NormaJuridica/ShowNormaJuridica/73704', pdf: pasta + 'lei-fomento-betim.pdf',
        paragrafos: [
            'A lei institui o Programa Municipal de Fomento ao Esporte e o Fundo Municipal do Esporte de Betim, com foco no acesso ao esporte, na inclusão e no apoio a projetos esportivos.',
            'O texto trata dos recursos do programa, dos projetos apoiados, da apresentação e avaliação de propostas e da prestação de contas. As condições de cada seleção são estabelecidas nos respectivos editais.',
        ],
    },
    regimento: {
        titulo: 'Regimento e competências', categoria: 'Legislação',
        documento: 'Lei Municipal nº 7.810/2025 — organização administrativa', origem: 'Câmara Municipal de Betim', abrangencia: 'Base legal municipal',
        fonte: 'https://legislativo.camarabetim.mg.gov.br/NormaJuridica/DownloadNormaJuridica/83085', pdf: pasta + 'organizacao-betim.pdf',
        paragrafos: [
            'A referência localizada para a organização da Secretaria Municipal de Esportes é a Lei nº 7.810/2025. O artigo 39 reúne suas competências e a página oficial da SEMES identifica suas unidades administrativas.',
            'Entre as atribuições estão planejar e executar ações esportivas, administrar equipamentos, incentivar programas inclusivos e acompanhar os conselhos vinculados ao esporte. O documento apresentado é a lei de organização municipal.',
        ],
        relacionado: { href: 'https://www.betim.mg.gov.br/portal/secretarias/13/secretaria-municipal-de-esportes', texto: 'Estrutura oficial da SEMES' },
    },
    'manual-instrutor': {
        titulo: 'Manual do Instrutor', categoria: 'Recursos Humanos',
        documento: 'Diretrizes do Programa Segundo Tempo — edição 2018', origem: 'Secretaria Especial do Esporte', abrangencia: 'Referência técnica federal · 2018',
        fonte: 'https://www.gov.br/mds/pt-br/acoes-e-programas/outros/segundo-tempo/arquivos/2019_07_10_diretrizes_pst_padrao_2018.pdf', pdf: pasta + 'manual-instrutor-pst.pdf',
        paragrafos: [
            'As diretrizes do Programa Segundo Tempo descrevem a organização dos núcleos, a proposta pedagógica e as atribuições de profissionais e monitores de educação física e esporte.',
            'O material aborda planejamento das atividades, organização do atendimento, acompanhamento dos participantes e condições para uma prática esportiva segura e inclusiva. Trata-se de uma referência federal, identificada pela edição original de 2018.',
        ],
    },
    'codigo-etica': {
        titulo: 'Código de Ética', categoria: 'Recursos Humanos',
        documento: 'Código de Ética Profissional — Decreto nº 51.496/2025', origem: 'Prefeitura de Betim · Portal do Servidor', abrangencia: 'Municipal',
        fonte: 'https://servidor.betim.digital/servidores/codigo-etica', pdf: pasta + 'codigo-etica-betim.pdf',
        paragrafos: [
            'O código orienta a atuação dos agentes públicos de Betim, incluindo servidores, comissionados, contratados, terceirizados, estagiários e integrantes da alta administração.',
            'O documento apresenta princípios, compromissos, condutas vedadas e procedimentos de apuração ética. Destaca o interesse público, a impessoalidade, o respeito, a integridade, a proteção das informações e o zelo pelo patrimônio público.',
        ],
    },
    portarias: {
        titulo: 'Portarias 2026', categoria: 'Atos Oficiais',
        documento: 'Órgão Oficial de Betim — edição nº 3523, de 03/11/2026', origem: 'Prefeitura de Betim', abrangencia: 'Publicação municipal · consulta de 04/11/2026',
        fonte: 'https://www.betim.mg.gov.br/portal/diario-oficial', pdf: pasta + 'orgao-oficial-betim.pdf',
        paragrafos: [
            'O Órgão Oficial reúne as publicações administrativas do Município. A edição selecionada nesta consulta é a nº 3523, publicada em 3 de novembro de 2026.',
            'No leitor, utilize a busca do PDF para localizar o número da portaria, o assunto ou a secretaria. O portal oficial permite consultar outras edições por palavra-chave, número e intervalo de datas.',
        ],
    },
    editais: {
        titulo: 'Editais e Chamamentos', categoria: 'Atos Oficiais',
        documento: 'Credenciamento ADM0017/2026 — organização e execução de eventos', origem: 'Prefeitura de Betim · SEMES', abrangencia: 'Processo municipal · situação na fonte oficial',
        fonte: 'https://www.betim.mg.gov.br/portal/editais/0/1/8518/', pdf: pasta + 'edital-adm0017-2026.pdf',
        paragrafos: [
            'O processo ADM0017/2026 está vinculado à Secretaria Municipal de Esportes e trata do credenciamento de serviços para eventos socioesportivos, de lazer e recreação.',
            'O objeto inclui organização de eventos, arbitragem, apoio de público, equipes de apoio, sonorização e outros serviços descritos no edital. Consulte o documento e suas movimentações na fonte para conferir requisitos, prazos e situação do processo.',
        ],
    },
    veiculos: {
        titulo: 'Veículos', categoria: 'Controle de Frota',
        documento: 'Manual de condução, utilização e conservação de veículos oficiais', origem: 'IFMG · Campus Formiga', abrangencia: 'Referência técnica de outra instituição pública',
        fonte: 'https://www.formiga.ifmg.edu.br/documents/2016/Normas/Manual_de_conducao_utilizacao_e_conservacao_de_veiculos_oficiais.pdf', pdf: pasta + 'manual-frota-ifmg.pdf',
        paragrafos: [
            'O manual do IFMG apresenta responsabilidades e rotinas para utilização e conservação de veículos oficiais, incluindo controle de movimentação, condições do veículo e comunicação de falhas.',
            'O documento é uma referência técnica do Campus Formiga para consulta sobre organização da frota, manutenção e registros de utilização.',
        ],
    },
    motoristas: {
        titulo: 'Motoristas', categoria: 'Controle de Frota',
        documento: 'Manual do IFMG — responsabilidades do condutor', origem: 'IFMG · Campus Formiga', abrangencia: 'Referência técnica de outra instituição pública',
        fonte: 'https://www.formiga.ifmg.edu.br/documents/2016/Normas/Manual_de_conducao_utilizacao_e_conservacao_de_veiculos_oficiais.pdf', pdf: pasta + 'manual-frota-ifmg.pdf', pagina: 3,
        paragrafos: [
            'A seção de responsabilidades do manual do IFMG reúne orientações para condutores: registrar a movimentação, verificar documentação e condições do veículo e comunicar problemas ao setor responsável.',
            'Também são tratados cuidados de conservação e procedimentos relacionados a ocorrências durante os deslocamentos. O leitor abre na seção de responsabilidades, mantendo a identificação da instituição de origem.',
        ],
    },
    estoque: {
        titulo: 'Estoque', categoria: 'Almoxarifado',
        documento: 'Manual de gestão de material de consumo — rotinas e procedimentos, 2022', origem: 'Câmara Legislativa do Distrito Federal', abrangencia: 'Referência técnica · CLDF',
        fonte: 'https://biblioteca.cl.df.gov.br/dspace/bitstream/123456789/708/1/Manual%20de%20gest%C3%A3o%20de%20material%20de%20consumo%20CLDF%20-%20rotinas%20e%20procedimentos%202022.pdf', pdf: pasta + 'manual-almoxarifado-cldf.pdf',
        paragrafos: [
            'O manual da CLDF descreve recebimento, aceitação, registro de entrada, armazenagem, controle de estoque e inventário de materiais de consumo.',
            'A publicação organiza rotinas para acompanhar movimentações, planejar reposições e manter os registros de materiais. É apresentada como referência técnica da instituição que a publicou.',
        ],
        acao: { href: 'almoxarifado.html', texto: 'Abrir almoxarifado' },
    },
    pedidos: {
        titulo: 'Pedidos', categoria: 'Almoxarifado',
        documento: 'Manual da CLDF — requisição, entrega e devolução de materiais', origem: 'Câmara Legislativa do Distrito Federal', abrangencia: 'Referência técnica · CLDF',
        fonte: 'https://biblioteca.cl.df.gov.br/dspace/bitstream/123456789/708/1/Manual%20de%20gest%C3%A3o%20de%20material%20de%20consumo%20CLDF%20-%20rotinas%20e%20procedimentos%202022.pdf', pdf: pasta + 'manual-almoxarifado-cldf.pdf',
        paragrafos: [
            'As rotinas de distribuição do manual da CLDF incluem cadastro de requisitantes, requisição de materiais, responsabilidades dos servidores, entrega e devolução.',
            'Consulte especialmente os tópicos 3.5 a 3.10 para acompanhar o fluxo de uma solicitação e os registros envolvidos na movimentação de materiais.',
        ],
        acao: { href: 'almoxarifado.html', texto: 'Abrir pedidos no almoxarifado' },
    },
    termos: {
        titulo: 'Termos', categoria: 'Contratos',
        documento: 'Modelos de licitações e contratos — AGU/MGI', origem: 'Portal de Compras do Governo Federal', abrangencia: 'Referência federal · modelos e instrumentos',
        fonte: 'https://www.gov.br/compras/pt-br/nllc/modelos-de-licitacoes-e-contratos',
        paragrafos: [
            'O Portal de Compras reúne os modelos padronizados de documentos relacionados à Lei nº 14.133/2021, com referências da Advocacia-Geral da União e do Ministério da Gestão.',
            'A consulta inclui modelos para pregão, concorrência, contratação direta e outros objetos. Acesse a fonte para selecionar o termo de referência ou instrumento contratual correspondente ao tipo de contratação.',
        ],
        relacionado: { href: 'https://www.gov.br/compras/pt-br/acesso-a-informacao/manuais/manual-governanca-nas-contratacoes/Rev_ManualoperacionalFiscalizao_final.pdf', texto: 'Manual de gestão e fiscalização contratual' },
    },
    gestao: {
        titulo: 'Gestão', categoria: 'Contratos',
        documento: 'Manual Operacional de Gestão e Fiscalização Contratual — junho de 2025', origem: 'Ministério da Gestão e da Inovação em Serviços Públicos', abrangencia: 'Referência técnica federal',
        fonte: 'https://www.gov.br/compras/pt-br/acesso-a-informacao/manuais/manual-governanca-nas-contratacoes/Rev_ManualoperacionalFiscalizao_final.pdf', pdf: pasta + 'gestao-contratos-mgi.pdf',
        paragrafos: [
            'O manual do MGI reúne orientações sobre designação e atuação de gestores e fiscais de contratos, com referência à Lei nº 14.133/2021.',
            'O conteúdo diferencia gestão contratual e modalidades de fiscalização, apresenta o modelo de gestão e aborda o acompanhamento da execução e a documentação dos procedimentos.',
        ],
    },
};

export const dataConsultaDocumentos = '04/11/2026';
