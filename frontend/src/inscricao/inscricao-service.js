export const termoImagemVersao = '2026-11-04';
export function dataLocal(hoje = new Date()) {
    return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
}
export function menorDeIdade(nascimento, hoje = new Date()) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(nascimento)) return false;
    const aniversario = Number(nascimento.slice(0, 4)) + 18 + nascimento.slice(4);
    return dataLocal(hoje) < aniversario;
}
export function maskCPF(valor) {
    return valor.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}
export function isValidCPF(valor) {
    const cpf = valor.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    const digito = tamanho => {
        let soma = 0; for (let i = 0; i < tamanho; i++) soma += Number(cpf[i]) * (tamanho + 1 - i);
        const resto = (soma * 10) % 11; return resto === 10 ? 0 : resto;
    };
    return digito(9) === Number(cpf[9]) && digito(10) === Number(cpf[10]);
}
export function montarPedido(dadosFicha, escolha) {
    return { nomeCompleto: dadosFicha.nome, cpf: dadosFicha.cpf || null, telefone: dadosFicha.telefone, ...(dadosFicha.email ? { email: dadosFicha.email } : {}),
        modalidade: dadosFicha.modalidade, dadosFicha: { ...dadosFicha }, termoImagemVersao,
        autorizaUsoImagem: escolha === 'sim' ? true : escolha === 'nao' ? false : null };
}
export async function enviarInscricao(pedido, { fetcher = fetch, signal } = {}) {
    const response = await fetcher('/api/inscricoes', { method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pedido), signal });
    if (!response.ok) {
        const falha = await response.json().catch(() => ({}));
        throw new Error(falha.mensagem || 'Não foi possível concluir a inscrição. Confira os dados e tente novamente.');
    }
    const inscricao = await response.json();
    if (!inscricao?.id) throw new Error('O servidor não confirmou a inscrição. Verifique antes de tentar novamente.');
    return inscricao;
}
