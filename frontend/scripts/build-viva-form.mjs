import { readFileSync, writeFileSync } from 'node:fs';
const path = new URL('../src/inscricao/form-data.json', import.meta.url);
const { config } = JSON.parse(readFileSync(path, 'utf8'));
const campo = (name, label, type = 'text', extra = {}) => ({ name, label, type, required: false, ...extra });
const cpf = { inputMode: 'numeric', maxLength: 14, placeholder: '000.000.000-00' };
const section = (titulo, campos) => ({ titulo, campos });
const sections = [
    section('1. Dados do participante', [
        campo('nome', 'Nome completo', 'text', { required: true }), campo('dataNascimento', 'Data de nascimento', 'date', { required: true }),
        campo('cpf', 'CPF', 'text', cpf), campo('rg', 'RG (se houver)'),
        campo('genero', 'Sexo (opcional)', 'select', { options: [{ value: '', text: 'Prefiro não informar' }, { value: 'M', text: 'Masculino' }, { value: 'F', text: 'Feminino' }, { value: 'O', text: 'Outro' }] }),
        campo('endereco', 'Endereço'), campo('bairro', 'Bairro'), campo('cep', 'CEP', 'text', { inputMode: 'numeric', placeholder: '32000-000' }),
        campo('telefone', 'Telefone / WhatsApp', 'tel', { required: true }), campo('email', 'E-mail', 'email'),
    ]),
    section('2. Responsável legal (para menores de 18 anos)', [
        campo('nomeResponsavel', 'Nome completo do responsável'), campo('parentesco', 'Parentesco'), campo('cpfResponsavel', 'CPF do responsável', 'text', cpf),
        campo('telefoneResponsavel', 'Telefone / WhatsApp do responsável', 'tel'), campo('telefoneAlternativo', 'Telefone alternativo', 'tel'),
    ]),
    section('3. Informações da atividade esportiva', [
        campo('modalidade', 'Modalidade pretendida', 'text', { required: true }), campo('nucleo', 'Núcleo / local', 'text', { required: true }),
        campo('turno', 'Turno de preferência', 'select', { options: [{ value: '', text: 'Selecione…' }, ...['Manhã', 'Tarde', 'Noite'].map(text => ({ value: text, text }))] }),
        campo('turmaHorario', 'Turma / horário'),
    ]),
    section('4. Saúde e segurança', [
        campo('possuiCondicaoSaude', 'Possui condição de saúde, deficiência, restrição ou adaptação relevante para a prática esportiva?', 'select', { options: [{ value: '', text: 'Selecione…' }, { value: 'nao', text: 'Não' }, { value: 'sim', text: 'Sim' }] }),
        campo('informacoesSaude', 'Informações necessárias', 'textarea'), campo('contatoEmergencia', 'Contato de emergência'), campo('telefoneEmergencia', 'Telefone do contato de emergência', 'tel'),
    ]),
    section('5. Declaração e autorização', [
        campo('dataDeclaracao', 'Betim, data', 'date', { required: true }), campo('assinatura', 'Assinatura (nome completo de quem assina)', 'text', { required: true }),
        campo('aceiteDeclaracao', 'Declaro que as informações prestadas são verdadeiras e comprometo-me a respeitar as orientações e normas do Programa Viva Esportes. Autorizo minha participação, ou a do(a) menor sob minha responsabilidade, nas atividades esportivas, observadas as orientações de segurança informadas.', 'checkbox', { required: true }),
    ]),
];
writeFileSync(path, JSON.stringify({ fonte: 'Ficha_Inscricao_Programa_Viva_Esportes.xlsx · Ficha de Inscrição · A1:D40', sections, config }, null, 2) + '\n');
console.log(`${sections.flatMap(s => s.campos).length} campos, com declaração; área da Secretaria separada.`);
