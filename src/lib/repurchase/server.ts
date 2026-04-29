import "server-only";

import type {
  Customer,
  FollowUp,
  Order,
  OrderItem,
  Product
} from "@/types/database";
import { isE2EAuthModeEnabled } from "@/lib/auth/e2e-mode";
import { listTestCustomers } from "@/lib/customers/test-store";
import {
  listTestFollowUps,
  upsertTestRepurchaseFollowUp
} from "@/lib/follow-ups/test-store";
import {
  buildRepurchaseMessage,
  calculateDaysSincePurchase,
  calculateRepurchaseDueDate,
  isRepurchaseEligible
} from "@/lib/repurchase/calc";
import { listTestOrders, listTestOrderItems } from "@/lib/orders/test-store";
import { listTestProducts } from "@/lib/products/test-store";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type RepurchaseOpportunity = {
  customer_id: string;
  customer_name: string;
  customer_phone: string | null;
  days_since_purchase: number;
  due_date: string;
  follow_up_id: string | null;
  last_item_total_cents: number;
  last_purchase_at: string;
  message: string;
  order_id: string;
  product_id: string;
  product_name: string;
};

type RepurchaseCandidate = {
  customer: Customer;
  followUp: FollowUp | null;
  item: OrderItem;
  order: Order;
  product: Product;
};

function isCanceledOrder(order: Order) {
  return (
    order.payment_status === "canceled" ||
    order.delivery_status === "canceled" ||
    Boolean(order.canceled_at)
  );
}

function buildOpportunity(
  candidate: RepurchaseCandidate
): RepurchaseOpportunity {
  const dueDate = calculateRepurchaseDueDate(
    candidate.order.created_at,
    candidate.product.repurchase_interval_days ?? 0
  );
  const message = buildRepurchaseMessage({
    customerName: candidate.customer.name,
    productName: candidate.item.product_name_snapshot
  });

  return {
    customer_id: candidate.customer.id,
    customer_name: candidate.customer.name,
    customer_phone: candidate.customer.phone,
    days_since_purchase: calculateDaysSincePurchase(candidate.order.created_at),
    due_date: dueDate.toISOString().slice(0, 10),
    follow_up_id: candidate.followUp?.id ?? null,
    last_item_total_cents: candidate.item.line_total_cents,
    last_purchase_at: candidate.order.created_at,
    message,
    order_id: candidate.order.id,
    product_id: candidate.product.id,
    product_name: candidate.item.product_name_snapshot
  };
}

function buildCandidateKey(customerId: string, productId: string) {
  return `${customerId}:${productId}`;
}

function buildFollowUpKey(
  orderId: string,
  customerId: string,
  productId: string
) {
  return `${orderId}:${customerId}:${productId}`;
}

function deriveRepurchaseOpportunities(input: {
  customers: Customer[];
  followUps: FollowUp[];
  now?: Date;
  orderItems: OrderItem[];
  orders: Order[];
  products: Product[];
}) {
  const now = input.now ?? new Date();
  const orderMap = new Map(input.orders.map((order) => [order.id, order]));
  const customerMap = new Map(
    input.customers.map((customer) => [customer.id, customer])
  );
  const productMap = new Map(
    input.products.map((product) => [product.id, product])
  );
  const followUpMap = new Map(
    input.followUps
      .filter((followUp) => followUp.type === "repurchase")
      .map((followUp) => [
        buildFollowUpKey(
          followUp.order_id ?? "",
          followUp.customer_id,
          followUp.product_id ?? ""
        ),
        followUp
      ])
  );
  const latestCandidates = new Map<string, RepurchaseCandidate>();

  for (const item of input.orderItems) {
    if (!item.product_id) {
      continue;
    }

    const order = orderMap.get(item.order_id);
    const product = productMap.get(item.product_id);

    if (!order || !product) {
      continue;
    }

    if (isCanceledOrder(order)) {
      continue;
    }

    if (
      !isRepurchaseEligible({
        lastPurchaseAt: order.created_at,
        orderCanceled: false,
        now,
        repurchaseIntervalDays: product.repurchase_interval_days
      })
    ) {
      continue;
    }

    const customer = customerMap.get(order.customer_id);

    if (!customer) {
      continue;
    }

    const candidateKey = buildCandidateKey(customer.id, product.id);
    const followUp =
      followUpMap.get(buildFollowUpKey(order.id, customer.id, product.id)) ??
      null;
    const currentCandidate = latestCandidates.get(candidateKey);

    if (
      !currentCandidate ||
      new Date(order.created_at).getTime() >
        new Date(currentCandidate.order.created_at).getTime()
    ) {
      latestCandidates.set(candidateKey, {
        customer,
        followUp,
        item,
        order,
        product
      });
    }
  }

  return [...latestCandidates.values()]
    .filter(
      (candidate) =>
        candidate.followUp?.status !== "done" &&
        candidate.followUp?.status !== "dismissed"
    )
    .map(buildOpportunity)
    .sort(
      (left, right) =>
        new Date(left.due_date).getTime() - new Date(right.due_date).getTime()
    );
}

