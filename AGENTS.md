# Regras permanentes para Codex

Este repositório é do micro-SaaS **LembraVenda**. Antes de qualquer implementação ou mudança de documentação, o Codex deve seguir estas regras:

## Fonte de verdade

- Sempre ler `/docs` antes de implementar.
- Começar por [docs/README.md](/Users/wagnersoares/Documents/Codex/2026-04-28/voc-o-tech-lead-product-manager/docs/README.md) para localizar a documentação certa.
- Tratar [docs/product/MVP_SCOPE.md](/Users/wagnersoares/Documents/Codex/2026-04-28/voc-o-tech-lead-product-manager/docs/product/MVP_SCOPE.md) e [docs/product/ACCEPTANCE_CRITERIA.md](/Users/wagnersoares/Documents/Codex/2026-04-28/voc-o-tech-lead-product-manager/docs/product/ACCEPTANCE_CRITERIA.md) como fonte de verdade para escopo e aceite.
- Manter a documentação atualizada sempre que comportamento, fluxo, risco ou decisão mudarem.

## Escopo e produto

- Nunca implementar fora do escopo da tarefa.
- Nunca alterar escopo de produto sem autorização explícita.
- Priorizar mobile-first.
- Usar português brasileiro na interface.
- Nunca implementar WhatsApp API no MVP.
- Nunca implementar checkout próprio no MVP.
- Nunca implementar split de pagamento no MVP.
- Nunca implementar emissão fiscal no MVP.
- Nunca implementar marketplace no MVP.
- Nunca implementar app nativo no MVP.
- Pix será apenas chave Pix cadastrada pela revendedora e exibida em mensagens.
- Nunca intermediar dinheiro.

## Engenharia e segurança

- Usar TypeScript estrito.
- Nunca expor service role key ou segredo no frontend.
- Nunca commitar `.env.local`.
- Todo dado deve pertencer ao usuário autenticado.
- Toda query deve filtrar por `user_id` ou usar Row Level Security.
- Toda tela deve ter loading, erro e estado vazio.
- Toda feature crítica deve ter testes.

## Fluxo recomendado de trabalho

1. Ler a documentação relevante.
2. Implementar apenas o que a tarefa pede.
3. Rodar lint, typecheck e testes aplicáveis.
4. Atualizar a documentação impactada.
5. Commitar somente depois que código e docs estiverem coerentes.
