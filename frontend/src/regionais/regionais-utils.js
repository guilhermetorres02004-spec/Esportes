export const filtrosVazios = { regional: '', bairro: '', modalidade: '', tipo: '', programa: '' };
export function filtrarEquipamentos(equipamentos, filtros) {
    return equipamentos.filter(item => (!filtros.regional || item.regionais.includes(filtros.regional))
        && (!filtros.bairro || item.bairro === filtros.bairro)
        && (!filtros.modalidade || item.modalidades.includes(filtros.modalidade))
        && (!filtros.tipo || item.tipo === filtros.tipo)
        && (!filtros.programa || item.programas.includes(filtros.programa)));
}
export function comoChegar(item) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.nome}, ${item.endereco || item.bairro || ''}, Betim MG`)}`;
}
export function catalogoValido(data) {
    return data?.versao === 1 && Array.isArray(data.regionais) && data.regionais.length === 10
        && ['equipamentos', 'programas', 'eventos'].every(key => Array.isArray(data[key]) && data[key].every(item =>
            typeof item.id === 'string' && typeof item.nome === 'string' && Array.isArray(item.regionais)
            && Array.isArray(item.modalidades) && Array.isArray(item.programas)
            && typeof item.fonte === 'string' && /^https:\/\/(regionais\.betim\.digital|www\.betim\.mg\.gov\.br|betim\.mg\.gov\.br)\//.test(item.fonte)
            && (!item.foto || /^\/Imagens\/regionais\/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/.test(item.foto))));
}
