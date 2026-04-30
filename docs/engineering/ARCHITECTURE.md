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
- RLS habilitado nas tabelas do usuário

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

- criação de `orders + order_items` ainda não é transação SQL única (cleanup compensatório ativo)
- E2E depende de ambiente com porta liberada
- CSP ainda não está aplicada — prioridade para V3 antes de escalar tráfego pago

## Implementações adicionais (abril 2026)

### Analytics
- `@vercel/analytics` e `posthog-js` instalados.
- Helper `src/lib/analytics.ts` centraliza todos os eventos.
- Componente `src/components/analytics-tracker.tsx` instrumenta page views e ações.

### PWA
- Ícones em `public/`: `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `favicon-32.png`.
- `manifest.ts` atualizado com nome, cores e ícones do Calor Profissional.

### Design System v2 — Calor Profissional
- Paleta atualizada em `tailwind.config.ts` e `globals.css`.
- Tokens CSS `--lv-amber`, `--lv-whatsapp`, `--lv-shadow-amber` adicionados.
- Instrument Serif via `next/font/google` como `--font-display`.
- Bottom nav com Liquid Glass (`backdrop-filter`).
