import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/billing/stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function activatePro(stripeCustomerId: string, subscriptionId: string) {
  const supabase = await createSupabaseServerClient();
  await supabase
    .from("profiles")
    .update({
      plan: "pro",
      plan_expires_at: null, // null = active indefinitely until subscription.deleted fires
      stripe_subscription_id: subscriptionId
    })
    .eq("stripe_customer_id", stripeCustomerId);
}

async function deactivatePro(stripeCustomerId: string) {
  const supabase = await createSupabaseServerClient();
  await supabase
    .from("profiles")
    .update({
      plan: "free",
      plan_expires_at: null,
      stripe_subscription_id: null
    })
    .eq("stripe_customer_id", stripeCustomerId);
}

function extractCustomerStr(
  customer: Stripe.Subscription["customer"] | Stripe.Invoice["customer"]
): string | null {
  if (!customer) return null;
  if (typeof customer === "string") return customer;
  if ("deleted" in customer) return customer.id;
  return customer.id;
}

export async function POST(req: NextRequest) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 }
    );
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.customer && session.subscription) {
          const subscriptionId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id;
          const customerId = extractCustomerStr(session.customer);
          if (customerId) {
            await activatePro(customerId, subscriptionId);
          }
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        // In newer Stripe API the subscription reference may be in parent or a direct field
        // Use type casting since field availability varies by API version
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoiceAny = invoice as any;
        const subscriptionId: string | null =
          typeof invoiceAny.subscription === "string"
            ? invoiceAny.subscription
            : typeof invoiceAny.subscription_details?.subscription === "string"
              ? invoiceAny.subscription_details.subscription
              : invoiceAny.subscription?.id ?? null;

        const customerId = extractCustomerStr(invoice.customer);
        if (subscriptionId && customerId) {
          await activatePro(customerId, subscriptionId);
        }
        break;
      }

      case "customer.subscription.deleted":
      case "customer.subscription.paused": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = extractCustomerStr(subscription.customer);
        if (customerId) {
          await deactivatePro(customerId);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[stripe webhook] Error processing event:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
