"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthState } from "@/lib/auth/server";
import { listCustomers } from "@/lib/customers/server";
import { listOrders } from "@/lib/orders/server";
import { parsePriceInput } from "@/lib/products/format";
import {
  createProduct,
  listProducts,
  setProductActiveState,
  updateProduct
} from "@/lib/products/server";

export type ProductActionState = {
  error?: string;
};

function optionalText(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value.length > 0 ? value : null;
}

function readActiveState(formData: FormData) {
  return String(formData.get("is_active") ?? "") === "on";
}

function readRepurchaseInterval(formData: FormData) {
  const rawValue = String(
    formData.get("repurchase_interval_days") ?? ""
  ).trim();

  if (!rawValue) {
    return null;
  }

  const numericValue = Number(rawValue);

  if (!Number.isInteger(numericValue) || numericValue <= 0) {
    return { error: "Informe um prazo de recompra válido em dias." };
  }

  return numericValue;
}

function readProductDraft(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    return { error: "Informe o nome do produto." };
  }

  const parsedPrice = parsePriceInput(String(formData.get("price") ?? ""));

  if ("error" in parsedPrice) {
    return { error: parsedPrice.error };
  }

  const repurchaseInterval = readRepurchaseInterval(formData);

  if (
    repurchaseInterval &&
    typeof repurchaseInterval === "object" &&
    "error" in repurchaseInterval
  ) {
    return repurchaseInterval;
  }

  return {
    category: optionalText(formData, "category"),
    is_active: readActiveState(formData),
    name,
    price_cents: parsedPrice.priceCents,
    repurchase_interval_days: repurchaseInterval
  };
}

async function requireAuthenticatedUser() {
  const authState = await getAuthState();

  if (!authState.user) {
    return null;
  }

  return authState.user;
}

export async function createProductAction(
  _prevState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  const user = await requireAuthenticatedUser();

  if (!user) {
    return { error: "Sua sessão expirou. Entre novamente para continuar." };
  }

  const draft = readProductDraft(formData);

  if ("error" in draft) {
    return { error: draft.error };
  }

  try {
    await createProduct(user.id, draft);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o produto agora."
    };
  }

  revalidatePath("/app/produtos");
  const [customers, orders, products] = await Promise.all([
    listCustomers(user.id, ""),
    listOrders(user.id),
    listProducts(user.id, "")
  ]);

  if (customers.length > 0 && orders.length === 0 && products.length > 0) {
    redirect("/app/produtos?created=product-order");
  }

  redirect("/app/produtos?created=product");
}

export async function updateProductAction(
  _prevState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  const user = await requireAuthenticatedUser();

  if (!user) {
    return { error: "Sua sessão expirou. Entre novamente para continuar." };
  }

  const productId = String(formData.get("product_id") ?? "").trim();

  if (!productId) {
    return { error: "Não foi possível identificar o produto para edição." };
  }

  const draft = readProductDraft(formData);

  if ("error" in draft) {
    return { error: draft.error };
  }

  try {
    const product = await updateProduct(productId, user.id, draft);

    if (!product) {
      return { error: "Produto não encontrado para edição." };
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar o produto agora."
    };
  }

  revalidatePath("/app/produtos");
  redirect("/app/produtos");
}

export async function deactivateProductAction(formData: FormData) {
  const user = await requireAuthenticatedUser();

  if (!user) {
    throw new Error("Sua sessão expirou. Entre novamente para continuar.");
  }

  const productId = String(formData.get("product_id") ?? "").trim();

  if (!productId) {
    throw new Error("Não foi possível identificar o produto para inativação.");
  }

  const product = await setProductActiveState(productId, user.id, false);

  if (!product) {
    throw new Error("Produto não encontrado para inativação.");
  }

  revalidatePath("/app/produtos");
  redirect("/app/produtos");
}
