# Eventos de analytics

Eventos devem evitar dados pessoais em propriedades. Usar IDs internos quando necessário e nunca enviar nome de cliente, telefone, chave Pix, endereço, observações ou conteúdo completo de mensagens.

Status atual: os eventos abaixo estão definidos na documentação, mas a instrumentação ainda não foi implementada no app. Isso não bloqueia a cobrança manual do MVP.

| Evento                          | Quando dispara                   | Propriedades sugeridas          |
| ------------------------------- | -------------------------------- | ------------------------------- |
| `signup_started`                | Usuária inicia cadastro          | `source`                        |
| `signup_completed`              | Cadastro concluído               | `method`                        |
| `profile_completed`             | Perfil mínimo salvo              | `has_brand_name`, `has_pix_key` |
| `customer_created`              | Cliente criado                   | `has_phone`                     |
| `product_created`               | Produto criado                   | `has_repurchase_interval`       |
| `order_created`                 | Pedido criado                    | `item_count`, `total_cents`     |
| `payment_message_copied`        | Mensagem de cobrança copiada     | `order_id`                      |
| `whatsapp_opened`               | Link manual do WhatsApp aberto   | `context`                       |
| `order_marked_paid`             | Pedido marcado como pago         | `order_id`                      |
| `order_marked_delivered`        | Pedido marcado como entregue     | `order_id`                      |
| `repurchase_opportunity_viewed` | Oportunidade de recompra exibida | `follow_up_id`                  |
| `repurchase_message_copied`     | Mensagem de recompra copiada     | `follow_up_id`                  |
| `repurchase_marked_contacted`   | Recompra marcada como contatada  | `follow_up_id`                  |
