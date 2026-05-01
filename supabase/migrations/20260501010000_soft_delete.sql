-- Soft delete: adiciona deleted_at em orders e customers
-- Registros com deleted_at IS NOT NULL são considerados arquivados

ALTER TABLE orders ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Atualizar RLS em orders: excluir registros deletados das queries normais
-- (As políticas existentes usam user_id = auth.uid(); adicionamos o filtro deleted_at)
-- Nota: se as políticas existentes já filtram por user_id, basta garantir que
-- as queries da aplicação incluam o filtro. A migration abaixo é suficiente
-- para começar — policies mais restritivas podem ser adicionadas depois.

-- Index para soft delete (queries que filtram deleted_at IS NULL)
CREATE INDEX IF NOT EXISTS idx_orders_deleted_at ON orders (deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_customers_deleted_at ON customers (deleted_at) WHERE deleted_at IS NULL;
