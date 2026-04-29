export default function AppAreaLoading() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-background px-5 py-8">
      <section className="rounded-lg border border-border bg-white p-5 shadow-soft">
        <p className="text-sm font-semibold text-primary">Carregando</p>
        <h1 className="mt-3 text-xl font-semibold tracking-normal text-foreground">
          Preparando sua área
        </h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Estamos validando sua sessão e seu perfil.
        </p>
      </section>
    </main>
  );
}
