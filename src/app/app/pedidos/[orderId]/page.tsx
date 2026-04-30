import Link from "next/link";
import { OrderDetailAnalyticsTracker } from "@/components/analytics-tracker";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import {
  markOrderDeliveredAction,
  markOrderPaidAction
} from "@/app/app/pedidos/actions";
import { OrderChargeCard } from "@/components/order-charge-card";
import { OrderStatusActionForm } from "@/components/order-status-action-form";
import { AppCard, StatusBadge, buttonStyles } from "@/components/ui";
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
  searchParams?: Promise<{
    created?: string;
  }>;
};

export default async function PedidoDetalhePage({
  params,
  searchParams
}: PedidoDetalhePageProps) {
  const authState = await getAuthState();
  const { orderId } = await params;
  const parsedSearchParams = (await searchParams) ?? {};
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
      action={
        <Link className={buttonStyles("secondary", false)} href="/app/pedidos">
          Voltar
        </Link>
      }
      title="Detalhe do pedido"
      description="Acompanhe itens, total, pagamento e entrega sem depender do produto atual."
    >
      <OrderDetailAnalyticsTracker orderId={detail.order.id} itemCount={detail.items.length} />
      <section className="space-y-4">
        {parsedSearchParams.created === "1" ? (
          <AppCard className="border-emerald-200 p-6" id="pedido-criado">
            <p className="lv-eyebrow">Pedido criado</p>
            <h2 className="mt-3 text-xl font-bold tracking-[-0.025em] text-foreground">
              Agora você pode cobrar a cliente ou acompanhar o pagamento.
            </h2>
            <div className="mt-5 grid gap-3">
              <Link className={buttonStyles("primary")} href="#cobranca-pedido">
                Cobrar cliente
              </Link>
              <Link className={buttonStyles("secondary")} href="#itens-pedido">
                Ver pedido
              </Link>
            </div>
          </AppCard>
        ) : null}

        <AppCard className="p-5" id="itens-pedido">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="lv-eyebrow">Cliente</p>
              <h2 className="mt-2 text-xl font-bold tracking-[-0.025em] text-foreground">
                {detail.customer?.name ?? "Cliente não encontrada"}
              </h2>
            </div>
            <p className="text-sm text-text-secondary">
              {formatDateTime(detail.order.created_at)}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <StatusBadge
              tone={
                detail.order.payment_status === "paid"
                  ? "success"
                  : detail.order.payment_status === "canceled"
                    ? "danger"
                    : "warning"
              }
            >
              Pagamento: {getPaymentStatusLabel(detail.order.payment_status)}
            </StatusBadge>
            <StatusBadge
              tone={
                detail.order.delivery_status === "delivered"
                  ? "success"
                  : detail.order.delivery_status === "canceled"
                    ? "danger"
                    : "neutral"
              }
            >
              Entrega: {getDeliveryStatusLabel(detail.order.delivery_status)}
            </StatusBadge>
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
        </AppCard>

        {detail.order.payment_status === "pending" ? (
          <OrderChargeCard
            customerName={detail.customer?.name ?? "cliente"}
            customerPhone={detail.customer?.phone ?? null}
            items={detail.items}
            orderId={detail.order.id}
            pixKey={authState.profile?.pix_key ?? null}
            totalCents={detail.order.total_cents}
          />
        ) : null}

        <AppCard className="p-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold tracking-[-0.02em] text-foreground">
              Itens do pedido
            </h2>
            <p className="text-lg font-semibold text-foreground">
              {formatOrderTotalCents(detail.order.total_cents)}
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {detail.items.map((item) => (
              <article
                className="rounded-[10px] border border-border bg-muted p-4"
                key={item.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {item.product_name_snapshot}
                    </h3>
                    <p className="mt-1 text-sm text-text-secondary">
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
        </AppCard>
      </section>
    </AppShell>
  );
}
