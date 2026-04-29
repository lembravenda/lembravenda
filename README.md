# Agenda Inteligente para Revendedoras

Webapp mobile-first para revendedoras e social sellers que vendem por WhatsApp e Instagram. O produto ajuda a controlar clientes, produtos, pedidos, cobranças manuais e lembretes de recompra sem assumir o papel de gateway de pagamento, checkout, marketplace, emissão fiscal, app nativo ou automação oficial do WhatsApp.

## Objetivo do MVP

Validar se revendedoras pagariam por uma agenda simples, rápida e confiável para organizar o dia de venda: saber quem cobrar, quais pedidos entregar e quando chamar clientes para recompra.

O MVP deve entregar valor com fluxos manuais assistidos:

- Cadastro de clientes, produtos e pedidos.
- Mensagens prontas para copiar e enviar manualmente.
- Status de pagamento e entrega.
- Oportunidades de recompra.
- Tela "Hoje" com prioridades do dia.

O MVP não envia mensagens automaticamente, não usa WhatsApp API, não processa pagamentos, não faz split, não emite nota fiscal, não possui checkout próprio, não é marketplace e não tem app nativo. Pix é apenas uma chave cadastrada pela revendedora e exibida em mensagens copiáveis.

Na versão atual do piloto, a tela **Hoje** prioriza cobranças, entregas e pedidos recentes. As oportunidades de recompra ficam na página **Recompra**, com mensagem pronta e marcação manual de contato.

## Estrutura de pastas

```text
/
├── AGENTS.md
├── README.md
└── docs/
    ├── 01_PRD.md
    ├── 02_MVP_SCOPE.md
    ├── 03_USER_STORIES.md
    ├── 04_ACCEPTANCE_CRITERIA.md
    ├── 05_UX_FLOWS.md
    ├── 06_DATABASE_SCHEMA.md
    ├── 07_SECURITY_REQUIREMENTS.md
    ├── 08_TEST_PLAN.md
    ├── 09_RELEASE_CHECKLIST.md
    ├── 10_ANALYTICS_EVENTS.md
    ├── 11_ROADMAP.md
    ├── 12_BACKLOG.md
    ├── 13_RISK_REGISTER.md
    ├── 14_GO_TO_MARKET.md
    ├── 15_SUPABASE_MIGRATIONS.md
    └── ADR/
        └── 0001-stack.md
```

## Como o projeto deve evoluir

1. Manter a documentação como fonte de verdade antes de implementar.
2. Criar o app apenas quando o escopo do MVP estiver validado.
3. Implementar em fatias pequenas, com testes e critérios de aceite claros.
4. Validar com usuárias reais antes de expandir automações, integrações ou monetização.
5. Evitar complexidade de CRM, marketplace, checkout e integrações no MVP.

## Como trabalhar com Codex neste repositório

- Comece toda tarefa lendo `AGENTS.md` e os arquivos relevantes em `docs/`.
- Descreva claramente o escopo antes de pedir implementação.
- Não peça dependências, app Next.js ou código de aplicação enquanto a tarefa for apenas documental.
- Para implementação futura, exigir lint, typecheck e testes antes do encerramento.
- Respeitar as decisões de segurança: dados por usuário, RLS, sem segredos no frontend e sem intermediação de dinheiro.

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
3. Criar migrations seguindo `docs/06_DATABASE_SCHEMA.md`.
4. Habilitar RLS antes de qualquer tela consultar dados reais.
5. Criar testes de acesso cruzado entre usuários antes de liberar funcionalidades de negócio.
6. Nunca usar service role key no frontend.

### Redirect URLs do Supabase Auth

Antes de testar cadastro com confirmação por e-mail, configure no Supabase Auth:

- `http://localhost:3000/**`
- `https://lembravenda.vercel.app/**`
- `https://lembravenda.vercel.app/auth/callback`

O app usa a rota `/auth/callback` para trocar o `code` do e-mail por sessão e redirecionar a pessoa para `/onboarding` ou `/app/hoje`.

As instruções de aplicação das migrations estão em `docs/15_SUPABASE_MIGRATIONS.md`.

Para validar a migration inicial de forma estática:

```bash
npm run db:validate
```

### Como aplicar migrations no Supabase

Use o guia completo em `docs/15_SUPABASE_MIGRATIONS.md`.

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

## Decisão sobre migrations

A migration inicial segue consolidada porque não há nenhum indicativo no repositório de que ela já tenha sido aplicada em ambiente compartilhado. Se isso mudar, as próximas alterações de schema devem entrar como migrations incrementais.

## Próximo passo recomendado

Usar `docs/09_RELEASE_CHECKLIST.md` como gate final do piloto e só seguir para usuárias externas depois de rodar a suíte E2E completa em um ambiente sem bloqueio de porta.
