import "server-only";

import { isE2EAuthModeEnabled } from "@/lib/auth/e2e-mode";
import { FREE_LIMITS, getEffectivePlan, getPlanLimits } from "@/lib/billing/plan";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Plan } from "@/types/database";

export type PlanUsage = {
  plan: Plan;
  limits: { customers: number; ordersPerMonth: number };
  used: { customers: number; ordersThisMonth: number };
  atLimit: { customers: boolean; orders: boolean };
};

export async function getPlanUsage(userId: string): Promise<PlanUsage> {
  // Em modo de teste E2E, retorna plano gratuito com uso zerado
  if (isE2EAuthModeEnabled()) {
    return {
      plan: "free",
      limits: { customers: FREE_LIMITS.customers, ordersPerMonth: FREE_LIMITS.ordersPerMonth },
      used: { customers: 0, ordersThisMonth: 0 },
      atLimit: { customers: false, orders: false }
    };
  }

  const supabase = await createSupabaseServerClient();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    { data: profile },
    { count: customerCount },
    { count: orderCount }
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("plan, plan_expires_at")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("customers")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .is("deleted_at", null),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .is("deleted_at", null)
      .gte("created_at", startOfMonth.toISOString())
  ]);

  const effectivePlan = getEffectivePlan(
    profile?.plan ?? "free",
    profile?.plan_expires_at ?? null
  );
  const limits = getPlanLimits(effectivePlan);
  const usedCustomers = customerCount ?? 0;
  const usedOrders = orderCount ?? 0;

  return {
    plan: effectivePlan,
    limits: {
      customers: limits.customers === Infinity ? 999999 : limits.customers,
      ordersPerMonth: limits.ordersPerMonth === Infinity ? 999999 : limits.ordersPerMonth
    },
    used: {
      customers: usedCustomers,
      ordersThisMonth: usedOrders
    },
    atLimit: {
      customers: limits.customers !== Infinity && usedCustomers >= limits.customers,
      orders: limits.ordersPerMonth !== Infinity && usedOrders >= limits.ordersPerMonth
    }
  };
}
