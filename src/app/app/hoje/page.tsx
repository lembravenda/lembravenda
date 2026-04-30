import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { OrderStatusActionForm } from "@/components/order-status-action-form";
import {
  AppCard,
  EmptyState,
  SectionHeader,
  StatusBadge,
  StepCard,
  buttonStyles
} from "@/components/ui";
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
        <AppCard className="overflow-hidden bg-primary p-6 text-primary-foreground">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/80">
            O que fazer hoje
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-normal">
            Sua rotina organizada em um só lugar.
          </h2>
          <p className="mt-2 text-sm leading-7 text-primary-foreground/85">
            Veja primeiro quem cobrar, o que entregar e o que vale retomar.
          </p>
        </AppCard>

        {shouldShowFirstSteps ? (
          <AppCard className="p-6" id="primeiros-passos">
            <p className="lv-section-label">Primeiros passos</p>
            <h2 className="mt-3 text-xl font-semibold tracking-normal text-foreground">
              Vamos organizar sua primeira venda?
            </h2>
            <p className="mt-2 text-sm leading-7 text-text-secondary">
              {firstSteps.intro}
            </p>

            <div className="mt-5 space-y-3">
              {firstSteps.steps.map((step, index) => (
                <StepCard
                  action={
                    step.ctaHref && step.ctaLabel ? (
                      <Link
                        className={buttonStyles(
                          step.done ? "secondary" : "primary",
                          false
                        )}
                        href={step.ctaHref}
                      >
                        {step.ctaLabel}
                      </Link>
                    ) : undefined
                  }
                  done={step.done}
                  key={step.key}
                  step={`Passo ${index + 1}`}
                  title={step.title}
                />
              ))}
            </div>
          </AppCard>
        ) : null}

        {!hasTasks && firstSteps.allDone ? (
          <EmptyState
            action={
              <Link
                className={buttonStyles("primary")}
                href="/app/pedidos?mode=new#novo-pedido"
              >
                Criar pedido
              </Link>
            }
            description="Quando surgirem novas cobranças, entregas ou recompras, elas vão aparecer aqui."
            eyebrow="Tudo em dia"
            title="Seu dia está organizado por enquanto"
          />
        ) : null}

        {pendingCharges.length > 0 ? (
          <section aria-label="Cobranças pendentes" className="space-y-3">
            <SectionHeader
              title="Cobrar"
              description="Veja quem ainda precisa acertar o pagamento."
            />

            {pendingCharges.map((order) => (
              <AppCard className="lv-card-urgent p-4" key={order.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <StatusBadge tone="warning">Pagamento pendente</StatusBadge>
                    <h3 className="text-base font-semibold text-foreground">
                      {order.customer_name ?? "Cliente não encontrada"}
                    </h3>
                    <p className="mt-1 text-sm text-stone-600">
                      {formatOrderTotalCents(order.total_cents)}
                    </p>
                  </div>
                  <Link
                    className={buttonStyles("primary", false)}
                    href={`/app/pedidos/${order.id}#cobranca-pedido`}
                  >
                    Cobrar
                  </Link>
                </div>
              </AppCard>
            ))}
          </section>
        ) : null}

        {pendingDeliveries.length > 0 ? (
          <section aria-label="Entregas pendentes" className="space-y-3">
            <SectionHeader
              title="Entregar"
              description="Acompanhe o que ainda precisa sair hoje."
            />

            {pendingDeliveries.map((order) => (
              <AppCard className="lv-card-success p-4" key={order.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <StatusBadge tone="success">
                      {getDeliveryStatusLabel(order.delivery_status)}
                    </StatusBadge>
                    <h3 className="text-base font-semibold text-foreground">
                      {order.customer_name ?? "Cliente não encontrada"}
                    </h3>
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
              </AppCard>
            ))}
          </section>
        ) : null}

        <section aria-label="Chamar de novo" className="space-y-3">
          <SectionHeader
            title="Chamar de novo"
            description="Abra a lista de recompra para ver quem pode estar pronta para um novo pedido."
          />
          <AppCard className="lv-card-urgent p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <StatusBadge tone="urgent">Recompra vencida</StatusBadge>
                <h3 className="mt-3 text-base font-semibold text-foreground">
                  Volte a falar com as clientes no momento certo.
                </h3>
                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  O LembraVenda acompanha os ciclos dos produtos e mostra quem
                  vale retomar.
                </p>
              </div>
              <Link
                className={buttonStyles("secondary", false)}
                href="/app/recompra"
              >
                Ver lista
              </Link>
            </div>
          </AppCard>
        </section>

        {recentOrders.length > 0 ? (
          <section aria-label="Pedidos recentes" className="space-y-3">
            <SectionHeader
              title="Pedidos recentes"
              description="Tudo o que você registrou mais recentemente."
            />

            {recentOrders.map((order) => (
              <AppCard className="p-4" key={order.id}>
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
                    className={buttonStyles("secondary", false)}
                    href={`/app/pedidos/${order.id}`}
                  >
                    Ver pedido
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
              </AppCard>
            ))}
          </section>
        ) : null}
      </section>
    </AppShell>
  );
}
