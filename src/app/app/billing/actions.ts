"use server";

import { redirect } from "next/navigation";
import { getAuthState } from "@/lib/auth/server";
import { stripe, isStripeConfigured } from "@/lib/billing/stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://lembravenda.com.br";

export async function createCheckoutSessionAction() {
  if (!isStripeConfigured() || !stripe) {
    throw new Error("Sistema de pagamento não configurado.");
  }

  const authState = await getAuthState();
  const userId = authState.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const profile = authState.profile;

  // Reutiliza customer Stripe existente se já criado
  let customerId = profile?.stripe_customer_id ?? undefined;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: authState.user?.email ?? undefined,
      metadata: { user_id: userId }
    });
    customerId = customer.id;

    // Salva o customer_id no perfil
    const supabase = await createSupabaseServerClient();
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("user_id", userId);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID_PRO!,
        quantity: 1
      }
    ],
    success_url: `${APP_URL}/app/configuracoes?upgrade=success`,
    cancel_url: `${APP_URL}/app/configuracoes?upgrade=cancelled`,
    metadata: { user_id: userId },
    locale: "pt-BR",
    allow_promotion_codes: true
  });

  redirect(session.url!);
}

export async function createCustomerPortalSessionAction() {
  if (!isStripeConfigured() || !stripe) {
    throw new Error("Sistema de pagamento não configurado.");
  }

  const authState = await getAuthState();
  const userId = authState.user?.id;
  const customerId = authState.profile?.stripe_customer_id;

  if (!userId || !customerId) {
    redirect("/app/configuracoes");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${APP_URL}/app/configuracoes`
  });

  redirect(session.url);
}
