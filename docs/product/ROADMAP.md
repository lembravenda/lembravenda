# Roadmap

## V0 documentação ✓

- Criar PRD, escopo, histórias, critérios, fluxos, schema, segurança, testes e GTM.
- Registrar ADR da stack.
- Definir governança para Codex.

## V1 MVP funcional ✓

- Criar app Next.js.
- Implementar autenticação, perfil, clientes, produtos, pedidos e tela "Hoje".
- Implementar mensagens manuais de cobrança e recompra.
- Implementar RLS e testes críticos.
- Não incluir WhatsApp API, checkout próprio, split, emissão fiscal, marketplace ou app nativo.

## V2 piloto (em curso — abril 2026)

**Concluído:**
- Redesign visual completo — Calor Profissional v2 (verde-floresta, âmbar, pedra-quente).
- Logo wordmark Instrument Serif no header.
- Bottom nav Liquid Glass com ícones solid/outline.
- Linguagem neutra PT-BR em toda a interface.
- PWA instalável — ícones 192px e 512px, apple-touch-icon, manifest atualizado.
- Analytics com Vercel Analytics + PostHog — todos os eventos instrumentados.
- Link de feedback nas Configurações.
- Landing page refatorada (10 blocos, mobile-first, copy posicionamento).

**Pendente do piloto:**
- Rodar piloto com primeiros usuários reais.
- Medir ativação, uso da tela "Hoje" e intenção de pagamento.
- Corrigir fricções de mobile e onboarding com base no uso real.
- Refinar mensagens e posicionamento com feedback dos usuários.
- Customizar template "Confirm signup" do Supabase para português e marca LembraVenda.
- Configurar SMTP próprio com domínio antes de tráfego pago ou piloto externo ampliado.

## V3 melhorias

- Relatórios simples (total vendido, ticket médio, clientes mais ativos).
- Templates de mensagem editáveis pelo usuário.
- Importação CSV de clientes.
- Melhorias de busca e filtros.
- Notificações push via PWA.
- CSP (Content Security Policy) completa.

## V4 monetização

- Planos pagos via provedor externo.
- Bloqueios leves por limite de uso.
- Página de planos e cobrança via provedor externo, sem checkout próprio e sem intermediar dinheiro.
- Métricas de conversão para plano pago.

## V5 automações futuras

- Avaliar automações compatíveis com políticas do WhatsApp.
- Lembretes inteligentes.
- Recomendações de recompra.
- Integrações externas somente após validação de demanda.
- App nativo só deve ser reavaliado se o PWA/webapp não resolver retenção ou notificações.
