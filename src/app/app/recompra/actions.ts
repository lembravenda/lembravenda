"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthState } from "@/lib/auth/server";
import { markRepurchaseContacted } from "@/lib/repurchase/server";

async function requireAuthenticatedUser() {
  const authState = await getAuthState();

  if (!authState.user) {
    return null;
  }

  return authState.user;
}

function requiredText(formData: FormData, key: string, errorMessage: string) {
  const value = String(formData.get(key) ?? "").trim();

  if (!value) {
    throw new Error(errorMessage);
  }

  return value;
}

export async function markRepurchaseContactedAction(formData: FormData) {
  const user = await requireAuthenticatedUser();

  if (!user) {
    throw new Error("Sua sessão expirou. Entre novamente para continuar.");
  }

  const customer_id = requiredText(
    formData,
    "customer_id",
    "Não foi possível identificar a cliente."
  );
  const due_date = requiredText(
    formData,
    "due_date",
    "Não foi possível identificar a data da oportunidade."
  );
  const message_snapshot = requiredText(
    formData,
    "message_snapshot",
    "Não foi possível identificar a mensagem da oportunidade."
  );
  const order_id = requiredText(
    formData,
    "order_id",
    "Não foi possível identificar o pedido da oportunidade."
  );
  const product_id = requiredText(
    formData,
    "product_id",
    "Não foi possível identificar o produto da oportunidade."
  );

  const followUp = await markRepurchaseContacted({
    customer_id,
    due_date,
    message_snapshot,
    order_id,
    product_id,
    user_id: user.id
  });

  if (!followUp) {
    throw new Error("Oportunidade não encontrada para atualização.");
  }

  revalidatePath("/app/recompra");
  revalidatePath("/app/hoje");
  redirect("/app/recompra");
}
