import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { OrderForm } from "@/components/order-form";
import {
  AppCard,
  EmptyState,
  SectionHeader,
  StatusBadge,
  buttonStyles
} from "@/components/ui";
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
      action={
        <Link
          className={buttonStyles("primary", false)}
          href="/app/pedidos?mode=new#novo-pedido"
        >
          Criar
        </Link>
      }
      title="Pedidos"
      description="Monte pedidos com cliente, itens, total e acompanhamento separado de pagamento e entrega."
    >
      <section className="space-y-4">
        <AppCard className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="lv-section-label">Novo pedido</p>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Produtos ativos aparecem como lista principal para pedido novo.
              </p>
            </div>
            <Link
              className={buttonStyles("secondary", false)}
              href="/app/pedidos?mode=new"
            >
              Criar pedido
            </Link>
          </div>
        </AppCard>

        {isCreating ? (
          <OrderForm customers={customers} products={activeProducts} />
        ) : null}

        {orders.length === 0 ? (
          <EmptyState
            action={
              <Link
                className={buttonStyles("primary")}
                href="/app/pedidos?mode=new#novo-pedido"
              >
                Criar primeiro pedido
              </Link>
            }
            description="Um pedido junta cliente, produto, valor e status de pagamento."
            eyebrow="Primeira venda"
            title="Crie seu primeiro pedido"
          />
        ) : (
          <section className="space-y-3">
            <SectionHeader
              description="Veja rapidamente o total e os status de cada pedido."
              title="Pedidos cadastrados"
            />
            {orders.map((order) => (
              <AppCard className="p-4" key={order.id}>
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
                    className={buttonStyles("secondary", false)}
                    href={`/app/pedidos/${order.id}`}
                  >
                    Ver detalhes
                  </Link>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <StatusBadge
                    tone={
                      order.payment_status === "paid"
                        ? "success"
                        : order.payment_status === "canceled"
                          ? "danger"
                          : "warning"
                    }
                  >
                    Pagamento: {getPaymentStatusLabel(order.payment_status)}
                  </StatusBadge>
                  <StatusBadge
                    tone={
                      order.delivery_status === "delivered"
                        ? "success"
                        : order.delivery_status === "canceled"
                          ? "danger"
                          : "neutral"
                    }
                  >
                    Entrega: {getDeliveryStatusLabel(order.delivery_status)}
                  </StatusBadge>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="text-sm font-medium text-foreground">Total</p>
                  <p className="text-lg font-semibold text-foreground">
                    {formatOrderTotalCents(order.total_cents)}
                  </p>
                </div>

                {order.payment_status === "pending" ? (
                  <div className="mt-4 flex justify-end">
                    <Link
                      className={buttonStyles("primary", false)}
                      href={`/app/pedidos/${order.id}#cobranca-pedido`}
                    >
                      Cobrar
                    </Link>
                  </div>
                ) : null}
              </AppCard>
            ))}
          </section>
        )}
      </section>
    </AppShell>
  );
}
