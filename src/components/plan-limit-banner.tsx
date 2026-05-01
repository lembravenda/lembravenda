"use client";

import { useFormStatus } from "react-dom";
import { createCheckoutSessionAction } from "@/app/app/billing/actions";

type PlanLimitBannerProps = {
  type: "customers" | "orders";
  limit: number;
};

function UpgradeButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? "Redirecionando..." : "Assinar Pro — R$19/mês"}
    </button>
  );
}

export function PlanLimitBanner({ type, limit }: PlanLimitBannerProps) {
  const isCustomers = type === "customers";

  return (
    <div className="rounded-xl border border-primary/20 bg-primary-lighter p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
        Limite do plano gratuito
      </p>
      <h3 className="mt-2 text-base font-bold tracking-[-0.02em] text-foreground">
        {isCustomers
          ? `Você atingiu o limite de ${limit} clientes`
          : `Você atingiu o limite de ${limit} pedidos este mês`}
      </h3>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        {isCustomers
          ? "No plano gratuito você pode ter até 10 clientes. Assine o Pro para cadastrar quantos quiser."
          : "No plano gratuito você pode criar até 30 pedidos por mês. Assine o Pro para vender sem limite."}
      </p>
      <p className="mt-2 text-sm font-medium text-primary">
        Uma cobrança recuperada já paga o mês inteiro. 💚
      </p>
      <form action={createCheckoutSessionAction}>
        <UpgradeButton />
      </form>
      <p className="mt-3 text-center text-xs text-text-tertiary">
        Pagamento seguro via cartão de crédito
      </p>
    </div>
  );
}
