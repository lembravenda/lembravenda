# Checklist de release

## Pronto

- [x] Escopo do MVP revisado contra `docs/02_MVP_SCOPE.md`.
- [x] Fluxos centrais implementados: autenticação, onboarding, clientes, produtos, pedidos, cobrança manual, tela "Hoje" e recompra.
- [x] Lint, typecheck e testes unitários podem ser executados no repositório.
- [x] RLS está modelado para todas as tabelas de negócio.
- [x] Não há WhatsApp API, checkout próprio, split, emissão fiscal, marketplace ou app nativo no release.
- [x] Mensagens deixam claro que pagamento, Pix e WhatsApp são manuais.
- [x] `.env.local` está protegido no `.gitignore`.

## Pendente

- [ ] Rodar suíte E2E crítica completa em ambiente local ou CI com porta liberada.
- [ ] Executar validação completa de acesso cruzado entre usuários em ambiente com E2E disponível.
- [ ] Instrumentar ou validar eventos críticos de analytics, se o piloto exigir essa leitura.
- [ ] Preparar política de privacidade e termos mínimos antes de piloto externo.
- [ ] Definir plano de rollback operacional do piloto.

## Bloqueador

- [ ] E2E completo pendente por limitação de ambiente no setup atual.
- [ ] Antes de piloto externo, `npm run test:e2e` precisa rodar integralmente em local/CI sem intervenção manual.
