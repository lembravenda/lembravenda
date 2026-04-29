# Critérios de aceite

## Autenticação

- Usuária consegue criar conta, entrar e sair.
- Rotas privadas bloqueiam acesso sem sessão.
- Erros de login são exibidos em português brasileiro.
- Nenhum segredo é exposto no frontend.

## Perfil da revendedora

- Perfil pertence ao usuário autenticado.
- Nome da revendedora é obrigatório.
- Categoria principal é obrigatória.
- Chave Pix é opcional.
- Dados salvos aparecem nas mensagens geradas.
- Tela possui loading, erro e estado vazio/incompleto.

## Clientes

- Cliente exige nome.
- Telefone é opcional, mas necessário para abrir WhatsApp.
- Aniversário é opcional.
- Tags são opcionais.
- Listagem mostra apenas clientes do usuário autenticado.
- Busca filtra por nome e telefone.
- Usuária consegue criar, editar e excluir cliente com feedback claro.
- Exclusão pede confirmação ou usa ação segura equivalente.
- Cliente com pedidos associados não pode quebrar histórico; usar bloqueio, arquivamento ou remoção segura definida na implementação.

## Produtos

- Produto exige nome e preço maior ou igual a zero.
- Categoria é opcional.
- `repurchase_interval_days` é opcional e deve ser maior que zero quando informado.
- Usuária consegue editar produto.
- Usuária consegue inativar produto sem apagar histórico.
- Produto inativo permanece visível para histórico, mas não deve aparecer como opção principal em novos pedidos.
- Listagem mostra apenas produtos do usuário autenticado.
- Busca filtra por nome.
- Produto usado em pedido não deve quebrar histórico.

## Pedidos

- Pedido exige cliente e pelo menos um item.
- Total é calculado a partir de itens e quantidades.
- `payment_status` inicial é `pending`.
- `delivery_status` inicial é `to_prepare`.
- `payment_status` aceita apenas `pending`, `paid` e `canceled`.
- `delivery_status` aceita apenas `to_prepare`, `prepared`, `delivered` e `canceled`.
- Usuária consegue marcar pedido como pago sem marcar como entregue.
- Usuária consegue marcar pedido como entregue sem processar pagamento no app.
- Pedido cancelado não aparece como cobrança, entrega ou recompra ativa.
- Itens do pedido guardam snapshot de nome e preço para preservar histórico.

## Cobrança

- Mensagem inclui cliente, itens, total e chave Pix quando cadastrada.
- Botão copiar deixa explícito o sucesso da cópia; o evento `payment_message_copied` pode ser instrumentado depois sem bloquear o piloto.
- Botão WhatsApp aparece ou fica desabilitado quando não há telefone válido.
- Abrir WhatsApp acontece por link manual; o evento `whatsapp_opened` pode ser instrumentado depois sem bloquear o piloto.
- Nenhum pagamento é processado pelo app.
- Não existe checkout, link de pagamento próprio, split, conciliação ou confirmação automática de pagamento.

## Recompra

- Oportunidade de recompra é calculada a partir da última compra elegível de um produto com `repurchase_interval_days`.
- Pedido cancelado não gera oportunidade de recompra.
- `follow_ups` com `type = repurchase` persistem status de contato como `done` ou `dismissed` quando a usuária age sobre a oportunidade.
- Oportunidades vencidas ou de hoje aparecem na página `Recompra`.
- Mensagem de recompra pode ser copiada.
- Marcar como contatada remove a oportunidade da lista pendente.
- O app não envia mensagem automaticamente.

## Tela Hoje

- Exibe cobranças pendentes de pedidos não pagos.
- Exibe entregas pendentes de pedidos não entregues.
- Exibe pedidos recentes para acompanhamento rápido.
- Permite ações rápidas sem sair da tela quando possível.
- Exibe estado vazio quando não há tarefas.
- Dados pertencem apenas ao usuário autenticado.

## Configurações

- No piloto atual, a tela deixa claros os limites do MVP e mantém o acesso ao logout.
- O cadastro inicial do perfil acontece no onboarding.
- Tela informa claramente limites do MVP: sem WhatsApp API, sem checkout próprio, sem split, sem emissão fiscal, sem marketplace, sem app nativo e sem intermediação financeira.
