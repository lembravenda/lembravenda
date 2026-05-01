import "server-only";

import type { Customer, Order, OrderItem } from "@/types/database";
import { isE2EAuthModeEnabled } from "@/lib/auth/e2e-mode";
import { listTestCustomers } from "@/lib/customers/test-store";
import {
  calculateItemSubtotalCents,
  calculateOrderTotalCents
} from "@/lib/orders/calc";
import {
  createTestOrder,
  getTestOrderById,
  listTestOrderItems,
  listTestOrderItemsForOrder,
  listTestOrders,
  markTestOrderDelivered,
  markTestOrderPaid
} from "@/lib/orders/test-store";
import { listActiveTestProducts } from "@/lib/products/test-store";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type OrderCreateItemDraft = {
  product_id: string;
  quantity: number;
};

export type OrderSummary = Order & {
  customer_name: string | null;
  item_count: number;
};

export type OrderDetail = {
  customer: Customer | null;
  items: OrderItem[];
  order: Order;
};

export type TodayDashboard = {
  pendingCharges: OrderSummary[];
  pendingDeliveries: OrderSummary[];
  recentOrders: OrderSummary[];
};

export type ListOrdersOptions = {
  limit?: number;
  offset?: number;
};

export async function listOrders(userId: string, options?: ListOrdersOptions) {
  const { limit, offset = 0 } = options ?? {};

  if (isE2EAuthModeEnabled()) {
    const [orders, customers, orderItems] = await Promise.all([
      listTestOrders(userId),
      listTestCustomers(userId, ""),
      listTestOrderItems(userId)
    ]);

    const customerMap = new Map(
      customers.map((customer) => [customer.id, customer])
    );

    const allOrders = orders.map((order) => ({
      ...order,
      customer_name: customerMap.get(order.customer_id)?.name ?? null,
      item_count: orderItems.filter((item) => item.order_id === order.id).length
    }));

    if (limit !== undefined) {
      return allOrders.slice(offset, offset + limit);
    }
    return allOrders;
  }

  const supabase = await createSupabaseServerClient();
  let ordersQuery = supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (limit !== undefined) {
    ordersQuery = ordersQuery.range(offset, offset + limit - 1);
  }

  const { data: orders, error: ordersError } = await ordersQuery;

  if (ordersError) {
    throw new Error("Não foi possível carregar seus pedidos.");
  }

  if (orders.length === 0) {
    return [];
  }

  const customerIds = [...new Set(orders.map((order) => order.customer_id))];
  const orderIds = orders.map((order) => order.id);
  const [
    { data: customers, error: customersError },
    { data: orderItems, error: orderItemsError }
  ] = await Promise.all([
    supabase
      .from("customers")
      .select(
        "id, name, user_id, phone, birthday, tags, notes, created_at, updated_at"
      )
      .eq("user_id", userId)
      .in("id", customerIds),
    supabase
      .from("order_items")
      .select("*")
      .eq("user_id", userId)
      .in("order_id", orderIds)
  ]);

  if (customersError || orderItemsError) {
    throw new Error("Não foi possível carregar os detalhes dos pedidos.");
  }

  const customerMap = new Map(
    customers.map((customer) => [customer.id, customer])
  );

  return orders.map((order) => ({
    ...order,
    customer_name: customerMap.get(order.customer_id)?.name ?? null,
    item_count: orderItems.filter((item) => item.order_id === order.id).length
  }));
}

export async function getTodayDashboard(
  userId: string
): Promise<TodayDashboard> {
  const orders = await listOrders(userId);
  const activeOrders = orders.filter(
    (order) =>
      order.payment_status !== "canceled" &&
      order.delivery_status !== "canceled" &&
      !order.canceled_at
  );

  return {
    pendingCharges: activeOrders.filter(
      (order) => order.payment_status === "pending"
    ),
    pendingDeliveries: activeOrders.filter(
      (order) => order.delivery_status !== "delivered"
    ),
    recentOrders: orders.slice(0, 5)
  };
}

export async function getOrderDetail(
  orderId: string,
  userId: string
): Promise<OrderDetail | null> {
  if (isE2EAuthModeEnabled()) {
    const [order, customer, items] = await Promise.all([
      getTestOrderById(orderId, userId),
      listTestCustomers(userId, ""),
      listTestOrderItemsForOrder(orderId, userId)
    ]);

    if (!order) {
      return null;
    }

    return {
      customer:
        customer.find(
          (currentCustomer) => currentCustomer.id === order.customer_id
        ) ?? null,
      items,
      order
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", userId)
    .maybeSingle();

  if (orderError) {
    throw new Error("Não foi possível carregar esse pedido.");
  }

  if (!order) {
    return null;
  }

  const [
    { data: customer, error: customerError },
    { data: items, error: itemsError }
  ] = await Promise.all([
    supabase
      .from("customers")
      .select("*")
      .eq("id", order.customer_id)
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order.id)
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
  ]);

  if (customerError || itemsError) {
    throw new Error("Não foi possível carregar os itens desse pedido.");
  }

  return {
    customer,
    items,
    order
  };
}

async function getCustomerForOrder(userId: string, customerId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", customerId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error("Não foi possível validar a cliente do pedido.");
  }

  return data;
}

async function getActiveProductsForOrder(userId: string, productIds: string[]) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .in("id", productIds);

  if (error) {
    throw new Error("Não foi possível validar os produtos do pedido.");
  }

  return data;
}

