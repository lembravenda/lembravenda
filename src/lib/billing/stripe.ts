import "server-only";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  // Stripe is optional — app works without it (no upgrade flow)
  // Set STRIPE_SECRET_KEY, STRIPE_PRICE_ID_PRO, STRIPE_WEBHOOK_SECRET to enable billing
}

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-04-22.dahlia"
    })
  : null;

export function isStripeConfigured(): boolean {
  return !!(
    process.env.STRIPE_SECRET_KEY &&
    process.env.STRIPE_PRICE_ID_PRO &&
    process.env.STRIPE_WEBHOOK_SECRET
  );
}
