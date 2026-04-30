import { AppShell } from "@/components/app-shell";

export default function RecompraLoading() {
  return (
    <AppShell
      title="Recompra"
      description="Acompanhe quando pode ser um bom momento para oferecer reposição de produtos comprados."
    >
      <section className="lv-card p-5">
        <p className="lv-eyebrow">Carregando</p>
        <h2 className="mt-3 text-xl font-bold tracking-[-0.025em] text-foreground">
          Buscando oportunidades de recompra
        </h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Estamos analisando clientes, produtos e compras anteriores.
        </p>
      </section>
    </AppShell>
  );
}
