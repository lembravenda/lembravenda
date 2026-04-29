# First Run Experience

## Objetivo

Garantir que a primeira experiência leve a pessoa do cadastro até a primeira ação de valor sem exigir explicações técnicas ou esforço de configuração desnecessário.

## Jornada atual

1. Cadastro em [login](/Users/wagnersoares/Documents/Codex/2026-04-28/voc-o-tech-lead-product-manager/src/app/login/page.tsx)
2. Confirmação de e-mail
3. Callback em `/auth/callback`
4. Onboarding com perfil mínimo
5. Redirecionamento para a tela `Hoje`
6. Checklist de primeiros passos:
   - cadastrar primeira cliente
   - cadastrar primeiro produto
   - criar primeiro pedido
   - voltar para `Hoje` para acompanhar cobranças, entregas e recompras

## Critérios de sucesso

- A pessoa entende o que fazer em menos de 30 segundos.
- A jornada evita telas vazias sem orientação.
- Cada passo concluído revela o próximo passo principal.
- O primeiro pedido deve levar naturalmente à cobrança manual.
- O fluxo não usa jargão técnico nem fala de infraestrutura.

## Estados-chave

### Cadastro e confirmação

- A rota `/auth/callback` não deve deixar a pessoa parada na home pública.
- Se o perfil estiver incompleto, redirecionar para onboarding.
- Se o perfil estiver completo, redirecionar para `Hoje`.

### Onboarding

- Pedir apenas dados necessários para mensagens e organização básica:
  - nome
  - nome do negócio
  - telefone
  - chave Pix
  - categoria principal

### Tela Hoje com conta vazia

- Mostrar checklist de primeiros passos.
- Explicar por que começar por cliente, produto e pedido.
- Exibir CTAs claros e full-width quando fizer sentido.

## Melhorias futuras candidatas

- Destacar progresso da ativação em analytics quando a instrumentação existir.
- Transformar a área de primeiros passos em componente reutilizável para suporte e onboarding assistido.
- Testar versões alternativas do texto de boas-vindas para aumentar ativação até o primeiro pedido.
