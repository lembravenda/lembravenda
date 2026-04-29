import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { OrderForm } from "@/components/order-form";
import { getAuthState } from "@/lib/auth/server";
import { listCustomers } from "@/lib/customers/server";
import { formatOrderTotalCents } from "@/lib/orders/calc";
import {
  listActiveProductsForNewOrders,
  listOrders
} from "@/lib/orders/server";

type PedidosPageProps = {
  searchParams?: Promise<{
    mode?: string;
  }>;
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit"
  }).format(new Date(value));
}

function getPaymentStatusLabel(status: string) {
  if (status === "paid") {
    return "Pago";
  }

  if (status === "canceled") {
    return "Cancelado";
  }

  return "Pendente";
}

function getDeliveryStatusLabel(status: string) {
  if (status === "prepared") {
    return "Preparado";
  }

  if (status === "delivered") {
    return "Entregue";
  }

  if (status === "canceled") {
    return "Cancelado";
  }

  return "A preparar";
}

export default async function PedidosPage({ searchParams }: PedidosPageProps) {
  const authState = await getAuthState();
  const params = (await searchParams) ?? {};
  const currentUserId = authState.user?.id;

  if (!currentUserId) {
    return null;
  }

  const [orders, customers, activeProducts] = await Promise.all([
    listOrders(currentUserId),
    listCustomers(currentUserId, ""),
    listActiveProductsForNewOrders(currentUserId)
  ]);

  const isCreating = params.mode === "new" || orders.length === 0;

  return (
    <AppShell
      title="Pedidos"
      description="Monte pedidos com cliente, itens, total e acompanhamento separado de pagamento e entrega."
    >
      <section className="space-y-4">
        <div className="rounded-lg border border-border bg-white p-4 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Novo pedido</p>
              <p className="mt-1 text-sm text-stone-600">
                Produtos ativos aparecem como lista principal para pedido novo.
              </p>
            </div>
            <Link
              className="rounded-md border border-border px-4 py-3 text-sm font-semibold text-foreground"
              href="/app/pedidos?mode=new"
            >
              Criar pedido
            </Link>
          </div>
        </div>

        {isCreating ? (
          <OrderForm customers={customers} products={activeProducts} />
        ) : null}

        {orders.length === 0 ? (
          <section className="rounded-lg border border-dashed border-border bg-white p-5 text-center shadow-soft">
            <p className="text-sm font-semibold text-primary">Estado vazio</p>
            <h2 className="mt-3 text-xl font-semibold tracking-normal text-foreground">
              Ainda não existe nenhum pedido
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Crie seu primeiro pedido para acompanhar pagamento e entrega sem
              sair do celular.
            </p>
            <Link
              className="mt-5 inline-flex rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
              href="/app/pedidos?mode=new#novo-pedido"
            >
              Criar primeiro pedido
            </Link>
          </section>
        ) : (
          <section className="space-y-3">
            {orders.map((order) => (
              <article
                className="rounded-lg border border-border bg-white p-4 shadow-soft"
                key={order.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-foreground">
                      {order.customer_name ?? "Cliente não encontrada"}
                    </h2>
                    <p className="mt-1 text-sm text-stone-600">
                      {order.item_count} item(ns) ·{" "}
                      {formatDateTime(order.created_at)}
                    </p>
                  </div>
                  <Link
                    className="rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground"
                    href={`/app/pedidos/${order.id}`}
                  >
                    Ver detalhes
                  </Link>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-stone-700">
                  <div className="rounded-md bg-muted px-3 py-3">
                    <p className="font-medium text-foreground">Pagamento</p>
                    <p className="mt-1">
                      {getPaymentStatusLabel(order.payment_status)}
                    </p>
                  </div>
                  <div className="rounded-md bg-muted px-3 py-3">
                    <p className="font-medium text-foreground">Entrega</p>
                    <p className="mt-1">
                      {getDeliveryStatusLabel(order.delivery_status)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="text-sm font-medium text-foreground">Total</p>
                  <p className="text-base font-semibold text-foreground">
                    {formatOrderTotalCents(order.total_cents)}
                  </p>
                </div>

                {order.payment_status === "pending" ? (
                  <div className="mt-4 flex justify-end">
                    <Link
                      className="rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
                      href={`/app/pedidos/${order.id}#cobranca-pedido`}
                    >
                      Cobrar
                    </Link>
                  </div>
                ) : null}
              </article>
            ))}
          </section>
        )}
      </section>
    </AppShell>
  );
}
