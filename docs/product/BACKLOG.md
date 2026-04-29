# Backlog

Este backlog está em ordem recomendada de implementação. Cada etapa deve preservar o MVP enxuto e só avançar depois de lint, typecheck e testes aplicáveis.

## P0.1 - Fundação técnica sem regra de negócio

- Criar app Next.js App Router com TypeScript estrito.
- Configurar Tailwind e shadcn/ui.
- Configurar lint, typecheck e runner de testes.
- Criar layout mobile-first base.
- Configurar variáveis de ambiente sem segredos no frontend.
- Criar estrutura mínima de testes Playwright para viewport mobile.

## P0.2 - Banco, autenticação e segurança base

- Configurar Supabase Auth.
- Criar migrations conceituadas em `docs/engineering/DATABASE_SCHEMA.md`.
- Habilitar RLS em `profiles`, `customers`, `products`, `orders`, `order_items` e `follow_ups`.
- Criar políticas por usuário autenticado.
- Testar acesso cruzado com dois usuários.
- Bloquear inserts e updates com `user_id` diferente de `auth.uid()`.

## P0.3 - Onboarding e perfil

- Implementar cadastro, login e logout.
- Proteger rotas privadas.
- Criar tela de onboarding de perfil.
- Editar perfil em configurações.
- Criar área simples de configurações com perfil, mensagens e conta.
- Testar sessão, rotas privadas e perfil por usuário.

## P0.4 - Clientes

- Criar cliente com nome obrigatório.
- Listar apenas clientes do usuário autenticado.
- Buscar por nome e telefone.
- Editar cliente.
- Remover, bloquear remoção ou arquivar cliente sem quebrar histórico.
- Cobrir loading, erro e estado vazio.

## P0.5 - Produtos

- Criar produto com nome e preço.
- Listar apenas produtos do usuário autenticado.
- Editar produto.
- Desativar produto sem quebrar pedidos antigos.
- Definir frequência opcional de recompra.
- Cobrir loading, erro e estado vazio.

## P0.6 - Pedidos

- Criar pedido com cliente e pelo menos um item.
- Salvar snapshot de nome e preço do produto.
- Calcular total a partir dos itens.
- Listar e detalhar pedidos do usuário autenticado.
- Usar `payment_status` e `delivery_status` como colunas canônicas de status.
- Marcar como pago.
- Marcar como entregue.
- Cancelar pedido sem apagar histórico.
- Cobrir loading, erro e estado vazio.

## P0.7 - Cobrança manual

- Gerar mensagem de cobrança com itens, total e Pix opcional.
- Copiar mensagem.
- Abrir WhatsApp manualmente via link quando houver telefone.
- Registrar `payment_message_copied` e `whatsapp_opened`.
- Garantir que não existe checkout, link de pagamento próprio, split ou confirmação automática.

## P0.8 - Recompra

- Criar follow-up de recompra após entrega quando produto tiver frequência definida.
- Listar recompras pendentes.
- Gerar e copiar mensagem de recompra.
- Marcar oportunidade como contatada.
- Registrar eventos de analytics de recompra.

## P0.9 - Tela Hoje

- Mostrar cobranças de pedidos não pagos.
- Mostrar entregas de pedidos não entregues.
- Mostrar recompras vencidas ou de hoje.
- Permitir ações rápidas: copiar cobrança, marcar pago, marcar entregue, copiar recompra e marcar contatada.
- Exibir estado vazio quando não há tarefas.
- Validar experiência em viewport mobile.

## P0.10 - QA, segurança e release

- Executar testes unitários de cálculo, mensagem e status.
- Executar testes de integração com RLS.
- Executar E2E do fluxo principal.
- Revisar bundle e variáveis para evitar vazamento de segredos.
- Revisar checklist de release.

## P1 - Piloto e aprendizado

- Instrumentar analytics definidos.
- Criar roteiro de entrevista.
- Criar formulário de feedback.
- Ajustar onboarding com base no piloto.
- Medir intenção de pagamento.
- Customizar o template `Confirm signup` do Supabase para português brasileiro e marca LembraVenda.
- Configurar SMTP próprio com domínio antes de tráfego pago ou piloto externo ampliado.

## Fora do backlog do MVP

- WhatsApp API.
- Envio automático ou agendado de mensagens.
- Checkout próprio.
- Split de pagamento.
- Emissão fiscal.
- Marketplace.
- App nativo.
- Integrações com Instagram, ERP, gateways ou catálogos externos.
