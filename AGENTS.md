# Regras permanentes para Codex

Este repositório é do micro-SaaS **Agenda Inteligente para Revendedoras**. Antes de qualquer implementação, o Codex deve seguir estas regras:

- Sempre ler `/docs` antes de implementar.
- Tratar `docs/02_MVP_SCOPE.md` e `docs/04_ACCEPTANCE_CRITERIA.md` como fonte de verdade para escopo e aceite.
- Nunca implementar fora do escopo da tarefa.
- Usar TypeScript estrito.
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
- Nunca expor service role key ou segredo no frontend.
- Todo dado deve pertencer ao usuário autenticado.
- Toda query deve filtrar por `user_id` ou usar Row Level Security.
- Toda tela deve ter loading, erro e estado vazio.
- Toda feature crítica deve ter testes.
- Sempre rodar lint, typecheck e testes antes de finalizar.
