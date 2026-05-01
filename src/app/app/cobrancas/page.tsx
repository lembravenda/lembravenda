import { redirect } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { AppCard, EmptyState, SectionHeader, StatusBadge, buttonStyles } from "@/components/ui";
import { getAuthState } from "@/lib/auth/server";
import { formatOrderTotalCents } from "@/lib/orders/calc";
import { formatDaysOverdue } from "@/lib/orders/labels";
import { listOrders } from "@/lib/orders/server";

export default async function CobrancasPage() {
  const authState = await getAuthState();
  const currentUserId = authState.user?.id;

  if (!currentUserId) {
    redirect("/login");
  }

  const allOrders = await listOrders(currentUserId);

  // Cobranças em aberto: pedidos com pagamento pendente e não cancelados
  const pendingOrders = allOrders
    .filter(
      (order) =>
        order.payment_status === "pending" &&
        order.delivery_status !== "canceled" &&
        !order.canceled_at
    )
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    ); // mais antigos primeiro = maior atraso

  const totalPendingCents = pendingOrders.reduce(
    (sum, order) => sum + order.total_cents,
    0
  );

  function buildWhatsAppMessage(customerName: string | null, totalCents: number) {
    const name = customerName ?? "cliente";
    const valor = formatOrderTotalCents(totalCents);
    const msg = `Olá ${name}! 😊 Passando para lembrar sobre o pagamento de ${valor} referente ao seu pedido. Quando puder acertar, me avisa! Qualquer dúvida é só falar. 🙏\n\n_Organizado com LembraVenda 🟢 lembravenda.com.br_`;
    return `https://wa.me/?text=${encodeURIComponent(msg)}`;
  }

  return (
    <AppShell title="Cobranças">
      <section className="space-y-5">
        {/* Dashboard — total em aberto */}
        {pendingOrders.length > 0 ? (
          <div
            className="relative overflow-hidden rounded-xl p-5"
            style={{
              background: "linear-gradient(135deg, #C2410C 0%, #9A3412 100%)"
            }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
              Total em aberto
            </p>
            <p className="mt-2 text-3xl font-bold tracking-[-0.03em] text-white">
              {formatOrderTotalCents(totalPendingCents)}
            </p>
            <p className="mt-1 text-sm text-white/70">
              {pendingOrders.length}{" "}
              {pendingOrders.length === 1
                ? "cobrança pendente"
                : "cobranças pendentes"}
            </p>
          </div>
        ) : null}

        {pendingOrders.length === 0 ? (
          <EmptyState
            eyebrow="Tudo em dia"
            title="Nenhuma cobrança em aberto"
            description="Quando houver pedidos com pagamento pendente, eles vão aparecer aqui com o botão de cobrar pelo WhatsApp."
            action={
              <Link
                className={buttonStyles("primary")}
                href="/app/pedidos?mode=new#novo-pedido"
              >
                Criar pedido
              </Link>
            }
          />
        ) : (
          <section className="space-y-3">
            <SectionHeader
              title="Pendentes"
              description="Ordenadas pelo tempo em aberto — as mais antigas primeiro."
            />

            {pendingOrders.map((order) => (
              <AppCard className="lv-card-urgent p-4" key={order.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge tone="warning">Pendente</StatusBadge>
                      <span className="text-[11px] text-text-secondary">
                        {formatDaysOverdue(order.created_at)}
                      </span>
                    </div>
                    <h3 className="mt-2 text-[0.9375rem] font-bold tracking-[-0.02em] text-foreground">
                      {order.customer_name ?? "Cliente não encontrada"}
                    </h3>
                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {formatOrderTotalCents(order.total_cents)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <a
                    className={buttonStyles("primary", false)}
                    href={buildWhatsAppMessage(
                      order.customer_name,
                      order.total_cents
                    )}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Cobrar no WhatsApp
                  </a>
                  <Link
                    className={buttonStyles("secondary", false)}
                    href={`/app/pedidos/${order.id}`}
                  >
                    Ver pedido
                  </Link>
                </div>
              </AppCard>
            ))}
          </section>
        )}
      </section>
    </AppShell>
  );
}
