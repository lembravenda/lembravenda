import { AppShell } from "@/components/app-shell";

export default function RecompraLoading() {
  return (
    <AppShell
      title="Recompra"
      description="Acompanhe quando pode ser um bom momento para oferecer reposição de produtos comprados."
    >
      <section className="rounded-lg border border-border bg-white p-5 shadow-soft">
        <p className="text-sm font-semibold text-primary">Carregando</p>
        <h2 className="mt-3 text-xl font-semibold tracking-normal text-foreground">
          Buscando oportunidades de recompra
        </h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Estamos analisando clientes, produtos e compras anteriores.
        </p>
      </section>
    </AppShell>
  );
}
