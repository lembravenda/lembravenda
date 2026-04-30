"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthState } from "@/lib/auth/server";
import {
  createCustomer,
  deleteCustomer,
  listCustomers,
  updateCustomer
} from "@/lib/customers/server";
import { listOrders } from "@/lib/orders/server";
import { listProducts } from "@/lib/products/server";
import { normalizePhone, validatePhone } from "@/lib/customers/phone";

export type CustomerActionState = {
  error?: string;
};

function optionalText(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value.length > 0 ? value : null;
}

function readTags(formData: FormData) {
  const rawValue = String(formData.get("tags") ?? "");

  return rawValue
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function readCustomerDraft(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const birthday = optionalText(formData, "birthday");

  if (!name) {
    return { error: "Informe o nome da cliente." };
  }

  if (birthday && Number.isNaN(Date.parse(birthday))) {
    return { error: "Informe uma data de aniversário válida." };
  }

  const rawPhone = String(formData.get("phone") ?? "").trim();
  const phoneValidation = validatePhone(rawPhone);

  if (phoneValidation === "invalid") {
    return { error: "Digite um telefone válido com DDD." };
  }

  const phone = phoneValidation === "valid" ? normalizePhone(rawPhone) : null;

  return {
    birthday,
    name,
    notes: optionalText(formData, "notes"),
    phone,
    tags: readTags(formData)
  };
}

async function requireAuthenticatedUser() {
  const authState = await getAuthState();

  if (!authState.user) {
    return null;
  }

  return authState.user;
}

export async function createCustomerAction(
  _prevState: CustomerActionState,
  formData: FormData
): Promise<CustomerActionState> {
  const user = await requireAuthenticatedUser();

  if (!user) {
    return { error: "Sua sessão expirou. Entre novamente para continuar." };
  }

  const draft = readCustomerDraft(formData);

  if ("error" in draft) {
    return { error: draft.error };
  }

  try {
    await createCustomer(user.id, draft);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a cliente agora."
    };
  }

  revalidatePath("/app/clientes");
  const [customers, orders, products] = await Promise.all([
    listCustomers(user.id, ""),
    listOrders(user.id),
    listProducts(user.id, "")
  ]);

  if (products.length === 0) {
    redirect("/app/clientes?created=customer-product");
  }

  if (products.length > 0 && orders.length === 0 && customers.length > 0) {
    redirect("/app/clientes?created=customer-order");
  }

  redirect("/app/clientes?created=customer");
}

export async function updateCustomerAction(
  _prevState: CustomerActionState,
  formData: FormData
): Promise<CustomerActionState> {
  const user = await requireAuthenticatedUser();

  if (!user) {
    return { error: "Sua sessão expirou. Entre novamente para continuar." };
  }

  const customerId = String(formData.get("customer_id") ?? "").trim();

  if (!customerId) {
    return { error: "Não foi possível identificar a cliente para edição." };
  }

  const draft = readCustomerDraft(formData);

  if ("error" in draft) {
    return { error: draft.error };
  }

  try {
    const customer = await updateCustomer(customerId, user.id, draft);

    if (!customer) {
      return { error: "Cliente não encontrado para edição." };
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar a cliente agora."
    };
  }

  revalidatePath("/app/clientes");
  redirect("/app/clientes");
}

export async function deleteCustomerAction(formData: FormData) {
  const user = await requireAuthenticatedUser();

  if (!user) {
    throw new Error("Sua sessão expirou. Entre novamente para continuar.");
  }

  const customerId = String(formData.get("customer_id") ?? "").trim();

  if (!customerId) {
    throw new Error("Não foi possível identificar a cliente para exclusão.");
  }

  await deleteCustomer(customerId, user.id);

  revalidatePath("/app/clientes");
  redirect("/app/clientes");
}
