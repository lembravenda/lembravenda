import { redirect } from "next/navigation";
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
  formatDateTime,
  getDeliveryStatusLabel,
  getPaymentStatusLabel
} from "@/lib/orders/labels";
import {
  listActiveProductsForNewOrders,
  listOrders
} from "@/lib/orders/server";

const PAGE_SIZE = 20;

type PedidosPageProps = {
  searchParams?: Promise<{
    mode?: string;
    page?: string;
  }>;
};

function formatItemCount(count: number) {
  return `${count} ${count === 1 ? "item" : "itens"}`;
}

export default async function PedidosPage({ searchParams }: PedidosPageProps) {
  const authState = await getAuthState();
  const params = (await searchParams) ?? {};
  const currentUserId = authState.user?.id;

  if (!currentUserId) {
    redirect("/login");
  }

  const currentPage = Math.max(0, parseInt(params.page ?? "0", 10) || 0);
  const offset = currentPage * PAGE_SIZE;

  const [ordersWithExtra, customers, activeProducts] = await Promise.all([
    listOrders(currentUserId, { limit: PAGE_SIZE + 1, offset }),
    listCustomers(currentUserId, ""),
    listActiveProductsForNewOrders(currentUserId)
  ]);

  const hasNextPage = ordersWithExtra.length > PAGE_SIZE;
  const hasPrevPage = currentPage > 0;
  const orders = ordersWithExtra.slice(0, PAGE_SIZE);

  const isCreating = params.mode === "new" || (currentPage === 0 && orders.length === 0);

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
        {isCreating ? (
          <OrderForm customers={customers} products={activeProducts} />
        ) : null}

        {currentPage === 0 && orders.length === 0 ? (
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
                      {order.customer_name ?? "Cliente não encontrado"}
                    </h2>
                    <p className="mt-1 text-sm text-text-secondary">
                      {formatItemCount(order.item_count)} ·{" "}
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

            {(hasPrevPage || hasNextPage) ? (
              <div className="flex items-center justify-between gap-3 pt-1">
                {hasPrevPage ? (
                  <Link
                    className={buttonStyles("secondary", false)}
                    href={`/app/pedidos?page=${currentPage - 1}`}
                  >
                    ← Anterior
                  </Link>
                ) : <div />}
                <span className="text-sm text-text-secondary">
                  Página {currentPage + 1}
                </span>
                {hasNextPage ? (
                  <Link
                    className={buttonStyles("secondary", false)}
                    href={`/app/pedidos?page=${currentPage + 1}`}
                  >
                    Próxima →
                  </Link>
                ) : <div />}
              </div>
            ) : null}
          </section>
        )}
      </section>
    </AppShell>
  );
}
