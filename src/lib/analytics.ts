"use client";

/**
 * LembraVenda — Analytics
 *
 * Wrapper sobre PostHog para rastrear eventos do funil de ativação.
 * Page views automáticos ficam com @vercel/analytics (já no layout.tsx).
 *
 * SETUP: adicione NEXT_PUBLIC_POSTHOG_KEY nas variáveis de ambiente da Vercel
 * (obtida em posthog.com após criar o projeto).
 * Enquanto a key não estiver configurada, os eventos são apenas logados no console.
 */

import posthog from "posthog-js";

let initialized = false;

function init() {
  if (initialized) return;
  if (typeof window === "undefined") return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) {
    console.info("[analytics] NEXT_PUBLIC_POSTHOG_KEY não configurado — eventos apenas no console");
    initialized = true;
    return;
  }

  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com",
    capture_pageview: false, // page views via @vercel/analytics
    capture_pageleave: true,
    persistence: "localStorage+cookie",
    autocapture: false
  });
  initialized = true;
}

function track(event: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  init();

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) {
    console.info(`[analytics] ${event}`, properties ?? "");
    return;
  }
  posthog.capture(event, properties);
}

// ─── Funil de ativação ────────────────────────────────────────────────────

/** Usuária completou o onboarding (perfil salvo pela primeira vez) */
export function trackOnboardingCompleted() {
  track("onboarding_completed");
}

/** Primeira cliente criada */
export function trackCustomerCreated(props?: { is_first: boolean }) {
  track("customer_created", props);
}

/** Primeiro produto criado */
export function trackProductCreated(props?: {
  is_first: boolean;
  has_repurchase_interval: boolean;
}) {
  track("product_created", props);
}

/** Pedido criado */
export function trackOrderCreated(props?: {
  is_first: boolean;
  item_count: number;
}) {
  track("order_created", props);
}

// ─── Cobrança ─────────────────────────────────────────────────────────────

/** Mensagem de cobrança copiada */
export function trackPaymentMessageCopied(props?: { order_id: string }) {
  track("payment_message_copied", props);
}

/** Link do WhatsApp aberto para cobrança */
export function trackWhatsappLinkOpened(props?: {
  order_id: string;
  context: "charge" | "repurchase";
}) {
  track("whatsapp_link_opened", props);
}

// ─── Recompra ─────────────────────────────────────────────────────────────

/** Mensagem de recompra copiada */
export function trackRepurchaseMessageCopied(props?: { follow_up_id: string }) {
  track("repurchase_message_copied", props);
}

/** Oportunidade de recompra marcada como contatada */
export function trackRepurchaseMarkedContacted(props?: {
  follow_up_id?: string;
}) {
  track("repurchase_marked_contacted", props);
}

// ─── Tela Hoje ────────────────────────────────────────────────────────────

/** Tela Hoje carregada — mede uso recorrente */
export function trackHojeScreenViewed(props?: {
  charges_count: number;
  deliveries_count: number;
  repurchases_count: number;
}) {
  track("hoje_screen_viewed", props);
}

// ─── Identificação ────────────────────────────────────────────────────────

/** Identifica a usuária após login (vincula eventos ao perfil) */
export function identifyUser(userId: string, props?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  init();

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;
  posthog.identify(userId, props);
}

/** Limpa identidade após logout */
export function resetUser() {
  if (typeof window === "undefined") return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;
  posthog.reset();
}