async function loadRepurchaseData(userId: string) {
  if (isE2EAuthModeEnabled()) {
    const [customers, followUps, orderItems, orders, products] =
      await Promise.all([
        listTestCustomers(userId, ""),
        listTestFollowUps(userId, "repurchase"),
        listTestOrderItems(userId),
        listTestOrders(userId),
        listTestProducts(userId, "")
      ]);

    return { customers, followUps, orderItems, orders, products };
  }

  const supabase = await createSupabaseServerClient();
  const [
    { data: customers, error: customersError },
    { data: followUps, error: followUpsError },
    { data: orderItems, error: orderItemsError },
    { data: orders, error: ordersError },
    { data: products, error: productsError }
  ] = await Promise.all([
    supabase.from("customers").select("*").eq("user_id", userId),
    supabase
      .from("follow_ups")
      .select("*")
      .eq("user_id", userId)
      .eq("type", "repurchase"),
    supabase.from("order_items").select("*").eq("user_id", userId),
    supabase.from("orders").select("*").eq("user_id", userId),
    supabase.from("products").select("*").eq("user_id", userId)
  ]);

  if (
    customersError ||
    followUpsError ||
    orderItemsError ||
    ordersError ||
    productsError
  ) {
    throw new Error("Não foi possível carregar as oportunidades de recompra.");
  }

  return {
    customers,
    followUps,
    orderItems,
    orders,
    products
  };
}

export async function listRepurchaseOpportunities(userId: string) {
  const data = await loadRepurchaseData(userId);

  return deriveRepurchaseOpportunities(data);
}

async function validateRepurchaseOwnership(input: {
  customer_id: string;
  order_id: string;
  product_id: string;
  user_id: string;
}) {
  if (isE2EAuthModeEnabled()) {
    const data = await loadRepurchaseData(input.user_id);
    const customer = data.customers.find(
      (item) => item.id === input.customer_id
    );
    const order = data.orders.find((item) => item.id === input.order_id);
    const product = data.products.find((item) => item.id === input.product_id);

    return Boolean(
      customer &&
      order &&
      product &&
      order.customer_id === customer.id &&
      product.user_id === input.user_id
    );
  }

  const supabase = await createSupabaseServerClient();
  const [{ data: customer }, { data: order }, { data: product }] =
    await Promise.all([
      supabase
        .from("customers")
        .select("id")
        .eq("id", input.customer_id)
        .eq("user_id", input.user_id)
        .maybeSingle(),
      supabase
        .from("orders")
        .select("id, customer_id")
        .eq("id", input.order_id)
        .eq("user_id", input.user_id)
        .maybeSingle(),
      supabase
        .from("products")
        .select("id")
        .eq("id", input.product_id)
        .eq("user_id", input.user_id)
        .maybeSingle()
    ]);

  return Boolean(
    customer && order && product && order.customer_id === customer.id
  );
}

export async function markRepurchaseContacted(input: {
  customer_id: string;
  due_date: string;
  message_snapshot: string;
  order_id: string;
  product_id: string;
  user_id: string;
}) {
  const isValid = await validateRepurchaseOwnership(input);

  if (!isValid) {
    return null;
  }

  if (isE2EAuthModeEnabled()) {
    return upsertTestRepurchaseFollowUp({
      ...input,
      status: "done"
    });
  }

  const supabase = await createSupabaseServerClient();
  const { data: currentFollowUp, error: currentFollowUpError } = await supabase
    .from("follow_ups")
    .select("*")
    .eq("user_id", input.user_id)
    .eq("type", "repurchase")
    .eq("customer_id", input.customer_id)
    .eq("product_id", input.product_id)
    .eq("order_id", input.order_id)
    .maybeSingle();

  if (currentFollowUpError) {
    throw new Error("Não foi possível atualizar essa oportunidade agora.");
  }

  if (currentFollowUp) {
    const { data, error } = await supabase
      .from("follow_ups")
      .update({
        done_at: currentFollowUp.done_at ?? new Date().toISOString(),
        dismissed_at: null,
        due_date: input.due_date,
        message_snapshot: input.message_snapshot,
        status: "done"
      })
      .eq("id", currentFollowUp.id)
      .eq("user_id", input.user_id)
      .select("*")
      .maybeSingle();

    if (error) {
      throw new Error("Não foi possível marcar a recompra como contatada.");
    }

    return data;
  }

  const { data, error } = await supabase
    .from("follow_ups")
    .insert({
      customer_id: input.customer_id,
      dismissed_at: null,
      done_at: new Date().toISOString(),
      due_date: input.due_date,
      message_snapshot: input.message_snapshot,
      order_id: input.order_id,
      product_id: input.product_id,
      status: "done",
      type: "repurchase",
      user_id: input.user_id
    })
    .select("*")
    .single();

  if (error) {
    throw new Error("Não foi possível marcar a recompra como contatada.");
  }

  return data;
}
