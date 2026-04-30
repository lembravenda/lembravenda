"use client";

export default function OnboardingError({
  error,
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-background px-5 py-8">
      <section className="rounded-lg border border-red-200 bg-white p-5 shadow-soft">
        <p className="text-sm font-semibold text-red-700">Erro</p>
        <h1 className="mt-3 text-xl font-semibold tracking-normal text-foreground">
          Não foi possível abrir seu perfil
        </h1>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          {error.message || "Tente novamente em instantes."}
        </p>
        <button
          className="mt-5 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
          onClick={reset}
          type="button"
        >
          Recarregar
        </button>
      </section>
    </main>
  );
}
