# Migrations Supabase

Este projeto usa migrations SQL em `supabase/migrations`.

## Migration inicial

Arquivo:

- `supabase/migrations/20260428103000_initial_schema.sql`

Ela cria:

- `profiles`
- `customers`
- `products`
- `orders`
- `order_items`
- `follow_ups`

### Decisão atual

A migration inicial permanece consolidada porque o repositório não indica que ela já foi aplicada em ambiente compartilhado. Quando existir evidência de uso em ambiente real, mudanças futuras de schema devem entrar apenas como migrations incrementais.

Também cria:

- função e triggers de `updated_at`;
- foreign keys para `auth.users`;
- foreign keys compostas com `user_id` para reduzir risco de relacionamento cruzado;
- check constraints de status;
- Row Level Security em todas as tabelas;
- policies de `select`, `insert`, `update` e `delete` por `auth.uid()`.

## Como aplicar localmente

Com Supabase CLI instalado e projeto iniciado:

```bash
supabase start
supabase db reset
```

## Como aplicar em um projeto remoto

1. Faça login na CLI:

```bash
supabase login
```

2. Vincule o projeto:

```bash
supabase link --project-ref SEU_PROJECT_REF
```

3. Aplique as migrations:

```bash
supabase db push
```

## Validação estática

Antes de abrir PR ou aplicar em ambiente remoto, rode:

```bash
npm run db:validate
```

Essa validação não substitui testes reais contra Supabase, mas ajuda a impedir que alguma tabela crítica fique sem RLS ou sem policies básicas.

## Regras de segurança

- Nunca usar service role key no frontend.
- Nunca commitar `.env.local`.
- Todas as queries de dados de usuário devem depender de RLS ou filtrar por `user_id`.
- Toda policy deve usar `auth.uid()` e nunca liberar acesso global.
- Relacionamentos entre registros de negócio devem preservar o mesmo `user_id`.

## Status implementados

A migration inicial usa os seguintes valores:

- `payment_status`: `pending`, `paid`, `canceled`
- `delivery_status`: `to_prepare`, `prepared`, `delivered`, `canceled`
- `follow_up.type`: `payment`, `repurchase`, `delivery`, `custom`
- `follow_up.status`: `pending`, `done`, `dismissed`
