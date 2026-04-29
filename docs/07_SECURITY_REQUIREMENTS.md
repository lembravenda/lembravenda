# Requisitos de segurança

## LGPD

- Coletar apenas dados necessários para a operação do MVP.
- Informar finalidade dos dados de clientes cadastrados pela revendedora.
- Permitir exclusão ou anonimização mediante solicitação.
- Evitar dados sensíveis; observações de clientes devem ter orientação contra informações excessivas.
- Registrar política de retenção antes do piloto público.
- Não usar dados de clientes finais para marketing próprio da plataforma.
- Exportação e exclusão de dados da revendedora devem ser planejadas antes de monetização pública.

## Autenticação

- Usar Supabase Auth.
- Proteger todas as rotas privadas.
- Tratar sessão expirada com redirecionamento seguro.
- Não confiar apenas em validação do cliente.

## Autorização

- Todo dado de negócio deve pertencer ao usuário autenticado.
- Toda query deve filtrar por `user_id` ou depender de RLS comprovada.
- Operações de escrita devem validar posse dos registros relacionados.
- IDs enviados pelo cliente nunca devem conceder acesso por si só.
- Relações entre cliente, produto, pedido, item e follow-up devem ser validadas contra o mesmo `user_id`.

## Row Level Security

- RLS obrigatório para `profiles`, `customers`, `products`, `orders`, `order_items` e `follow_ups`.
- Políticas devem permitir `select`, `insert`, `update` e `delete` apenas quando `auth.uid()` corresponder ao dono.
- `profiles.id` deve corresponder a `auth.uid()`.
- Inserts não podem aceitar `user_id` diferente de `auth.uid()`.
- Updates não podem transferir registros para outro `user_id`.
- Testes devem cobrir tentativa de acesso cruzado entre usuários.

## Gestão de segredos

- Nunca expor service role key no frontend.
- Segredos ficam apenas em variáveis de ambiente de servidor.
- Chaves públicas devem ser tratadas como públicas e limitadas por RLS.
- Logs não devem imprimir tokens, cookies, chaves Pix completas quando desnecessário ou dados pessoais em massa.

## Proteção contra acesso cruzado

- Criar testes com dois usuários e registros isolados.
- Validar que um usuário não lista, lê, altera ou exclui dados do outro.
- Validar relações: pedido só pode usar cliente e produto do mesmo `user_id`.
- Não criar endpoints administrativos no MVP.

## Checklist OWASP básico

- Validar entradas no cliente e no servidor.
- Escapar conteúdo exibido na interface.
- Usar proteção padrão do framework contra XSS e CSRF.
- Sanitizar ou limitar campos livres como observações e mensagens.
- Configurar headers de segurança na hospedagem.
- Não armazenar senha fora do provedor de autenticação.
- Evitar dependências desnecessárias.
- Manter mensagens de erro úteis, mas sem vazar detalhes internos.
- Usar HTTPS em produção.
- Revisar permissões de banco antes de deploy.
- Aplicar rate limiting ou proteção equivalente em endpoints sensíveis quando disponíveis.
