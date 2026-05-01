import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { AppCard, SectionHeader, StatusBadge, buttonStyles } from "@/components/ui";
import { getAuthState } from "@/lib/auth/server";
import { getCustomerById } from "@/lib/customers/server";
import { formatOrderTotalCents } from "@/lib/orders/calc";
import {
  formatDateTime,
  getDeliveryStatusLabel,
  getPaymentStatusLabel
} from "@/lib/orders/labels";
import { listOrdersByCustomer } from "@/lib/orders/server";

type CustomerDetailPageProps = {
  params: Promise<{ id: string }>;
};

function formatBirthday(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long"
  }).format(new Date(`${value}T00:00:00`));
}

export default async function CustomerDetailPage({
  params
}: CustomerDetailPageProps) {
  const authState = await getAuthState();
  const { id } = await params;
  const currentUserId = authState.user?.id;

  if (!currentUserId) {
    notFound();
  }

  const [customer, orders] = await Promise.all([
    getCustomerById(id, currentUserId),
    listOrdersByCustomer(id, currentUserId)
  ]);

  if (!customer) {
    notFound();
  }

  const paidOrders = orders.filter((o) => o.payment_status === "paid");
  const totalSpentCents = paidOrders.reduce((sum, o) => sum + o.total_cents, 0);
  const avgTicketCents =
    paidOrders.length > 0
      ? Math.round(totalSpentCents / paidOrders.length)
      : 0;
  const pendingCount = orders.filter(
    (o) => o.payment_status === "pending" && o.canceled_at === null
  ).length;

  return (
    <AppShell
      action={
        <Link
          className={buttonStyles("secondary", false)}
          href="/app/clientes"
        >
          Voltar
        </Link>
      }
      title="Detalhe da cliente"
      description="Histórico completo de pedidos, total gasto e ticket médio."
    >
      <section className="space-y-4">
        {/* Perfil */}
        <AppCard className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="lv-eyebrow">Cliente</p>
              <h2 className="mt-2 text-xl font-bold tracking-[-0.025em] text-foreground">
                {customer.name}
              </h2>
            </div>
            <Link
              className={buttonStyles("secondary", false)}
              href={`/app/clientes?edit=${customer.id}`}
            >
              Editar
            </Link>
          </div>

          <dl className="mt-4 space-y-2 text-sm">
            {customer.phone ? (
              <div className="flex items-center justify-between gap-4">
                <dt className="font-medium text-foreground">Telefone</dt>
                <dd className="text-text-secondary">
                  <a
                    href={`https://wa.me/55${customer.phone.replace(/\D/g, "")}`}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    {customer.phone}
                  </a>
                </dd>
              </div>
            ) : null}
            {customer.birthday ? (
              <div className="flex items-center justify-between gap-4">
                <dt className="font-medium text-foreground">Aniversário</dt>
                <dd className="text-text-secondary">
                  {formatBirthday(customer.birthday)}
                </dd>
              </div>
            ) : null}
            {customer.tags.length > 0 ? (
              <div className="flex items-start justify-between gap-4">
                <dt className="font-medium text-foreground">Grupos</dt>
                <dd className="flex flex-wrap justify-end gap-1">
                  {customer.tags.map((tag) => (
                    <StatusBadge key={tag} tone="neutral">
                      {tag}
                    </StatusBadge>
                  ))}
                </dd>
              </div>
            ) : null}
            {customer.notes ? (
              <div className="mt-3 rounded-[10px] bg-muted px-4 py-3 text-text-secondary">
                {customer.notes}
              </div>
            ) : null}
          </dl>
        </AppCard>

        {/* Métricas */}
        <div className="grid grid-cols-3 gap-3">
          <AppCard className="p-4 text-center">
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {orders.length}
            </p>
            <p className="mt-1 text-[11px] font-medium text-text-secondary">
              {orders.length === 1 ? "Pedido" : "Pedidos"}
            </p>
          </AppCard>
          <AppCard className="p-4 text-center">
            <p className="text-lg font-bold tracking-tight text-foreground">
              {formatOrderTotalCents(totalSpentCents)}
            </p>
            <p className="mt-1 text-[11px] font-medium text-text-secondary">
              Total gasto
            </p>
          </AppCard>
          <AppCard className="p-4 text-center">
            <p className="text-lg font-bold tracking-tight text-foreground">
              {avgTicketCents > 0 ? formatOrderTotalCents(avgTicketCents) : "—"}
            </p>
            <p className="mt-1 text-[11px] font-medium text-text-secondary">
              Ticket médio
            </p>
          </AppCard>
        </div>

        {/* Cobranças em aberto */}
        {pendingCount > 0 ? (
          <AppCard className="lv-card-urgent p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <StatusBadge tone="warning">Pagamento pendente</StatusBadge>
                <p className="mt-2 text-sm text-text-secondary">
                  {pendingCount}{" "}
                  {pendingCount === 1 ? "pedido aguarda" : "pedidos aguardam"}{" "}
                  pagamento.
                </p>
              </div>
              <Link
                className={buttonStyles("primary", false)}
                href="/app/cobrancas"
              >
                Cobrar
              </Link>
            </div>
          </AppCard>
        ) : null}

        {/* Histórico de pedidos */}
        {orders.length === 0 ? (
          <AppCard className="p-5 text-center">
            <p className="text-sm text-text-secondary">
              Nenhum pedido registrado para essa cliente ainda.
            </p>
            <Link
              className={`${buttonStyles("primary")} mt-4 inline-flex`}
              href={`/app/pedidos?mode=new#novo-pedido`}
            >
              Criar pedido
            </Link>
          </AppCard>
        ) : (
          <section className="space-y-3">
            <SectionHeader
              title="Histórico de pedidos"
              description="Todos os pedidos desta cliente, do mais recente ao mais antigo."
            />
            {orders.map((order) => (
              <AppCard className="p-4" key={order.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-text-secondary">
                      {formatDateTime(order.created_at)}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {formatOrderTotalCents(order.total_cents)}
                    </p>
                  </div>
                  <Link
                    className={buttonStyles("secondary", false)}
                    href={`/app/pedidos/${order.id}`}
                  >
                    Ver
                  </Link>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusBadge
                    tone={
                      order.payment_status === "paid"
                        ? "success"
                        : order.payment_status === "canceled"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {getPaymentStatusLabel(order.payment_status)}
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
                    {getDeliveryStatusLabel(order.delivery_status)}
                  </StatusBadge>
                </div>
              </AppCard>
            ))}
          </section>
        )}
      </section>
    </AppShell>
  );
}
