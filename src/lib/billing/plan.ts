import type { Plan } from "@/types/database";

export const FREE_LIMITS = {
  customers: 10,
  ordersPerMonth: 30
} as const;

export const PLAN_LABELS: Record<Plan, string> = {
  free: "Gratuito",
  pro: "Pro"
};

export function isPro(plan: Plan | string): boolean {
  return plan === "pro";
}

export function getPlanLimits(plan: Plan | string) {
  if (isPro(plan)) {
    return {
      customers: Infinity,
      ordersPerMonth: Infinity
    };
  }
  return FREE_LIMITS;
}

export function isActivePlan(plan: Plan, planExpiresAt: string | null): boolean {
  if (plan === "free") return true;
  if (!planExpiresAt) return true; // pro sem expiração (legacy ou vitalício)
  return new Date(planExpiresAt) > new Date();
}

export function getEffectivePlan(
  plan: Plan,
  planExpiresAt: string | null
): Plan {
  if (!isActivePlan(plan, planExpiresAt)) return "free";
  return plan;
}
