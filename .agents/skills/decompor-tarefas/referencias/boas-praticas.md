# Boas práticas de código

Aplique em cada etapa que escreve código. Se uma regra conflitar com a convenção do projeto, **a convenção do projeto vence**; anote o conflito em "Fora do escopo — sugestões".

## Consistência com o projeto

- Imite o código ao redor: nomes, idioma dos identificadores e comentários, densidade de comentários, organização de pastas, estilo de import, padrão de erros e de logs.
- Reaproveite utilitários, componentes e helpers existentes antes de criar novos. Procure (`Grep`) antes de escrever.
- Não introduza dependência nova sem necessidade clara e sem confirmação do usuário.

## Mudanças pequenas e seguras

- Mudança mínima que atende ao requisito. Sem refatorações de carona.
- Não altere assinaturas públicas, contratos de API ou formatos de dados sem que o requisito exija. Se exigir, inclua etapas para atualizar todos os chamadores.
- Não apague código "que parece não ser usado" sem provar (busca por referências) e sem que isso esteja no escopo.

## Correção

- Trate entradas inválidas, vazias e nos limites (zero, negativo, nulo, lista vazia, string longa).
- Trate erros no ponto certo: não engula exceções em silêncio, não exponha detalhes internos ao usuário final.
- Cuidado com concorrência, estado compartilhado, fusos horários, encoding e precisão numérica quando forem relevantes.

## Segurança

- Valide e sanitize entrada externa. Use consultas parametrizadas.
- Nunca escreva segredos, tokens ou senhas no código, em logs ou em mensagens.
- Respeite autenticação e autorização existentes em rotas/ações novas.

## Legibilidade

- Nomes que dizem o que a coisa é/faz. Funções curtas com uma responsabilidade.
- Sem números mágicos soltos quando o projeto usa constantes.
- Comentário explica o porquê, não o quê.

## Testes

- Se o projeto tem testes, todo comportamento novo ou corrigido ganha teste no mesmo estilo dos existentes.
- Para bug: escreva primeiro o teste que reproduz a falha, veja falhar, depois corrija.
- Rode os testes afetados a cada etapa relevante e a suíte completa na verificação final.
