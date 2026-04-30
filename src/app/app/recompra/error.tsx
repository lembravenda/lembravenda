"use client";

import { AppShell } from "@/components/app-shell";

export default function RecompraError({
  error,
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <AppShell
      title="Recompra"
      description="Acompanhe quando pode ser um bom momento para oferecer reposição de produtos comprados."
    >
      <section className="rounded-[14px] border border-danger/30 bg-[#FEF2F2] p-5">
        <p className="text-sm font-semibold text-danger">Erro</p>
        <h2 className="mt-3 text-xl font-bold tracking-[-0.025em] text-foreground">
          Não foi possível abrir suas recompras
        </h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          {error.message || "Tente novamente em instantes."}
        </p>
        <button
          className="mt-5 lv-button-primary"
          onClick={reset}
          type="button"
        >
          Tentar novamente
        </button>
      </section>
    </AppShell>
  );
}
