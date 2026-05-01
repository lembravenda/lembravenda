"use client";

import { useFormStatus } from "react-dom";
import {
  createCheckoutSessionAction,
  createCustomerPortalSessionAction
} from "@/app/app/billing/actions";
import { PLAN_LABELS } from "@/lib/billing/plan";
import type { PlanUsage } from "@/lib/billing/usage";
import { AppCard } from "@/components/ui";

type BillingCardProps = {
  planUsage: PlanUsage;
};

function ActionButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60 w-full"
      disabled={pending}
      type="submit"
    >
      {pending ? "Redirecionando..." : label}
    </button>
  );
}

export function BillingCard({ planUsage }: BillingCardProps) {
  const { plan, used, limits } = planUsage;
  const isPro = plan === "pro";

  const customersUsedPct =
    limits.customers === Infinity ? 0 : Math.min(100, (used.customers / limits.customers) * 100);
  const ordersUsedPct =
    limits.ordersPerMonth === Infinity
      ? 0
      : Math.min(100, (used.ordersThisMonth / limits.ordersPerMonth) * 100);

  return (
    <AppCard className="p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="lv-eyebrow">Assinatura</p>
          <h2 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-foreground">
            Plano {PLAN_LABELS[plan]}
            {isPro ? (
              <span className="ml-2 inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                ativo
              </span>
            ) : null}
          </h2>
        </div>
      </div>

      {!isPro ? (
        <>
          <div className="mt-4 space-y-3">
            <UsageBar
              label="Clientes"
              used={used.customers}
              limit={limits.customers}
              pct={customersUsedPct}
            />
            <UsageBar
              label="Pedidos este mês"
              used={used.ordersThisMonth}
              limit={limits.ordersPerMonth}
              pct={ordersUsedPct}
            />
          </div>

          <p className="mt-4 text-sm leading-6 text-text-secondary">
            Assine o Pro para vender sem limites — clientes ilimitados, pedidos
            ilimitados e suporte prioritário.
          </p>
          <p className="mt-1 text-sm font-medium text-primary">
            Uma cobrança recuperada já paga o mês inteiro. 💚
          </p>

          <form action={createCheckoutSessionAction}>
            <ActionButton label="Assinar Pro — R$19/mês" />
          </form>
          <p className="mt-3 text-center text-xs text-text-tertiary">
            Pagamento seguro via cartão de crédito · Cancele a qualquer momento
          </p>
        </>
      ) : (
        <>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Você tem acesso ilimitado a clientes e pedidos. Obrigado por apoiar
            o LembraVenda! 🚀
          </p>
          <form action={createCustomerPortalSessionAction}>
            <ActionButton label="Gerenciar assinatura" />
          </form>
          <p className="mt-3 text-center text-xs text-text-tertiary">
            Altere forma de pagamento ou cancele pelo portal seguro da Stripe
          </p>
        </>
      )}
    </AppCard>
  );
}

function UsageBar({
  label,
  used,
  limit,
  pct
}: {
  label: string;
  used: number;
  limit: number;
  pct: number;
}) {
  const isNearLimit = pct >= 80;
  const isAtLimit = pct >= 100;

  return (
    <div>
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span
          className={`text-xs ${isAtLimit ? "font-semibold text-danger" : isNearLimit ? "font-medium text-warning" : "text-text-secondary"}`}
        >
          {used} / {limit === Infinity ? "∞" : limit}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all ${isAtLimit ? "bg-danger" : isNearLimit ? "bg-warning" : "bg-primary"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
