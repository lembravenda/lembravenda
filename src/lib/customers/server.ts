import "server-only";

import type { Customer } from "@/types/database";
import { isE2EAuthModeEnabled } from "@/lib/auth/e2e-mode";
import {
  createTestCustomer,
  deleteTestCustomer,
  getTestCustomerById,
  listTestCustomers,
  updateTestCustomer
} from "@/lib/customers/test-store";
import { getEffectivePlan, getPlanLimits } from "@/lib/billing/plan";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CustomerDraft = Pick<
  Customer,
  "birthday" | "name" | "notes" | "phone" | "tags"
>;

export type ListCustomersOptions = {
  limit?: number;
  offset?: number;
};

export async function listCustomers(
  userId: string,
  search: string,
  options?: ListCustomersOptions
) {
  const { limit, offset = 0 } = options ?? {};

  if (isE2EAuthModeEnabled()) {
    const all = await listTestCustomers(userId, search);
    if (limit !== undefined) {
      return all.slice(offset, offset + limit);
    }
    return all;
  }

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("customers")
    .select("*")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("name", { ascending: true });

  const normalizedSearch = search.trim();

  if (normalizedSearch) {
    const escapedSearch = normalizedSearch.replaceAll(",", "\\,");
    query = query.or(
      `name.ilike.%${escapedSearch}%,phone.ilike.%${escapedSearch}%`
    );
  }

  if (limit !== undefined) {
    query = query.range(offset, offset + limit - 1);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Não foi possível carregar suas clientes.");
  }

  return data;
}

export async function getCustomerById(id: string, userId: string) {
  if (isE2EAuthModeEnabled()) {
    return getTestCustomerById(id, userId);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error("Não foi possível carregar essa cliente.");
  }

  return data;
}

export async function createCustomer(userId: string, draft: CustomerDraft) {
  if (isE2EAuthModeEnabled()) {
    return createTestCustomer(userId, draft);
  }

  const supabase = await createSupabaseServerClient();

  // Verificar limite do plano Free
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, plan_expires_at")
    .eq("user_id", userId)
    .maybeSingle();

  const effectivePlan = getEffectivePlan(
    profile?.plan ?? "free",
    profile?.plan_expires_at ?? null
  );
  const limits = getPlanLimits(effectivePlan);

  if (limits.customers !== Infinity) {
    const { count } = await supabase
      .from("customers")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .is("deleted_at", null);

    if ((count ?? 0) >= limits.customers) {
      throw new Error(
        `PLAN_LIMIT:customers:${limits.customers}`
      );
    }
  }

  const { data, error } = await supabase
    .from("customers")
    .insert({
      ...draft,
      user_id: userId
    })
    .select("*")
    .single();

  if (error) {
    throw new Error("Não foi possível salvar a cliente agora.");
  }

  return data;
}

export async function updateCustomer(
  id: string,
  userId: string,
  draft: CustomerDraft
) {
  if (isE2EAuthModeEnabled()) {
    return updateTestCustomer(id, userId, draft);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("customers")
    .update(draft)
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error("Não foi possível atualizar a cliente agora.");
  }

  return data;
}

export async function deleteCustomer(id: string, userId: string) {
  if (isE2EAuthModeEnabled()) {
    return deleteTestCustomer(id, userId);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (!error) {
    return true;
  }

  if (error.code === "23503") {
    throw new Error(
      "Essa cliente já tem pedidos associados e não pode ser excluída agora."
    );
  }

  throw new Error("Não foi possível excluir a cliente agora.");
}
