export default function AppAreaLoading() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-background px-5 py-8">
      <section className="lv-card p-5">
        <p className="lv-eyebrow">Carregando</p>
        <h1 className="mt-3 text-xl font-bold tracking-[-0.025em] text-foreground">
          Preparando sua área
        </h1>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Estamos validando sua sessão e seu perfil.
        </p>
      </section>
    </main>
  );
}
