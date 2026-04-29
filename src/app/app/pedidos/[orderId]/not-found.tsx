import Link from "next/link";
import { AppShell } from "@/components/app-shell";

export default function PedidoNaoEncontrado() {
  return (
    <AppShell
      title="Pedido não encontrado"
      description="Esse pedido não existe mais ou não pertence à sua conta."
    >
      <section className="rounded-lg border border-border bg-white p-5 shadow-soft">
        <p className="text-sm font-semibold text-primary">Acesso protegido</p>
        <h2 className="mt-3 text-xl font-semibold tracking-normal text-foreground">
          Esse pedido não está disponível
        </h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Verifique se ele ainda existe ou volte para a sua lista de pedidos.
        </p>
        <Link
          className="mt-5 inline-flex rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
          href="/app/pedidos"
        >
          Voltar para pedidos
        </Link>
      </section>
    </AppShell>
  );
}
