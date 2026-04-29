# Schema conceitual do banco de dados

Todas as tabelas de dados de negócio devem possuir `user_id` e pertencer ao usuário autenticado. RLS deve impedir acesso cruzado.

## profiles

- `id`: UUID, chave primária, igual ao ID do usuário autenticado.
- `full_name`: texto, obrigatório.
- `brand_name`: texto, opcional.
- `phone`: texto, opcional.
- `pix_key`: texto, opcional.
- `primary_category`: texto, obrigatório.
- `created_at`: timestamp.
- `updated_at`: timestamp.

## customers

- `id`: UUID, chave primária.
- `user_id`: UUID, obrigatório, referência ao usuário.
- `name`: texto, obrigatório.
- `phone`: texto, opcional.
- `birthday`: data, opcional.
- `tags`: lista de textos, opcional.
- `notes`: texto, opcional.
- `created_at`: timestamp.
- `updated_at`: timestamp.

## products

- `id`: UUID, chave primária.
- `user_id`: UUID, obrigatório, referência ao usuário.
- `name`: texto, obrigatório.
- `price_cents`: inteiro, obrigatório.
- `category`: texto, opcional.
- `repurchase_interval_days`: inteiro, opcional.
- `is_active`: booleano, padrão verdadeiro.
- `created_at`: timestamp.
- `updated_at`: timestamp.

## orders

- `id`: UUID, chave primária.
- `user_id`: UUID, obrigatório, referência ao usuário.
- `customer_id`: UUID, obrigatório, referência a `customers`.
- `payment_status`: enum conceitual: `pending`, `paid`, `canceled`.
- `delivery_status`: enum conceitual: `to_prepare`, `prepared`, `delivered`, `canceled`.
- `canceled_at`: timestamp, opcional.
- `total_cents`: inteiro, obrigatório.
- `payment_due_date`: data, opcional.
- `delivery_due_date`: data, opcional.
- `paid_at`: timestamp, opcional.
- `delivered_at`: timestamp, opcional.
- `notes`: texto, opcional.
- `created_at`: timestamp.
- `updated_at`: timestamp.

## order_items

- `id`: UUID, chave primária.
- `user_id`: UUID, obrigatório, referência ao usuário.
- `order_id`: UUID, obrigatório, referência a `orders`.
- `product_id`: UUID, opcional, referência a `products`.
- `product_name_snapshot`: texto, obrigatório.
- `unit_price_cents`: inteiro, obrigatório.
- `quantity`: inteiro, obrigatório.
- `line_total_cents`: inteiro, obrigatório.
- `created_at`: timestamp.
- `updated_at`: timestamp.

## follow_ups

- `id`: UUID, chave primária.
- `user_id`: UUID, obrigatório, referência ao usuário.
- `customer_id`: UUID, obrigatório, referência a `customers`.
- `product_id`: UUID, opcional, referência a `products`.
- `order_id`: UUID, opcional, referência a `orders`.
- `type`: enum conceitual: `payment`, `repurchase`, `delivery`, `custom`.
- `status`: enum conceitual: `pending`, `done`, `dismissed`.
- `due_date`: data, obrigatório.
- `message_snapshot`: texto, opcional.
- `done_at`: timestamp, opcional.
- `dismissed_at`: timestamp, opcional.
- `created_at`: timestamp.
- `updated_at`: timestamp.

## Regras de consistência

- `orders.customer_id` deve apontar para cliente do mesmo `user_id`.
- `order_items.order_id` deve apontar para pedido do mesmo `user_id`.
- `order_items.product_id`, quando preenchido, deve apontar para produto do mesmo `user_id`.
- Produtos inativos podem continuar referenciáveis para histórico, mas não devem ser a lista principal para novos pedidos.
- `follow_ups.customer_id`, `product_id` e `order_id`, quando preenchidos, devem apontar para registros do mesmo `user_id`.
- Na versão atual do piloto, oportunidades de recompra são derivadas dinamicamente; `follow_ups` persiste principalmente o estado de contato (`done` ou `dismissed`) e o `message_snapshot`.
- `total_cents` deve ser igual à soma de `order_items.line_total_cents`.
- A criação de `orders` + `order_items` ainda não usa transação SQL única; hoje existe cleanup compensatório na aplicação se o insert dos itens falhar.
- Melhoria futura recomendada: função Postgres/RPC para criação atômica do pedido e seus itens.
- Pedido cancelado é identificado por `payment_status = canceled`, `delivery_status = canceled` ou `canceled_at` preenchido e não deve aparecer em cobranças, entregas ou recompras ativas.
- O MVP não precisa de tabelas de pagamentos, checkout, nota fiscal, marketplace, equipes ou integrações.
