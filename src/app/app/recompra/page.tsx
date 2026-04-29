import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { RepurchaseOpportunityCard } from "@/components/repurchase-opportunity-card";
import { getAuthState } from "@/lib/auth/server";
import { formatOrderTotalCents } from "@/lib/orders/calc";
import { listRepurchaseOpportunities } from "@/lib/repurchase/server";
import { markRepurchaseContactedAction } from "@/app/app/recompra/actions";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}

export default async function RecompraPage() {
  const authState = await getAuthState();
  const currentUserId = authState.user?.id;

  if (!currentUserId) {
    return null;
  }

  const opportunities = await listRepurchaseOpportunities(currentUserId);

  return (
    <AppShell
      title="Recompra"
      description="Acompanhe quando pode ser um bom momento para oferecer reposição de produtos comprados."
    >
      {opportunities.length === 0 ? (
        <section className="rounded-lg border border-dashed border-border bg-white p-5 text-center shadow-soft">
          <h2 className="mt-3 text-xl font-semibold tracking-normal text-foreground">
            Nenhuma cliente para chamar de novo ainda
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            As oportunidades aparecem quando você cria pedidos com produtos que
            têm lembrete de recompra.
          </p>
          <Link
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
            href="/app/produtos?mode=new#novo-produto"
          >
            Ajustar produtos
          </Link>
        </section>
      ) : (
        <section className="space-y-4">
          {opportunities.map((opportunity) => (
            <RepurchaseOpportunityCard
              action={markRepurchaseContactedAction}
              formatDate={formatDate}
              formatPrice={formatOrderTotalCents}
              key={`${opportunity.order_id}:${opportunity.product_id}`}
              opportunity={opportunity}
            />
          ))}
        </section>
      )}
    </AppShell>
  );
}
