"use client";

/**
 * AnalyticsTracker — dispara eventos de funil com base em query params.
 *
 * As server actions já redirectam com params de sucesso:
 *   /app/hoje?welcome=1          → onboarding_completed
 *   /app/clientes?created=...    → customer_created
 *   /app/produtos?created=...    → product_created
 *   /app/pedidos/:id?created=1   → order_created
 *   /app/recompra?contacted=1    → repurchase_marked_contacted
 *
 * Este componente lê esses params no mount e dispara o evento correto,
 * depois limpa o param da URL sem causar reload.
 */

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  trackOnboardingCompleted,
  trackCustomerCreated,
  trackProductCreated,
  trackOrderCreated,
  trackRepurchaseMarkedContacted,
  trackHojeScreenViewed
} from "@/lib/analytics";

type HojeAnalyticsProps = {
  chargesCount: number;
  deliveriesCount: number;
  repurchasesCount: number;
};

/**
 * Para a tela Hoje: rastreia visualização + onboarding se ?welcome=1
 */
export function HojeAnalyticsTracker({
  chargesCount,
  deliveriesCount,
  repurchasesCount
}: HojeAnalyticsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const welcome = searchParams.get("welcome");

    // Mede visualização da tela Hoje sempre
    trackHojeScreenViewed({
      charges_count: chargesCount,
      deliveries_count: deliveriesCount,
      repurchases_count: repurchasesCount
    });

    // Detecta conclusão do onboarding
    if (welcome === "1") {
      trackOnboardingCompleted();
      const params = new URLSearchParams(searchParams.toString());
      params.delete("welcome");
      const query = params.toString();
      router.replace(pathname + (query ? `?${query}` : ""), { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

/**
 * Para páginas de listagem: detecta ?created=... e dispara evento.
 */
type ListPageTrackerProps = {
  type: "customer" | "product";
};

export function ListPageAnalyticsTracker({ type }: ListPageTrackerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const created = searchParams.get("created");
    if (!created) return;

    if (type === "customer") {
      trackCustomerCreated({ is_first: created === "customer-product" || created === "customer-order" ? false : true });
    } else if (type === "product") {
      trackProductCreated({
        is_first: true,
        has_repurchase_interval: false // não temos esse dado aqui
      });
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("created");
    const query = params.toString();
    router.replace(pathname + (query ? `?${query}` : ""), { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

/**
 * Para a página de detalhe do pedido: detecta ?created=1 e dispara evento.
 */
type OrderDetailTrackerProps = {
  orderId: string;
  itemCount: number;
};

export function OrderDetailAnalyticsTracker({
  orderId,
  itemCount
}: OrderDetailTrackerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const created = searchParams.get("created");
    if (created !== "1") return;

    trackOrderCreated({ is_first: true, item_count: itemCount });

    const params = new URLSearchParams(searchParams.toString());
    params.delete("created");
    const query = params.toString();
    router.replace(pathname + (query ? `?${query}` : ""), { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

/**
 * Para a página de recompra: detecta ?contacted=1 e dispara evento.
 */
export function RecompraAnalyticsTracker() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const contacted = searchParams.get("contacted");
    if (contacted !== "1") return;

    trackRepurchaseMarkedContacted();

    const params = new URLSearchParams(searchParams.toString());
    params.delete("contacted");
    const query = params.toString();
    router.replace(pathname + (query ? `?${query}` : ""), { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
