-- Performance index for listing orders by user, sorted by created_at DESC
-- Eliminates sequential scan on orders table for paginated list view
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_user_id_created_at
  ON orders (user_id, created_at DESC);

-- Performance index for listing customers by user, sorted by name ASC
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_customers_user_id_name
  ON customers (user_id, name ASC);

-- Composite index for order_items to speed up batch fetches by user + order_id
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_items_user_id_order_id
  ON order_items (user_id, order_id);
