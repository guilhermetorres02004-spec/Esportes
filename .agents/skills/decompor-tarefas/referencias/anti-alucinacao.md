# Regras anti-alucinação

## O que nunca fazer

- Citar caminho de arquivo, nome de função, classe, variável, rota, tabela ou coluna sem ter visto nesta sessão.
- Usar parâmetro, opção ou método de biblioteca de memória sem conferir a versão instalada (`package.json`, `requirements.txt`, lockfile, `go.mod`, etc.) e, quando houver dúvida, a assinatura no código ou nos tipos da lib.
- Inventar comandos de build/teste/lint. Descubra-os em `package.json` (scripts), `Makefile`, `pyproject.toml`, README, CI.
- Dizer que um teste passou, que compila ou que funciona sem ter rodado e lido a saída.
- Completar trechos de código "por padrão" quando o arquivo real pode ser diferente: leia antes.
- Resumir um arquivo que você leu só em parte como se tivesse lido inteiro.

## O que sempre fazer

- Separar **fatos** (com fonte) de **suposições** (marcadas `S`) em tudo o que escrever.
- Reler o trecho logo antes de editá-lo, mesmo que já tenha lido antes.
- Depois de editar, confirmar que a edição ficou como esperado quando houver risco (indentação, trecho repetido, arquivo grande).
- Citar `arquivo:linha` ao afirmar algo sobre o código.
- Quando uma busca não encontrar nada, dizer que não encontrou e onde procurou, em vez de presumir que não existe ou inventar um nome parecido.
- Preferir "não verifiquei" ou "não sei" a uma resposta plausível sem base.

## Sinais de alerta (pare e verifique)

- Você está escrevendo um nome de função "que provavelmente existe".
- Você está prestes a importar algo de um caminho que não viu.
- A etapa ficou muito maior do que o planejado.
- Você está há várias etapas sem rodar nenhuma verificação.
- Você não lembra exatamente qual era o requisito da etapa atual.
- A conversa ficou longa e você está trabalhando de memória sobre arquivos lidos muito antes.

Em qualquer um desses casos: interrompa, crie uma etapa de leitura/verificação e só então continue.
