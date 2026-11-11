# Inscrição baseada na ficha Viva Esportes

Referência fornecida pelo usuário: `Ficha_Inscricao_Programa_Viva_Esportes.xlsx`, aba `Ficha de Inscrição`, intervalo `A1:D40`. Arquivo original preservado em `C:/Users/walter/Desktop/Arquivos esportes/`. Leitura somente das células e listas de validação do XLSX; conteúdo tratado como referência de formulário.

| Origem | Página React `/inscricao` |
| --- | --- |
| A5:D11 | Dados do participante: nome, nascimento, CPF, RG, sexo opcional, endereço, bairro, CEP, telefone e e-mail |
| A13:D16 | Responsável legal: nome, parentesco, CPF, telefone e telefone alternativo |
| A18:D21 | Modalidade, núcleo/local, turno e turma/horário |
| A23:D26 | Condição de saúde, deficiência, restrição/adaptação, informações necessárias e contato/telefone de emergência |
| A28:D33 | Declaração de veracidade e autorização de participação, data e nome de quem assina |
| A35:D37 | Área da Secretaria: número, data de recebimento, situação e servidor responsável |
| A39:D40 | Finalidade dos dados e orientação sobre assinatura do responsável |

Listas confirmadas: turno (`Manhã`, `Tarde`, `Noite`), condição de saúde (`Não`, `Sim`) e situação administrativa (`Inscrito(a)`, `Lista de espera`, `Pendente`). A situação não é inferida nem editável no formulário público, pois a API atual não oferece esse fluxo administrativo.

## Adaptações para a página

- Mantidos os requisitos existentes de nome, nascimento, telefone, modalidade e núcleo; declaração, data e nome de quem assina acrescentados à confirmação. Nome, parentesco e telefone do responsável são obrigatórios quando a data informada indica menor de 18 anos. CPF permanece opcional, com validação quando preenchido.
- Assinatura representada pelo nome informado e aceite explícito da declaração; não há desenho de assinatura ou certificação digital. A página informa que a ficha física poderá exigir assinatura própria.
- Modalidade e núcleo aceitam texto livre, como na ficha, com sugestões já existentes do portal. A planilha não restringe essas opções a quatro modalidades.
- A área exclusiva da Secretaria não contém campos editáveis pelo participante. Número e data são exibidos somente quando retornados pelo servidor; situação e servidor ficam para preenchimento pela Secretaria. Não foi criado um editor administrativo desses campos.
- Consentimento de uso de imagem existente preservado separadamente e opcional: autorizar, negar ou não escolher. A declaração de participação não concede autorização de imagem.
- Campos da página anterior ausentes na referência (tamanhos de uniforme/calçado, NIS, tipo sanguíneo e perguntas médicas antigas) foram substituídos pelos campos da planilha.
- Todos os dados preenchidos seguem em `dadosFicha`; e-mail também usa o campo `email` já suportado pela API. Sem alterações de banco ou contratos do backend.

Estrutura em `frontend/src/inscricao/form-data.json`; manutenção por `frontend/scripts/build-viva-form.mjs`. O extrator HTML antigo foi redirecionado para arquivos de referência legada, evitando sobrescrever a ficha atual.

Verificação em 11/11/2026: build e 127 testes frontend aprovados. Testes incluem os novos campos, aniversário de 18 anos, exigência de responsável, três estados de imagem, payload completo, protocolo e bloqueio de duplicação. Aparência no navegador e envio real não foram verificados nesta sessão; não foram criados registros no banco operacional.
