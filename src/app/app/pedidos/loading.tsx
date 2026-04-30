import { AppShell } from "@/components/app-shell";

export default function PedidosLoading() {
  return (
    <AppShell
      title="Pedidos"
      description="Monte pedidos com cliente, itens, total e acompanhamento separado de pagamento e entrega."
    >
      <section className="lv-card p-5">
        <p className="lv-eyebrow">Carregando</p>
        <h2 className="mt-3 text-xl font-bold tracking-[-0.025em] text-foreground">
          Buscando seus pedidos
        </h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Estamos preparando a listagem, os detalhes e o formulário desta área.
        </p>
      </section>
    </AppShell>
  );
}
