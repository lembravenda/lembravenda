import "server-only";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import type { Order, OrderItem } from "@/types/database";
import { isE2EAuthModeEnabled } from "@/lib/auth/e2e-mode";
import { getTestCustomerById } from "@/lib/customers/test-store";
import { getTestProductById } from "@/lib/products/test-store";
import {
  calculateItemSubtotalCents,
  calculateOrderTotalCents
} from "@/lib/orders/calc";

const TEST_ORDERS_COOKIE = "agenda_test_orders";
const TEST_ORDER_ITEMS_COOKIE = "agenda_test_order_items";

type TestOrderCreateItem = {
  product_id: string;
  quantity: number;
};

function parseCookieValue<T>(value: string | undefined) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

async function getOrdersStore() {
  if (!isE2EAuthModeEnabled()) {
    return [];
  }

  const cookieStore = await cookies();

  return (
    parseCookieValue<Order[]>(cookieStore.get(TEST_ORDERS_COOKIE)?.value) ?? []
  );
}

async function saveOrdersStore(orders: Order[]) {
  if (!isE2EAuthModeEnabled()) {
    return;
  }

  const cookieStore = await cookies();

  cookieStore.set(TEST_ORDERS_COOKIE, JSON.stringify(orders), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}

async function getOrderItemsStore() {
  if (!isE2EAuthModeEnabled()) {
    return [];
  }

  const cookieStore = await cookies();

  return (
    parseCookieValue<OrderItem[]>(
      cookieStore.get(TEST_ORDER_ITEMS_COOKIE)?.value
    ) ?? []
  );
}

async function saveOrderItemsStore(orderItems: OrderItem[]) {
  if (!isE2EAuthModeEnabled()) {
    return;
  }

  const cookieStore = await cookies();

  cookieStore.set(TEST_ORDER_ITEMS_COOKIE, JSON.stringify(orderItems), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}

export async function listTestOrders(userId: string) {
  const orders = await getOrdersStore();

  return orders
    .filter((order) => order.user_id === userId)
    .sort((left, right) => right.created_at.localeCompare(left.created_at));
}

export async function getTestOrderById(id: string, userId: string) {
  const orders = await getOrdersStore();

  return (
    orders.find((order) => order.id === id && order.user_id === userId) ?? null
  );
}

export async function listTestOrderItems(userId: string) {
  const orderItems = await getOrderItemsStore();

  return orderItems.filter((orderItem) => orderItem.user_id === userId);
}

export async function listTestOrderItemsForOrder(
  orderId: string,
  userId: string
) {
  const orderItems = await getOrderItemsStore();

  return orderItems.filter(
    (orderItem) =>
      orderItem.order_id === orderId && orderItem.user_id === userId
  );
}

export async function createTestOrder(
  userId: string,
  customerId: string,
  items: TestOrderCreateItem[]
) {
  const customer = await getTestCustomerById(customerId, userId);

  if (!customer) {
    throw new Error("Selecione uma cliente válida para criar o pedido.");
  }

  if (items.length === 0) {
    throw new Error("Adicione pelo menos um produto ao pedido.");
  }

  const products = await Promise.all(
    items.map(async (item) => {
      const product = await getTestProductById(item.product_id, userId);

      if (!product || !product.is_active) {
        throw new Error(
          "Selecione apenas produtos ativos para criar o pedido."
        );
      }

      return product;
    })
  );

  const timestamp = new Date().toISOString();
  const orderId = randomUUID();
  const orderItems = items.map((item, index) => {
    const product = products[index];
    const lineTotalCents = calculateItemSubtotalCents({
      quantity: item.quantity,
      unit_price_cents: product.price_cents
    });

    return {
      created_at: timestamp,
      id: randomUUID(),
      line_total_cents: lineTotalCents,
      order_id: orderId,
      product_id: product.id,
      product_name_snapshot: product.name,
      quantity: item.quantity,
      unit_price_cents: product.price_cents,
      updated_at: timestamp,
      user_id: userId
    } satisfies OrderItem;
  });

  const order: Order = {
    canceled_at: null,
    created_at: timestamp,
    customer_id: customer.id,
    delivered_at: null,
    delivery_due_date: null,
    delivery_status: "to_prepare",
    id: orderId,
    notes: null,
    paid_at: null,
    payment_due_date: null,
    payment_status: "pending",
    total_cents: calculateOrderTotalCents(
      orderItems.map((orderItem) => ({
        quantity: orderItem.quantity,
        unit_price_cents: orderItem.unit_price_cents
      }))
    ),
    updated_at: timestamp,
    user_id: userId
  };

  const [orders, existingOrderItems] = await Promise.all([
    getOrdersStore(),
    getOrderItemsStore()
  ]);

  await Promise.all([
    saveOrdersStore([...orders, order]),
    saveOrderItemsStore([...existingOrderItems, ...orderItems])
  ]);

  return order;
}

export async function markTestOrderPaid(orderId: string, userId: string) {
  const orders = await getOrdersStore();
  const orderIndex = orders.findIndex(
    (order) => order.id === orderId && order.user_id === userId
  );

  if (orderIndex < 0) {
    return null;
  }

  const currentOrder = orders[orderIndex];

  if (currentOrder.payment_status === "canceled") {
    throw new Error("Pedido cancelado não pode ser marcado como pago.");
  }

  const nextOrder: Order = {
    ...currentOrder,
    paid_at: currentOrder.paid_at ?? new Date().toISOString(),
    payment_status: "paid",
    updated_at: new Date().toISOString()
  };

  const nextOrders = [...orders];
  nextOrders[orderIndex] = nextOrder;
  await saveOrdersStore(nextOrders);

  return nextOrder;
}

export async function markTestOrderDelivered(orderId: string, userId: string) {
  const orders = await getOrdersStore();
  const orderIndex = orders.findIndex(
    (order) => order.id === orderId && order.user_id === userId
  );

  if (orderIndex < 0) {
    return null;
  }

  const currentOrder = orders[orderIndex];

  if (currentOrder.delivery_status === "canceled") {
    throw new Error("Pedido cancelado não pode ser marcado como entregue.");
  }

  const nextOrder: Order = {
    ...currentOrder,
    delivered_at: currentOrder.delivered_at ?? new Date().toISOString(),
    delivery_status: "delivered",
    updated_at: new Date().toISOString()
  };

  const nextOrders = [...orders];
  nextOrders[orderIndex] = nextOrder;
  await saveOrdersStore(nextOrders);

  return nextOrder;
}
