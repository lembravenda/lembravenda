import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import {
  markOrderDeliveredAction,
  markOrderPaidAction
} from "@/app/app/pedidos/actions";
import { OrderChargeCard } from "@/components/order-charge-card";
import { OrderStatusActionForm } from "@/components/order-status-action-form";
import { getAuthState } from "@/lib/auth/server";
import { formatOrderTotalCents } from "@/lib/orders/calc";
import { getOrderDetail } from "@/lib/orders/server";

function formatDateTime(value: string | null) {
  if (!value) {
    return null;
  }

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

type PedidoDetalhePageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function PedidoDetalhePage({
  params
}: PedidoDetalhePageProps) {
  const authState = await getAuthState();
  const { orderId } = await params;
  const currentUserId = authState.user?.id;

  if (!currentUserId) {
    notFound();
  }

  const detail = await getOrderDetail(orderId, currentUserId);

  if (!detail) {
    notFound();
  }

  return (
    <AppShell
      title="Detalhe do pedido"
      description="Acompanhe itens, total, pagamento e entrega sem depender do produto atual."
    >
      <section className="space-y-4">
        <Link
          className="inline-flex rounded-md border border-border px-4 py-3 text-sm font-semibold text-foreground"
          href="/app/pedidos"
        >
          Voltar para pedidos
        </Link>

        <section className="rounded-lg border border-border bg-white p-5 shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-primary">Cliente</p>
              <h2 className="mt-2 text-xl font-semibold tracking-normal text-foreground">
                {detail.customer?.name ?? "Cliente não encontrada"}
              </h2>
            </div>
            <p className="text-sm text-stone-600">
              {formatDateTime(detail.order.created_at)}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-stone-700">
            <div className="rounded-md bg-muted px-3 py-3">
              <p className="font-medium text-foreground">Pagamento</p>
              <p className="mt-1">
                {getPaymentStatusLabel(detail.order.payment_status)}
              </p>
            </div>
            <div className="rounded-md bg-muted px-3 py-3">
              <p className="font-medium text-foreground">Entrega</p>
              <p className="mt-1">
                {getDeliveryStatusLabel(detail.order.delivery_status)}
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {detail.order.payment_status !== "paid" &&
            detail.order.payment_status !== "canceled" ? (
              <OrderStatusActionForm
                action={markOrderPaidAction}
                confirmMessage="Marcar este pedido como pago?"
                idleLabel="Marcar como pago"
                orderId={detail.order.id}
                pendingLabel="Salvando pagamento..."
              />
            ) : null}

            {detail.order.delivery_status !== "delivered" &&
            detail.order.delivery_status !== "canceled" ? (
              <OrderStatusActionForm
                action={markOrderDeliveredAction}
                confirmMessage="Marcar este pedido como entregue?"
                idleLabel="Marcar como entregue"
                orderId={detail.order.id}
                pendingLabel="Salvando entrega..."
              />
            ) : null}
          </div>
        </section>

        {detail.order.payment_status === "pending" ? (
          <OrderChargeCard
            customerName={detail.customer?.name ?? "cliente"}
            customerPhone={detail.customer?.phone ?? null}
            items={detail.items}
            pixKey={authState.profile?.pix_key ?? null}
            totalCents={detail.order.total_cents}
          />
        ) : null}

        <section className="rounded-lg border border-border bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold tracking-normal text-foreground">
              Itens do pedido
            </h2>
            <p className="text-base font-semibold text-foreground">
              {formatOrderTotalCents(detail.order.total_cents)}
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {detail.items.map((item) => (
              <article
                className="rounded-md border border-border bg-background p-4"
                key={item.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {item.product_name_snapshot}
                    </h3>
                    <p className="mt-1 text-sm text-stone-600">
                      {formatOrderTotalCents(item.unit_price_cents)} x{" "}
                      {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {formatOrderTotalCents(item.line_total_cents)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </AppShell>
  );
}
