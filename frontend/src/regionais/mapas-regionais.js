// Referências das administrações em https://regionais.betim.digital/; não são limites territoriais.
export const enderecosRegionais = {
    centro: 'Rua Vicente Rodrigues de Lana, 72, Centro', norte: 'Rua do Rosário, 1840, Angola',
    alterosas: 'Avenida Campos de Ouriques, 1603, Jardim das Alterosas 1ª Seção',
    ptb: 'Avenida Rio Madeira, 1497, Guanabara', icaivera: 'Rua Lurossa, 544, Icaivera',
    citrolandia: 'Avenida Dr. José Mariano, 843, Citrolândia', imbirucu: 'Avenida São Caetano, 230, Imbiruçu',
    teresopolis: 'Rua Cambuci, 130, Chácara Santo Antônio', petrovale: 'Rua Índia, 263, Petrovale',
    vianopolis: 'Rua Conceição Lima, 231, Vianópolis',
};
export function regionalMapQuery(regional) {
    const endereco = enderecosRegionais[regional?.id];
    return endereco ? `${endereco}, Betim, MG, Brasil` : 'Betim, MG, Brasil';
}
export function regionalMapEmbed(regional) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(regionalMapQuery(regional))}&output=embed&hl=pt-BR`;
}
export function regionalMapLink(regional) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(regionalMapQuery(regional))}`;
}
