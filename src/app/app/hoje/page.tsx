import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { OrderStatusActionForm } from "@/components/order-status-action-form";
import { markOrderDeliveredAction } from "@/app/app/pedidos/actions";
import { getAuthState } from "@/lib/auth/server";
import { listCustomers } from "@/lib/customers/server";
import { buildFirstStepsState } from "@/lib/onboarding/first-steps";
import { formatOrderTotalCents } from "@/lib/orders/calc";
import { getTodayDashboard, listOrders } from "@/lib/orders/server";
import { listProducts } from "@/lib/products/server";

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

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit"
  }).format(new Date(value));
}

type HojePageProps = {
  searchParams?: Promise<{
    welcome?: string;
  }>;
};

export default async function HojePage({ searchParams }: HojePageProps) {
  const authState = await getAuthState();
  const currentUserId = authState.user?.id;
  const params = (await searchParams) ?? {};

  if (!currentUserId) {
    return null;
  }

  const [dashboard, customers, products, orders] = await Promise.all([
    getTodayDashboard(currentUserId),
    listCustomers(currentUserId, ""),
    listProducts(currentUserId, ""),
    listOrders(currentUserId)
  ]);
  const { pendingCharges, pendingDeliveries, recentOrders } = dashboard;
  const hasTasks =
    pendingCharges.length > 0 ||
    pendingDeliveries.length > 0 ||
    recentOrders.length > 0;
  const firstSteps = buildFirstStepsState({
    hasCustomer: customers.length > 0,
    hasOrder: orders.length > 0,
    hasProduct: products.length > 0
  });
  const shouldShowFirstSteps = params.welcome === "1" || !firstSteps.allDone;

  return (
    <AppShell
      title="Hoje"
      description="Comece pelo que pede ação agora: cobrar, entregar e acompanhar os pedidos mais recentes."
    >
      <section className="space-y-5">
        {shouldShowFirstSteps ? (
          <section
            className="rounded-lg border border-border bg-white p-5 shadow-soft"
            id="primeiros-passos"
          >
            <p className="text-sm font-semibold text-primary">
              Primeiros passos
            </p>
            <h2 className="mt-3 text-xl font-semibold tracking-normal text-foreground">
              Vamos organizar sua primeira venda?
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              {firstSteps.intro}
            </p>

            <div className="mt-5 space-y-3">
              {firstSteps.steps.map((step) => (
                <article
                  className={`rounded-md border px-4 py-4 ${
                    step.done
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-border bg-background"
                  }`}
                  key={step.key}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {step.title}
                      </p>
                      <p
                        className={`mt-2 text-sm ${
                          step.done ? "text-emerald-700" : "text-stone-600"
                        }`}
                      >
                        {step.done ? "Concluído" : "Pendente"}
                      </p>
                    </div>

                    {step.ctaHref && step.ctaLabel ? (
                      <Link
                        className="rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
                        href={step.ctaHref}
                      >
                        {step.ctaLabel}
                      </Link>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {!hasTasks && firstSteps.allDone ? (
          <section className="rounded-lg border border-dashed border-border bg-white p-5 text-center shadow-soft">
            <p className="text-sm font-semibold text-primary">Estado vazio</p>
            <h2 className="mt-3 text-xl font-semibold tracking-normal text-foreground">
              Nada pendente por hoje
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Quando você criar pedidos, cobranças e entregas, elas vão aparecer
              aqui.
            </p>
          </section>
        ) : null}

        {pendingCharges.length > 0 ? (
          <section
            aria-label="Cobranças pendentes"
            className="space-y-3"
            aria-labelledby="hoje-cobrancas"
          >
            <div>
              <p className="text-sm font-semibold text-primary">Prioridade 1</p>
              <h2
                className="mt-2 text-lg font-semibold tracking-normal text-foreground"
                id="hoje-cobrancas"
              >
                Cobranças pendentes
              </h2>
            </div>

            {pendingCharges.map((order) => (
              <article
                className="rounded-lg border border-border bg-white p-4 shadow-soft"
                key={order.id}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {order.customer_name ?? "Cliente não encontrada"}
                    </h3>
                    <p className="mt-1 text-sm text-stone-600">
                      {formatOrderTotalCents(order.total_cents)}
                    </p>
                  </div>
                  <Link
                    className="rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
                    href={`/app/pedidos/${order.id}#cobranca-pedido`}
                  >
                    Cobrar
                  </Link>
                </div>
              </article>
            ))}
          </section>
        ) : null}

        {pendingDeliveries.length > 0 ? (
          <section
            aria-label="Entregas pendentes"
            className="space-y-3"
            aria-labelledby="hoje-entregas"
          >
            <div>
              <p className="text-sm font-semibold text-primary">Prioridade 2</p>
              <h2
                className="mt-2 text-lg font-semibold tracking-normal text-foreground"
                id="hoje-entregas"
              >
                Entregas pendentes
              </h2>
            </div>

            {pendingDeliveries.map((order) => (
              <article
                className="rounded-lg border border-border bg-white p-4 shadow-soft"
                key={order.id}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {order.customer_name ?? "Cliente não encontrada"}
                    </h3>
                    <p className="mt-1 text-sm text-stone-600">
                      {getDeliveryStatusLabel(order.delivery_status)}
                    </p>
                  </div>
                  <OrderStatusActionForm
                    action={markOrderDeliveredAction}
                    confirmMessage="Marcar este pedido como entregue?"
                    idleLabel="Marcar entregue"
                    orderId={order.id}
                    pendingLabel="Salvando..."
                    redirectTo="/app/hoje"
                  />
                </div>
              </article>
            ))}
          </section>
        ) : null}

        {recentOrders.length > 0 ? (
          <section
            aria-label="Pedidos recentes"
            className="space-y-3"
            aria-labelledby="hoje-recentes"
          >
            <div>
              <p className="text-sm font-semibold text-primary">Visão rápida</p>
              <h2
                className="mt-2 text-lg font-semibold tracking-normal text-foreground"
                id="hoje-recentes"
              >
                Pedidos recentes
              </h2>
            </div>

            {recentOrders.map((order) => (
              <article
                className="rounded-lg border border-border bg-white p-4 shadow-soft"
                key={order.id}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {order.customer_name ?? "Cliente não encontrada"}
                    </h3>
                    <p className="mt-1 text-sm text-stone-600">
                      {formatDateTime(order.created_at)}
                    </p>
                  </div>
                  <Link
                    className="rounded-md border border-border px-4 py-3 text-sm font-semibold text-foreground"
                    href={`/app/pedidos/${order.id}`}
                  >
                    Ver pedido
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
              </article>
            ))}
          </section>
        ) : null}
      </section>
    </AppShell>
  );
}
