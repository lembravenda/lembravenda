import Link from "next/link";
import { AppShell } from "@/components/app-shell";

export default function PedidoNaoEncontrado() {
  return (
    <AppShell
      title="Pedido não encontrado"
      description="Esse pedido não existe mais ou não pertence à sua conta."
    >
      <section className="lv-card p-5">
        <p className="lv-eyebrow">Acesso protegido</p>
        <h2 className="mt-3 text-xl font-bold tracking-[-0.025em] text-foreground">
          Esse pedido não está disponível
        </h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Verifique se ele ainda existe ou volte para a sua lista de pedidos.
        </p>
        <Link
          className="mt-5 lv-button-primary"
          href="/app/pedidos"
        >
          Voltar para pedidos
        </Link>
      </section>
    </AppShell>
  );
}
