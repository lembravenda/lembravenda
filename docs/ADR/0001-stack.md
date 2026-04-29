# ADR 0001 - Stack inicial

## Status

Proposta aceita para o MVP.

## Contexto

O produto precisa ser mobile-first, rápido de desenvolver, seguro por padrão e simples de hospedar. O MVP não exige backend complexo, filas, integrações externas, checkout próprio, split, emissão fiscal, marketplace nem app nativo.

## Decisão

Usar:

- Next.js App Router.
- TypeScript.
- Tailwind.
- shadcn/ui.
- Supabase Auth.
- Supabase Postgres.
- Supabase Row Level Security.
- Playwright.
- Vercel.

## Justificativa

- **Next.js App Router:** permite criar webapp mobile-first com rotas protegidas, server components, deploy simples e caminho futuro para PWA se a validação justificar.
- **TypeScript:** reduz erros em regras de negócio de pedidos, status e mensagens.
- **Tailwind:** acelera UI mobile-first com consistência visual.
- **shadcn/ui:** oferece componentes acessíveis e customizáveis sem prender o projeto a um tema fechado.
- **Supabase Auth:** entrega autenticação madura sem construir sistema próprio de senhas.
- **Supabase Postgres:** banco relacional adequado para clientes, produtos, pedidos e follow-ups.
- **Supabase Row Level Security:** requisito central para isolamento por usuária.
- **Playwright:** cobre fluxos críticos mobile e regressões de experiência.
- **Vercel:** deploy simples para Next.js, previews por branch e boa integração com variáveis de ambiente.

## Consequências

- O time deve dominar políticas RLS antes de expor dados reais.
- A arquitetura deve evitar lógica sensível apenas no cliente.
- O MVP ganha velocidade, mas precisa de disciplina para não virar uma aplicação cheia de dependências antes da validação.
- Recursos financeiros ou automações de WhatsApp não devem ser adicionados por conveniência técnica; continuam fora do MVP mesmo que a stack permita.