export async function listOrdersByCustomer(customerId: string, userId: string) {
  if (isE2EAuthModeEnabled()) {
    const [orders, orderItems] = await Promise.all([
      listTestOrders(userId),
      listTestOrderItems(userId)
    ]);
    return orders
      .filter((o) => o.customer_id === customerId)
      .map((order) => ({
        ...order,
        customer_name: null,
        item_count: orderItems.filter((item) => item.order_id === order.id).length
      }));
  }

  const supabase = await createSupabaseServerClient();
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (ordersError) {
    throw new Error("Não foi possível carregar os pedidos dessa cliente.");
  }

  if (orders.length === 0) {
    return [];
  }

  const orderIds = orders.map((o) => o.id);
  const { data: orderItems, error: orderItemsError } = await supabase
    .from("order_items")
    .select("*")
    .eq("user_id", userId)
    .in("order_id", orderIds);

  if (orderItemsError) {
    throw new Error("Não foi possível carregar os itens dos pedidos.");
  }

  return orders.map((order) => ({
    ...order,
    customer_name: null as string | null,
    item_count: orderItems.filter((item) => item.order_id === order.id).length
  }));
}

export async function createOrder(
  userId: string,
  customerId: string,
  items: OrderCreateItemDraft[]
) {
  if (isE2EAuthModeEnabled()) {
    return createTestOrder(userId, customerId, items);
  }

  const customer = await getCustomerForOrder(userId, customerId);

  if (!customer) {
    throw new Error("Selecione uma cliente válida para criar o pedido.");
  }

  if (items.length === 0) {
    throw new Error("Adicione pelo menos um produto ao pedido.");
  }

  const productIds = items.map((item) => item.product_id);
  const products = await getActiveProductsForOrder(userId, productIds);

  if (products.length !== productIds.length) {
    throw new Error("Selecione apenas produtos ativos para criar o pedido.");
  }

  const productMap = new Map(products.map((product) => [product.id, product]));
  const orderItemsPayload = items.map((item) => {
    const product = productMap.get(item.product_id);

    if (!product) {
      throw new Error("Selecione apenas produtos ativos para criar o pedido.");
    }

    const lineTotalCents = calculateItemSubtotalCents({
      quantity: item.quantity,
      unit_price_cents: product.price_cents
    });

    return {
      line_total_cents: lineTotalCents,
      product_id: product.id,
      product_name_snapshot: product.name,
      quantity: item.quantity,
      unit_price_cents: product.price_cents,
      user_id: userId
    };
  });

  const totalCents = calculateOrderTotalCents(
    orderItemsPayload.map((item) => ({
      quantity: item.quantity,
      unit_price_cents: item.unit_price_cents
    }))
  );

  const supabase = await createSupabaseServerClient();
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      canceled_at: null,
      customer_id: customer.id,
      delivered_at: null,
      delivery_due_date: null,
      delivery_status: "to_prepare",
      notes: null,
      paid_at: null,
      payment_due_date: null,
      payment_status: "pending",
      total_cents: totalCents,
      user_id: userId
    })
    .select("*")
    .single();

  if (orderError) {
    throw new Error("Não foi possível salvar o pedido agora.");
  }

  const { error: orderItemsError } = await supabase.from("order_items").insert(
    orderItemsPayload.map((item) => ({
      ...item,
      order_id: order.id
    }))
  );

  if (orderItemsError) {
    await supabase
      .from("orders")
      .delete()
      .eq("id", order.id)
      .eq("user_id", userId);
    throw new Error("Não foi possível salvar os itens do pedido agora.");
  }

  return order;
}

export async function listActiveProductsForNewOrders(
  userId: string,
  search = ""
) {
  if (isE2EAuthModeEnabled()) {
    return listActiveTestProducts(userId, search);
  }

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("products")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("updated_at", { ascending: false });

  const normalizedSearch = search.trim();

  if (normalizedSearch) {
    query = query.ilike("name", `%${normalizedSearch}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Não foi possível carregar os produtos ativos.");
  }

  return data;
}

export async function markOrderPaid(orderId: string, userId: string) {
  if (isE2EAuthModeEnabled()) {
    return markTestOrderPaid(orderId, userId);
  }

  const supabase = await createSupabaseServerClient();
  const { data: currentOrder, error: currentOrderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", userId)
    .maybeSingle();

  if (currentOrderError) {
    throw new Error("Não foi possível atualizar esse pedido agora.");
  }

  if (!currentOrder) {
    return null;
  }

  if (currentOrder.payment_status === "canceled") {
    throw new Error("Pedido cancelado não pode ser marcado como pago.");
  }

  if (currentOrder.payment_status === "paid") {
    return currentOrder;
  }

  const { data, error } = await supabase
    .from("orders")
    .update({
      paid_at: new Date().toISOString(),
      payment_status: "paid"
    })
    .eq("id", orderId)
    .eq("user_id", userId)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error("Não foi possível marcar o pedido como pago.");
  }

  return data;
}

export async function markOrderDelivered(orderId: string, userId: string) {
  if (isE2EAuthModeEnabled()) {
    return markTestOrderDelivered(orderId, userId);
  }

  const supabase = await createSupabaseServerClient();
  const { data: currentOrder, error: currentOrderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", userId)
    .maybeSingle();

  if (currentOrderError) {
    throw new Error("Não foi possível atualizar esse pedido agora.");
  }

  if (!currentOrder) {
    return null;
  }

  if (currentOrder.delivery_status === "canceled") {
    throw new Error("Pedido cancelado não pode ser marcado como entregue.");
  }

  if (currentOrder.delivery_status === "delivered") {
    return currentOrder;
  }

  const { data, error } = await supabase
    .from("orders")
    .update({
      delivered_at: new Date().toISOString(),
      delivery_status: "delivered"
    })
    .eq("id", orderId)
    .eq("user_id", userId)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error("Não foi possível marcar o pedido como entregue.");
  }

  return data;
}
