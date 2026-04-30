# Fluxos de UX

## Onboarding

1. Usuária cria conta ou entra.
2. App verifica se o perfil está completo.
3. Se o cadastro foi confirmado por e-mail, o link leva para `/auth/callback`, que abre a sessão e manda a pessoa para o lugar certo.
4. Se o perfil estiver incompleto, app exibe formulário curto: nome, marca, telefone e chave Pix opcional.
5. Ao salvar, envia para a tela "Hoje" com card de "Primeiros passos".
6. O card orienta cliente, produto e pedido sem abrir wizard complexo.
7. Se pular campos opcionais, mantém aviso discreto em configurações.

## Criar cliente

1. Usuária toca em "Clientes".
2. Toca em adicionar.
3. Preenche nome, telefone opcional e observações.
4. Salva.
5. App mostra cliente criado e opção de criar pedido para ele.

## Criar produto

1. Usuária toca em "Produtos".
2. Toca em adicionar.
3. Preenche nome, preço e frequência de recompra opcional.
4. Salva.
5. Produto aparece disponível para pedidos.

## Criar pedido

1. Usuária toca em "Pedidos" ou inicia a partir de um cliente.
2. Seleciona cliente.
3. Adiciona um ou mais produtos e quantidades.
4. Confere total.
5. Salva pedido com pagamento pendente e entrega pendente.
6. App oferece ação de cobrar cliente.

## Cobrar cliente pelo WhatsApp manual

1. Usuária abre pedido com pagamento pendente.
2. App gera mensagem com resumo e chave Pix, se cadastrada.
3. Usuária copia a mensagem ou toca em abrir WhatsApp.
4. O envio acontece manualmente fora do app.
5. App registra evento de cópia ou abertura.
6. App não sabe se a mensagem foi enviada nem se o pagamento aconteceu.

## Marcar pedido como pago

1. Usuária abre pedido com pagamento pendente.
2. Toca em "Marcar como pago".
3. Confirma a ação.
4. Status financeiro muda para pago.
5. Cobrança sai da lista de pendências da tela "Hoje".

## Marcar pedido como entregue

1. Usuária abre pedido com entrega pendente.
2. Toca em "Marcar como entregue".
3. Confirma a ação.
4. Status de entrega muda para entregue.
5. Entrega sai das pendências.
6. App passa a considerar aquela compra para futuras oportunidades de recompra quando o produto tiver frequência cadastrada.

## Gerar oportunidade de recompra

1. Pedido entregue contém produto com frequência de recompra.
2. App calcula data estimada dinamicamente a partir da última compra elegível.
3. Na data, oportunidade aparece na página `Recompra`.
4. Usuária copia mensagem ou abre o WhatsApp manualmente.
5. Ao marcar como contatada, `follow_ups` persiste o estado para a oportunidade não voltar como pendente.

## Tela Hoje

1. Usuária abre o app.
2. Tela "Hoje" carrega tarefas separadas por cobrança, entrega e pedidos recentes.
3. Se a conta ainda não tem base suficiente, a tela mostra checklist de primeiros passos com CTAs claros.
4. Usuária toca em uma tarefa para agir.
5. Ao concluir, tarefa desaparece ou muda de seção.
6. Se não houver tarefas e o usuário já tiver criado a base inicial, app mostra estado vazio da rotina do dia.
