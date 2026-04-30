"use client";

export default function AppAreaError({
  error,
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-background px-5 py-8">
      <section className="rounded-[14px] border border-danger/30 bg-[#FEF2F2] p-5">
        <p className="text-sm font-semibold text-danger">Erro</p>
        <h1 className="mt-3 text-xl font-bold tracking-[-0.025em] text-foreground">
          Não foi possível abrir sua área
        </h1>
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
    </main>
  );
}
