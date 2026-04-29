import "server-only";

import type { Product } from "@/types/database";
import { isE2EAuthModeEnabled } from "@/lib/auth/e2e-mode";
import {
  createTestProduct,
  getTestProductById,
  listActiveTestProducts,
  listTestProducts,
  setTestProductActiveState,
  updateTestProduct
} from "@/lib/products/test-store";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ProductDraft = Pick<
  Product,
  "category" | "is_active" | "name" | "price_cents" | "repurchase_interval_days"
>;

export async function listProducts(userId: string, search: string) {
  if (isE2EAuthModeEnabled()) {
    return listTestProducts(userId, search);
  }

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("products")
    .select("*")
    .eq("user_id", userId)
    .order("name", { ascending: true });

  const normalizedSearch = search.trim();

  if (normalizedSearch) {
    query = query.ilike("name", `%${normalizedSearch}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Não foi possível carregar seus produtos.");
  }

  return data;
}

export async function listActiveProducts(userId: string, search = "") {
  if (isE2EAuthModeEnabled()) {
    return listActiveTestProducts(userId, search);
  }

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("products")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("name", { ascending: true });

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

export async function getProductById(id: string, userId: string) {
  if (isE2EAuthModeEnabled()) {
    return getTestProductById(id, userId);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error("Não foi possível carregar esse produto.");
  }

  return data;
}

export async function createProduct(userId: string, draft: ProductDraft) {
  if (isE2EAuthModeEnabled()) {
    return createTestProduct(userId, draft);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      ...draft,
      user_id: userId
    })
    .select("*")
    .single();

  if (error) {
    throw new Error("Não foi possível salvar o produto agora.");
  }

  return data;
}

export async function updateProduct(
  id: string,
  userId: string,
  draft: ProductDraft
) {
  if (isE2EAuthModeEnabled()) {
    return updateTestProduct(id, userId, draft);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .update(draft)
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error("Não foi possível atualizar o produto agora.");
  }

  return data;
}

export async function setProductActiveState(
  id: string,
  userId: string,
  isActive: boolean
) {
  if (isE2EAuthModeEnabled()) {
    return setTestProductActiveState(id, userId, isActive);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error("Não foi possível atualizar o status do produto agora.");
  }

  return data;
}
