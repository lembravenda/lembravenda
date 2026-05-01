import { redirect } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { HojeAnalyticsTracker } from "@/components/analytics-tracker";
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
import {
  getDeliveryStatusLabel,
  getPaymentStatusLabel,
  formatDateTime
} from "@/lib/orders/labels";
import { getTodayDashboard, listOrders } from "@/lib/orders/server";
import { listProducts } from "@/lib/products/server";

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
    redirect("/login");
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
  const tasksSummary = [
    pendingCharges.length > 0
      ? `${pendingCharges.length} cobrança${pendingCharges.length === 1 ? "" : "s"}`
      : null,
    pendingDeliveries.length > 0
      ? `${pendingDeliveries.length} entrega${pendingDeliveries.length === 1 ? "" : "s"}`
      : null,
    recentOrders.length > 0
      ? `${recentOrders.length} pedido${recentOrders.length === 1 ? "" : "s"} recente${recentOrders.length === 1 ? "" : "s"}`
      : null
  ].filter(Boolean);
  const heroDescription =
    tasksSummary.length > 0
      ? `Hoje você tem ${tasksSummary.join(", ")} para acompanhar.`
      : "Veja o que precisa da sua atenção hoje.";

  // Oportunidades de recompra: clientes com ciclo vencido
  // Por ora usa a lista de pedidos para checar se há algum contexto de recompra
  const hasRecompraOpportunities = orders.some(
    (order) => order.payment_status === "paid" && order.delivery_status === "delivered"
  );

  return (
    <AppShell
      title="Hoje"
      description="Comece pelo que pede ação agora: cobrar, entregar e acompanhar os pedidos mais recentes."
    >
      <HojeAnalyticsTracker
        chargesCount={pendingCharges.length}
        deliveriesCount={pendingDeliveries.length}
        repurchasesCount={0}
      />
      <section className="space-y-5">
        {/* Hero card — gradiente com profundidade */}
        <div
          className="relative overflow-hidden rounded-xl p-6 text-primary-foreground"
          style={{
            background:
              "linear-gradient(135deg, #2E7D57 0%, #1A5C3E 60%, #134830 100%)"
          }}
        >
          {/* Subtle radial orb âmbar para profundidade */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -top-6 h-36 w-36 rounded-full opacity-25"
            style={{
              background:
                "radial-gradient(circle, rgba(245,166,35,0.55) 0%, transparent 70%)"
            }}
          />
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary-foreground/70">
            O que fazer hoje
          </p>
          <h2 className="mt-2.5 text-xl font-bold leading-[1.25] tracking-[-0.025em]">
            Cobrar, entregar e chamar de novo.
          </h2>
          <p className="mt-2 text-sm leading-6 text-primary-foreground/80">
            {heroDescription}
          </p>

          {/* Stats row */}
          {hasTasks ? (
            <div className="mt-5 flex items-center gap-4 border-t border-primary-foreground/15 pt-4">
              {pendingCharges.length > 0 ? (
                <div className="text-center">
                  <p className="text-xl font-bold leading-none">
                    {pendingCharges.length}
                  </p>
                  <p className="mt-1 text-[10px] font-medium text-primary-foreground/70">
                    {pendingCharges.length === 1 ? "cobrança" : "cobranças"}
                  </p>
                </div>
              ) : null}
              {pendingDeliveries.length > 0 ? (
                <div className="text-center">
                  <p className="text-xl font-bold leading-none">
                    {pendingDeliveries.length}
                  </p>
                  <p className="mt-1 text-[10px] font-medium text-primary-foreground/70">
                    {pendingDeliveries.length === 1 ? "entrega" : "entregas"}
                  </p>
                </div>
              ) : null}
              {recentOrders.length > 0 ? (
                <div className="text-center">
                  <p className="text-xl font-bold leading-none">
                    {recentOrders.length}
                  </p>
                  <p className="mt-1 text-[10px] font-medium text-primary-foreground/70">
                    {recentOrders.length === 1 ? "pedido" : "pedidos"}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        {shouldShowFirstSteps ? (
          <AppCard className="p-6" id="primeiros-passos">
            <p className="lv-eyebrow">Primeiros passos</p>
            <h2 className="mt-2.5 text-[1.1rem] font-bold tracking-[-0.025em] text-foreground">
              Vamos organizar sua primeira venda?
            </h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
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
              action={
                <Link
                  className="text-xs font-semibold text-primary"
                  href="/app/cobrancas"
                >
                  Ver todas →
                </Link>
              }
            />

            {pendingCharges.map((order) => (
              <AppCard className="lv-card-urgent p-4" key={order.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <StatusBadge tone="warning">Pagamento pendente</StatusBadge>
                    <h3 className="mt-2 text-[0.9375rem] font-bold tracking-[-0.02em] text-foreground">
                      {order.customer_name ?? "Cliente não encontrado"}
                    </h3>
                    <p className="mt-1 text-sm text-text-secondary">
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
                    <h3 className="mt-2 text-[0.9375rem] font-bold tracking-[-0.02em] text-foreground">
                      {order.customer_name ?? "Cliente não encontrado"}
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

        {/* Seção "Chamar de novo" — só aparece quando há oportunidades reais */}
        {hasRecompraOpportunities ? (
          <section aria-label="Chamar de novo" className="space-y-3">
            <SectionHeader
              title="Chamar de novo"
              description="Abra a lista de recompra para ver quem pode estar pronta para um novo pedido."
            />
            <AppCard className="lv-card-urgent p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <StatusBadge tone="urgent">Recompra vencida</StatusBadge>
                  <h3 className="mt-2.5 text-[0.9375rem] font-bold tracking-[-0.02em] text-foreground">
                    Volte a falar com seus clientes na hora certa.
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-text-secondary">
                    O LembraVenda acompanha os ciclos dos produtos e mostra quem
                    está na hora certa de comprar de novo.
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
        ) : null}

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
                    <h3 className="text-[0.9375rem] font-bold tracking-[-0.02em] text-foreground">
                      {order.customer_name ?? "Cliente não encontrado"}
                    </h3>
                    <p className="mt-1 text-sm text-text-secondary">
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
