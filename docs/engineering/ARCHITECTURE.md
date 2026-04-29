# Architecture

## Visão geral

O LembraVenda é um webapp mobile-first em Next.js App Router com autenticação Supabase, dados em Postgres e isolamento por usuária via Row Level Security.

## Camadas principais

### App Router

- rotas públicas: `/`, `/login`, `/auth/callback`
- rotas privadas: `/app/*`
- layouts server-side para proteção de acesso

### Autenticação

- Supabase Auth
- callback de confirmação de e-mail em `/auth/callback`
- redirecionamento por completude de perfil

### Dados

- tabelas principais: `profiles`, `customers`, `products`, `orders`, `order_items`, `follow_ups`
- `user_id` obrigatório em dados da conta
- RLS habilitado nas tabelas da usuária

### Lógica de negócio

- server actions para escrita
- helpers puros para formatação, mensagens e cálculos
- histórico de pedidos preservado por snapshot em `order_items`

### Testes

- unitários com `node --test`
- E2E com Playwright
- modo E2E local controlado para sessão simulada fora de produção

## Decisões importantes

- cobrança e recompra são manuais, com mensagem pronta e link `wa.me`
- sem automação oficial de WhatsApp
- sem checkout e sem intermediação financeira
- produto inativo some da seleção principal de pedidos novos, mas continua no histórico

## Pendências técnicas conhecidas

- criação de `orders + order_items` ainda não é transação SQL única
- E2E depende de ambiente com porta liberada
- CSP ainda não está aplicada para evitar quebra prematura do app
