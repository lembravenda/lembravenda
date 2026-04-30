# Plano de testes

## Testes unitários

- Formatação de moeda.
- Cálculo de total de pedido.
- Geração de mensagem de cobrança.
- Geração de mensagem de recompra.
- Regras separadas de `payment_status` e `delivery_status`.
- Cálculo de data de recompra.

## Testes de integração

- Criar cliente autenticado.
- Criar produto autenticado.
- Criar pedido com itens.
- Validar transições aceitas de `payment_status`: `pending`, `paid`, `canceled`.
- Validar transições aceitas de `delivery_status`: `to_prepare`, `prepared`, `delivered`, `canceled`.
- Marcar pedido como pago.
- Marcar pedido como entregue.
- Garantir que pedidos entregues com produto recorrente passam a gerar oportunidade elegível de recompra no cálculo.
- Garantir isolamento por `user_id` nas queries e políticas.
- Impedir pedido com cliente ou produto de outro usuário.
- Garantir que pedido cancelado não aparece na tela "Hoje".

## Testes E2E

- `/login` redireciona para `/onboarding` quando o usuário já está autenticada e o perfil ainda está incompleto.
- `/onboarding` redireciona para `/login` sem sessão.
- Onboarding completo.
- Criar cliente, produto e pedido.
- Copiar mensagem de cobrança.
- Marcar pedido como pago e entregue.
- Ver oportunidade de recompra na página `Recompra`.
- Marcar recompra como contatada.
- Se o ambiente local bloquear abertura de porta para o Playwright, a suíte E2E completa deve rodar em outro ambiente local ou CI antes de piloto externo.

## Testes de segurança

- Usuário A não acessa registros do usuário B.
- Tentativa de alterar `user_id` é bloqueada.
- Rotas privadas exigem autenticação.
- Service role key não aparece em bundle, logs ou variáveis públicas.
- Erros de API não expõem stack trace em produção.
- Inserts e updates não conseguem forçar `user_id` de outro usuário.

## Testes de usabilidade mobile

- Fluxos principais funcionam em viewport de celular.
- Botões têm área de toque adequada.
- Formulários são curtos e legíveis.
- Textos cabem em telas pequenas.
- Estados de loading, erro e vazio são compreensíveis.
- Tela "Hoje" permite agir com poucos toques.
