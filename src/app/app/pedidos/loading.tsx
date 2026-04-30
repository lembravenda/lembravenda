import { AppShell } from "@/components/app-shell";

export default function PedidosLoading() {
  return (
    <AppShell
      title="Pedidos"
      description="Monte pedidos com cliente, itens, total e acompanhamento separado de pagamento e entrega."
    >
      <section className="rounded-lg border border-border bg-white p-5 shadow-soft">
        <p className="text-sm font-semibold text-primary">Carregando</p>
        <h2 className="mt-3 text-xl font-semibold tracking-normal text-foreground">
          Buscando seus pedidos
        </h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Estamos preparando a listagem, os detalhes e o formulário desta área.
        </p>
      </section>
    </AppShell>
  );
}
