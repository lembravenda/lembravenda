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
      <section className="rounded-lg border border-red-200 bg-white p-5 shadow-soft">
        <p className="text-sm font-semibold text-red-700">Erro</p>
        <h2 className="mt-3 text-xl font-semibold tracking-normal text-foreground">
          Não foi possível abrir suas recompras
        </h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          {error.message || "Tente novamente em instantes."}
        </p>
        <button
          className="mt-5 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
          onClick={reset}
          type="button"
        >
          Tentar novamente
        </button>
      </section>
    </AppShell>
  );
}
