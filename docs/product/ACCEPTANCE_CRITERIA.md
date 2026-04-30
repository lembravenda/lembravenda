# Critérios de aceite

## Autenticação

- Usuária consegue criar conta, entrar e sair.
- Link de confirmação de e-mail abre sessão e não deixa a pessoa parada na home pública.
- Rotas privadas bloqueiam acesso sem sessão.
- Erros de login são exibidos em português brasileiro.
- Nenhum segredo é exposto no frontend.

## Perfil do usuário

- Perfil pertence ao usuário autenticado.
- Nome do usuário é obrigatório.
- Categoria principal é obrigatória.
- Chave Pix é opcional.
- Dados salvos aparecem nas mensagens geradas.
- Após concluir o onboarding, o usuário volta para a tela "Hoje" com orientação de primeiros passos.
- Tela possui loading, erro e estado vazio/incompleto.

## Clientes

- Cliente exige nome.
- Telefone é opcional, mas necessário para abrir WhatsApp.
- Aniversário é opcional.
- Grupos da cliente são opcionais.
- Listagem mostra apenas clientes do usuário autenticado.
- Busca filtra por nome e telefone.
- Usuária consegue criar, editar e excluir cliente com feedback claro.
- Depois de criar cliente, o app indica a próxima ação principal quando fizer sentido.
- Exclusão pede confirmação ou usa ação segura equivalente.
- Cliente com pedidos associados não pode quebrar histórico; usar bloqueio, arquivamento ou remoção segura definida na implementação.

## Produtos

- Produto exige nome e preço maior ou igual a zero.
- Categoria é opcional.
- `repurchase_interval_days` é opcional e deve ser maior que zero quando informado.
- Usuária consegue editar produto.
- Usuária consegue inativar produto sem apagar histórico.
- Produto inativo permanece visível para histórico, mas não deve aparecer como opção principal em novos pedidos.
- Campo de categoria aceita escrita livre e sugestões simples.
- Campo de recompra usa linguagem simples e sugestões rápidas de prazo.
- Listagem mostra apenas produtos do usuário autenticado.
- Busca filtra por nome.
- Depois de criar produto, o app indica a próxima ação principal quando fizer sentido.
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
- Depois de criar pedido, o app orienta cobrança ou acompanhamento do pagamento.

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
- `follow_ups` com `type = repurchase` persistem status de contato como `done` ou `dismissed` quando o usuário age sobre a oportunidade.
- Oportunidades vencidas ou de hoje aparecem na página `Recompra`.
- Mensagem de recompra pode ser copiada.
- Marcar como contatada remove a oportunidade da lista pendente.
- O app não envia mensagem automaticamente.

## Tela Hoje

- Exibe cobranças pendentes de pedidos não pagos.
- Exibe entregas pendentes de pedidos não entregues.
- Exibe pedidos recentes para acompanhamento rápido.
- Quando a conta ainda está começando, mostra checklist de primeiros passos com cliente, produto e pedido.
- Checklist marca passos concluídos quando já existem dados suficientes.
- Permite ações rápidas sem sair da tela quando possível.
- Exibe estado vazio quando não há tarefas.
- Dados pertencem apenas ao usuário autenticado.

## Configurações

- Tela apresenta área simples de perfil, mensagens e conta.
- O cadastro inicial do perfil acontece no onboarding.
- Tela mantém acesso ao logout.
- A interface de configurações não deve expor termos técnicos ao usuário final.
