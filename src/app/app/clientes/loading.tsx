import { AppShell } from "@/components/app-shell";

export default function ClientesLoading() {
  return (
    <AppShell
      title="Clientes"
      description="Cadastre, encontre e atualize sua base de clientes pelo celular."
    >
      <section className="rounded-lg border border-border bg-white p-5 shadow-soft">
        <p className="text-sm font-semibold text-primary">Carregando</p>
        <h2 className="mt-3 text-xl font-semibold tracking-normal text-foreground">
          Buscando suas clientes
        </h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Estamos preparando a listagem e os formulários desta área.
        </p>
      </section>
    </AppShell>
  );
}
