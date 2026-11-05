export function fotoValida(foto) {
    if (!foto || typeof foto.titulo !== 'string' || !Array.isArray(foto.categorias)) return false;
    try {
        const fonte = new URL(foto.origem);
        return fonte.protocol === 'https:' && fonte.hostname === 'www.betim.mg.gov.br'
            && !fonte.port && !fonte.username && /^\/portal\/noticias\/0\/3\/\d+\//.test(fonte.pathname)
            && /^\/api\/fotos\/imagens\/[a-f0-9]{32}$/.test(foto.url);
    } catch { return false; }
}

export function fotosDaCategoria(fotos, categoria) {
    return fotos.filter(f => fotoValida(f) && f.categorias.includes(categoria));
}

export function creditoFoto(foto) {
    return `Prefeitura de Betim${foto.publicadoEm ? ` · ${foto.publicadoEm}` : ''}`;
}
