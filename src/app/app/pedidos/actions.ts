"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthState } from "@/lib/auth/server";
import {
  createOrder,
  markOrderDelivered,
  markOrderPaid
} from "@/lib/orders/server";

export type OrderActionState = {
  error?: string;
};

type OrderCreateItemInput = {
  product_id: string;
  quantity: number;
};

function parseItemsPayload(formData: FormData) {
  const rawValue = String(formData.get("items_payload") ?? "").trim();

  if (!rawValue) {
    return { error: "Adicione pelo menos um produto ao pedido." };
  }

  try {
    const parsedValue = JSON.parse(rawValue) as OrderCreateItemInput[];

    if (!Array.isArray(parsedValue) || parsedValue.length === 0) {
      return { error: "Adicione pelo menos um produto ao pedido." };
    }

    const mergedItems = new Map<string, number>();

    for (const item of parsedValue) {
      const productId = String(item.product_id ?? "").trim();
      const quantity = Number(item.quantity);

      if (!productId) {
        return {
          error: "Selecione apenas produtos válidos para criar o pedido."
        };
      }

      if (!Number.isInteger(quantity) || quantity <= 0) {
        return { error: "Informe uma quantidade válida para cada produto." };
      }

      mergedItems.set(productId, (mergedItems.get(productId) ?? 0) + quantity);
    }

    return {
      items: [...mergedItems.entries()].map(([product_id, quantity]) => ({
        product_id,
        quantity
      }))
    };
  } catch {
    return { error: "Não foi possível ler os itens do pedido." };
  }
}

async function requireAuthenticatedUser() {
  const authState = await getAuthState();

  if (!authState.user) {
    return null;
  }

  return authState.user;
}

function readRedirectTo(formData: FormData, fallbackPath: string) {
  const redirectTo = String(formData.get("redirect_to") ?? "").trim();

  if (redirectTo.startsWith("/app/")) {
    return redirectTo;
  }

  return fallbackPath;
}

export async function createOrderAction(
  _prevState: OrderActionState,
  formData: FormData
): Promise<OrderActionState> {
  const user = await requireAuthenticatedUser();

  if (!user) {
    return { error: "Sua sessão expirou. Entre novamente para continuar." };
  }

  const customerId = String(formData.get("customer_id") ?? "").trim();

  if (!customerId) {
    return { error: "Selecione uma cliente para criar o pedido." };
  }

  const parsedItems = parseItemsPayload(formData);

  if ("error" in parsedItems) {
    return { error: parsedItems.error };
  }

  let order;

  try {
    order = await createOrder(user.id, customerId, parsedItems.items);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o pedido agora."
    };
  }

  revalidatePath("/app/pedidos");
  redirect(`/app/pedidos/${order.id}?created=1#pedido-criado`);
}

export async function markOrderPaidAction(formData: FormData) {
  const user = await requireAuthenticatedUser();

  if (!user) {
    throw new Error("Sua sessão expirou. Entre novamente para continuar.");
  }

  const orderId = String(formData.get("order_id") ?? "").trim();

  if (!orderId) {
    throw new Error("Não foi possível identificar o pedido.");
  }

  const order = await markOrderPaid(orderId, user.id);

  if (!order) {
    throw new Error("Pedido não encontrado para atualização.");
  }

  const redirectTo = readRedirectTo(formData, `/app/pedidos/${order.id}`);

  revalidatePath("/app/pedidos");
  revalidatePath(`/app/pedidos/${order.id}`);
  revalidatePath("/app/hoje");
  redirect(redirectTo);
}

export async function markOrderDeliveredAction(formData: FormData) {
  const user = await requireAuthenticatedUser();

  if (!user) {
    throw new Error("Sua sessão expirou. Entre novamente para continuar.");
  }

  const orderId = String(formData.get("order_id") ?? "").trim();

  if (!orderId) {
    throw new Error("Não foi possível identificar o pedido.");
  }

  const order = await markOrderDelivered(orderId, user.id);

  if (!order) {
    throw new Error("Pedido não encontrado para atualização.");
  }

  const redirectTo = readRedirectTo(formData, `/app/pedidos/${order.id}`);

  revalidatePath("/app/pedidos");
  revalidatePath(`/app/pedidos/${order.id}`);
  revalidatePath("/app/hoje");
  redirect(redirectTo);
}
