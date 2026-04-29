# Escopo do MVP

## Entra no MVP

- Autenticação com e-mail ou provedor simples suportado pela stack.
- Perfil da revendedora.
- Cadastro, edição, listagem e exclusão segura de clientes.
- Cadastro, edição, listagem e inativação segura de produtos.
- Criação de pedidos com múltiplos itens.
- Status financeiro do pedido: `pending`, `paid` ou `canceled`.
- Status de entrega do pedido: `to_prepare`, `prepared`, `delivered` ou `canceled`.
- Cancelamento simples de pedido.
- Mensagem de cobrança gerada a partir do pedido, com chave Pix opcional.
- Botão para copiar mensagem.
- Link manual para abrir WhatsApp com mensagem, quando houver telefone.
- Página de recompra com oportunidades derivadas de pedidos, mensagem pronta e marcação de contato.
- Follow-ups de recompra usados para persistir estado de contato (`done` ou `dismissed`) quando aplicável.
- Tela "Hoje" com cartões de cobrança, entrega e pedidos recentes.
- Configurações informativas com limites claros do MVP.
- Estados de loading, erro e vazio em todas as telas.
- Eventos de analytics documentados, sem bloquear o piloto enquanto a instrumentação não existir.
- Testes para fluxos críticos.

## Não entra no MVP

- WhatsApp API.
- Envio automático ou agendado de mensagens.
- Checkout próprio.
- Split de pagamento.
- Link de pagamento próprio.
- Processamento, custódia ou conciliação de dinheiro.
- Integração com gateway de pagamento.
- Emissão fiscal ou nota fiscal.
- Marketplace.
- Controle avançado de estoque.
- Catálogo público.
- Multiusuário por loja.
- Permissões por equipe.
- Aplicativo nativo.
- Integrações com Instagram, marketplaces ou ERPs.

## Futuro pós-MVP

- Planos pagos e cobrança via provedor externo.
- Relatórios de vendas e recompra.
- Importação de contatos via CSV.
- Templates de mensagem personalizáveis.
- Sugestões inteligentes de recompra.
- Automações futuras respeitando políticas do WhatsApp.
- PWA instalável com recursos offline limitados.
- Multiatendimento para equipes pequenas.
- Gestão simples de estoque.
- Emissão fiscal apenas se houver demanda validada e parceiro especializado.
