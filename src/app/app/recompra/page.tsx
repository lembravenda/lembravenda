import Link from "next/link";
import { RecompraAnalyticsTracker } from "@/components/analytics-tracker";
import { AppShell } from "@/components/app-shell";
import { RepurchaseOpportunityCard } from "@/components/repurchase-opportunity-card";
import { EmptyState, SectionHeader, buttonStyles } from "@/components/ui";
import { redirect } from "next/navigation";
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
    redirect("/login");
  }

  const opportunities = await listRepurchaseOpportunities(currentUserId);

  return (
    <>
    <RecompraAnalyticsTracker />
    <AppShell
      title="Cobranças"
      description="Acompanhe quando pode ser um bom momento para oferecer reposição de produtos comprados."
    >
      {opportunities.length === 0 ? (
        <EmptyState
          action={
            <Link
              className={buttonStyles("primary")}
              href="/app/produtos?mode=new#novo-produto"
            >
              Ajustar produtos
            </Link>
          }
          description="As oportunidades aparecem quando você cria pedidos com produtos que têm lembrete de recompra."
          eyebrow="Sem alertas agora"
          title="Nenhum cliente para chamar de novo ainda"
        />
      ) : (
        <section className="space-y-4">
          <SectionHeader
            description="Use a data da última compra para retomar a conversa no momento certo."
            title="Chamar de novo"
          />
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
    </>
  );
}
