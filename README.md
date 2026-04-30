# LembraVenda

O LembraVenda é um webapp mobile-first para quem vende pelo WhatsApp organizar clientes, produtos, pedidos, cobranças manuais e recompras com simplicidade.

## Status atual

- MVP funcional
- produção online: [https://lembravenda.vercel.app](https://lembravenda.vercel.app)
- aprovado para piloto externo — design system v2 Calor Profissional implementado
- documentação reorganizada como fonte de verdade do projeto

O produto não envia mensagens automaticamente, não usa WhatsApp API, não processa pagamentos, não faz checkout, não faz split, não emite nota fiscal e não é marketplace.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth + Postgres + Row Level Security
- Playwright
- Vercel

## Documentação

- índice geral: [docs/README.md](/Users/wagnersoares/Documents/Codex/2026-04-28/voc-o-tech-lead-product-manager/docs/README.md)
- produto: [docs/product](/Users/wagnersoares/Documents/Codex/2026-04-28/voc-o-tech-lead-product-manager/docs/product)
- UX: [docs/ux](/Users/wagnersoares/Documents/Codex/2026-04-28/voc-o-tech-lead-product-manager/docs/ux)
- pesquisa: [docs/research](/Users/wagnersoares/Documents/Codex/2026-04-28/voc-o-tech-lead-product-manager/docs/research)
- brand: [docs/brand](/Users/wagnersoares/Documents/Codex/2026-04-28/voc-o-tech-lead-product-manager/docs/brand)
- engenharia: [docs/engineering](/Users/wagnersoares/Documents/Codex/2026-04-28/voc-o-tech-lead-product-manager/docs/engineering)
- QA: [docs/qa](/Users/wagnersoares/Documents/Codex/2026-04-28/voc-o-tech-lead-product-manager/docs/qa)

## Último status de QA

- relatório principal: [docs/qa/QA_REPORT_2026-04-29.md](/Users/wagnersoares/Documents/Codex/2026-04-28/voc-o-tech-lead-product-manager/docs/qa/QA_REPORT_2026-04-29.md)
- validação do release `ba45761`: [docs/qa/RELEASE_VALIDATION_BA45761.md](/Users/wagnersoares/Documents/Codex/2026-04-28/voc-o-tech-lead-product-manager/docs/qa/RELEASE_VALIDATION_BA45761.md)

## Como evoluir o projeto

1. Tratar a documentação como fonte de verdade antes de cada implementação.
2. Implementar em fatias pequenas com critérios de aceite claros.
3. Rodar verificações locais antes de abrir ou concluir mudanças.
4. Atualizar documentação sempre que comportamento, fluxo ou escopo mudarem.
5. Validar com pessoas reais antes de expandir escopo ou aquisição.

## Setup técnico

### Como instalar

```bash
npm install
```

### Como configurar ambiente local

Crie um arquivo `.env.local` a partir de `.env.example`:

```bash
cp .env.example .env.local
```

**Nunca faça commit de `.env.local`.**

Preencha apenas chaves públicas do Supabase no formato abaixo. Nunca coloque service role key ou segredos no frontend.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

### Como rodar localmente

```bash
npm run dev
```

O app sobe em `http://127.0.0.1:3000`.

### Como rodar verificações

```bash
npm run lint
npm run typecheck
npm run format
npm run test:unit
npm run test:e2e
```

`npm run test:e2e` deve subir o servidor de teste sozinho usando Playwright em `http://127.0.0.1:3200` por padrão.

Se o ambiente bloquear a porta automática do Playwright, rode:

```bash
npm run dev
npm run test:e2e:local
```

Nesse fallback, os testes usam `http://127.0.0.1:3000`.

Antes de qualquer piloto externo, a suíte E2E completa precisa rodar integralmente em local ou CI com porta liberada.

Se for a primeira execução do Playwright na máquina, instale o navegador usado nos testes:

```bash
npx playwright install chromium
```

### Como funciona o `E2E_AUTH_MODE`

- O Playwright sobe a aplicação com `E2E_AUTH_MODE=enabled` em uma porta isolada.
- A porta padrão da suíte é `3200`, mas pode ser trocada com `PLAYWRIGHT_PORT`.
- A `baseURL` explícita da suíte é `http://127.0.0.1:<porta>`, ou `PLAYWRIGHT_BASE_URL` quando informado.
- Quando `PLAYWRIGHT_SKIP_WEBSERVER=1`, o Playwright não sobe servidor próprio e espera que a aplicação já esteja rodando.
- Esse modo existe apenas para testes locais e automatizados.
- Ele só pode ser ativado quando `NODE_ENV` não é `production`.
- Nesse modo, login, logout e onboarding usam cookies `httpOnly` efêmeros para simular sessão e perfil.
- Esse modo não usa service role key, não chama APIs administrativas do Supabase e não substitui a autenticação real.
- Em produção, o bypass fica desativado mesmo que a variável `E2E_AUTH_MODE` exista.

### Como configurar Supabase depois

1. Criar projeto no Supabase.
2. Copiar somente `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` para `.env.local`.
3. Criar migrations seguindo [docs/engineering/DATABASE_SCHEMA.md](/Users/wagnersoares/Documents/Codex/2026-04-28/voc-o-tech-lead-product-manager/docs/engineering/DATABASE_SCHEMA.md).
4. Habilitar RLS antes de qualquer tela consultar dados reais.
5. Criar testes de acesso cruzado entre usuários antes de liberar funcionalidades de negócio.
6. Nunca usar service role key no frontend.

### Redirect URLs do Supabase Auth

Antes de testar cadastro com confirmação por e-mail, configure no Supabase Auth:

- `http://localhost:3000/**`
- `https://lembravenda.vercel.app/**`
- `https://lembravenda.vercel.app/auth/callback`

O app usa a rota `/auth/callback` para trocar o `code` do e-mail por sessão e redirecionar a pessoa para `/onboarding` ou `/app/hoje`.

As instruções de aplicação das migrations estão em [docs/engineering/SUPABASE_MIGRATIONS.md](/Users/wagnersoares/Documents/Codex/2026-04-28/voc-o-tech-lead-product-manager/docs/engineering/SUPABASE_MIGRATIONS.md).

Para validar a migration inicial de forma estática:

```bash
npm run db:validate
```

### Como aplicar migrations no Supabase

Use o guia completo em [docs/engineering/SUPABASE_MIGRATIONS.md](/Users/wagnersoares/Documents/Codex/2026-04-28/voc-o-tech-lead-product-manager/docs/engineering/SUPABASE_MIGRATIONS.md).

Fluxo típico:

```bash
supabase login
supabase link --project-ref SEU_PROJECT_REF
supabase db push
```

Se estiver usando Supabase local:

```bash
supabase start
supabase db reset
```

### Como fazer deploy na Vercel

1. Criar um projeto na Vercel a partir deste repositório GitHub.
2. Configurar as variáveis de ambiente públicas:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Garantir que as migrations já foram aplicadas no Supabase antes de testar fluxos reais.
4. Publicar primeiro em preview e validar autenticação, rotas privadas e mensagens manuais.
5. Nunca configurar service role key no frontend nem em variáveis públicas do projeto.

### Como publicar no GitHub

Antes do primeiro push:

- confirme que `.env.local` continua fora do repositório;
- use `.env.example` como referência pública;
- rode `npm run lint`, `npm run typecheck`, `npm run format` e `npm run test:unit`;
- rode `npm run test:e2e` em uma máquina ou CI com porta liberada.

Fluxo sugerido:

```bash
git init -b main
git add .
git commit -m "chore: bootstrap MVP"
git remote add origin git@github.com:SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
```

Se preferir HTTPS:

```bash
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
```

## Estado atual — abril 2026

### Implementado
- Design system Calor Profissional v2 (verde-floresta, âmbar, pedra-quente)
- Logo wordmark Instrument Serif
- Bottom nav Liquid Glass com ícones solid/outline
- PWA instalável (manifest + ícones 192/512/apple-touch)
- Analytics: Vercel Analytics + PostHog instrumentados
- Feedback link nas Configurações
- Landing page mobile-first (10 blocos)
- Linguagem neutra PT-BR em toda a interface

### Próximos passos
1. Rodar piloto com primeiros usuários reais.
2. Medir ativação e intenção de pagamento (métricas em [docs/product/PRD.md](/docs/product/PRD.md)).
3. Customizar e-mail de confirmação do Supabase para a marca LembraVenda.
4. Configurar SMTP com domínio próprio antes de tráfego pago.
5. CSP (Content Security Policy) — V3.
