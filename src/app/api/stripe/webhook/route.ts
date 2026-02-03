import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function mustEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function stripeClient() {
  return new Stripe(mustEnv("STRIPE_SECRET_KEY"), {
    apiVersion: "2025-09-30.clover" as any,
  });
}

function supabaseAdmin() {
  return createClient(mustEnv("SUPABASE_URL"), mustEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false },
  });
}

async function userIdFromCustomerId(customerId: string): Promise<string | null> {
  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  if (error) return null;
  return (data as any)?.user_id ?? null;
}

async function getUserIdFromStripe(stripe: Stripe, eventObject: any): Promise<string | null> {
  const metaUserId = eventObject?.metadata?.user_id;
  if (metaUserId) return metaUserId;

  const clientRef = eventObject?.client_reference_id;
  if (clientRef) return clientRef;

  const customerId = eventObject?.customer;
  if (customerId && typeof customerId === "string") {
    const c = await stripe.customers.retrieve(customerId);
    const uid = (c as any)?.metadata?.user_id;
    if (uid) return uid;
  }

  return null;
}

async function upsertSubscriptionRow(payload: {
  user_id: string;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  status: string;
  price_id?: string | null;
  current_period_end?: string | null; // ISO
}) {
  const admin = supabaseAdmin();

  await admin.from("subscriptions").upsert(
    {
      user_id: payload.user_id,
      stripe_customer_id: payload.stripe_customer_id ?? null,
      stripe_subscription_id: payload.stripe_subscription_id ?? null,
      status: payload.status,
      price_id: payload.price_id ?? null,
      current_period_end: payload.current_period_end ? new Date(payload.current_period_end).toISOString() : null,
    },
    { onConflict: "user_id" }
  );
}

function isoFromUnixSeconds(sec: any): string | null {
  if (typeof sec !== "number") return null;
  return new Date(sec * 1000).toISOString();
}

export async function POST(req: Request) {
  const stripe = stripeClient();

  let event: Stripe.Event;

  try {
    const sig = req.headers.get("stripe-signature");
    if (!sig) return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });

    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, mustEnv("STRIPE_WEBHOOK_SECRET"));
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err?.message || "unknown"}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const full = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ["line_items.data.price"],
        });

        const userId = await getUserIdFromStripe(stripe, full);
        if (!userId) break;

        const customerId = typeof full.customer === "string" ? full.customer : full.customer?.id;
        const mode = full.mode; // "payment" | "subscription"

        let priceId: string | null = null;
        const li = full.line_items?.data?.[0];
        const p = (li as any)?.price;
        if (p && typeof p === "object" && p.id) priceId = p.id;

        if (mode === "payment") {
          // Lifetime
          await upsertSubscriptionRow({
            user_id: userId,
            stripe_customer_id: customerId ?? null,
            stripe_subscription_id: null,
            status: "lifetime",
            price_id: priceId,
            current_period_end: null,
          });
        } else {
          // Subscription: invoice events will set period end (authoritative)
          await upsertSubscriptionRow({
            user_id: userId,
            stripe_customer_id: customerId ?? null,
            stripe_subscription_id: typeof full.subscription === "string" ? full.subscription : full.subscription?.id ?? null,
            status: "incomplete",
            price_id: priceId,
            current_period_end: null,
          });
        }

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as any;

        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
        if (!customerId) break;

        let userId = await getUserIdFromStripe(stripe, sub);
        if (!userId) userId = await userIdFromCustomerId(customerId);
        if (!userId) break;

        const fresh = await stripe.subscriptions.retrieve(sub.id, {
          expand: ["items.data.price"],
        });
        const freshAny = fresh as any;

        const priceId = freshAny?.items?.data?.[0]?.price?.id ?? null;

        await upsertSubscriptionRow({
          user_id: userId,
          stripe_customer_id: customerId ?? null,
          stripe_subscription_id: freshAny.id ?? sub.id ?? null,
          status: freshAny.status ?? sub.status ?? "unknown",
          price_id: priceId,
          current_period_end: null, // invoice events will fill this in
        });

        break;
      }

      // === AUTHORITATIVE PERIOD END SOURCE ===
      // Stripe increasingly makes billing periods easiest/most reliable via invoices.
      case "invoice.paid":
      case "invoice.payment_succeeded":
      case "invoice.finalized":
      case "invoice.created": {
        const inv = event.data.object as any;

        const customerId = typeof inv.customer === "string" ? inv.customer : inv.customer?.id;
        if (!customerId) break;

        // Map customer -> user
        const c = await stripe.customers.retrieve(customerId);
        let userId = ((c as any)?.metadata?.user_id as string | undefined) ?? undefined;
        if (!userId) {
          const fallback = await userIdFromCustomerId(customerId);
          userId = fallback ?? undefined;
        }
        if (!userId) break;

        // Determine subscription id (if any)
        const subId =
          typeof inv.subscription === "string"
            ? inv.subscription
            : inv.subscription?.id ?? null;

        // Price id if present (from first line item)
        const priceId =
          inv?.lines?.data?.[0]?.price?.id ??
          inv?.lines?.data?.[0]?.plan?.id ??
          null;

        // Period end: invoice.period_end or first line period.end
        const periodEndIso =
          isoFromUnixSeconds(inv?.period_end) ??
          isoFromUnixSeconds(inv?.lines?.data?.[0]?.period?.end) ??
          null;

        // Status: if invoice paid/succeeded, treat subscription as active
        const status =
          event.type === "invoice.created" ? "incomplete" :
          event.type === "invoice.finalized" ? "active" :
          "active";

        await upsertSubscriptionRow({
          user_id: userId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subId,
          status,
          price_id: priceId,
          current_period_end: periodEndIso,
        });

        break;
      }

      case "invoice.payment_failed": {
        const inv = event.data.object as any;

        const customerId = typeof inv.customer === "string" ? inv.customer : inv.customer?.id;
        if (!customerId) break;

        const c = await stripe.customers.retrieve(customerId);
        let userId = ((c as any)?.metadata?.user_id as string | undefined) ?? undefined;
        if (!userId) {
          const fallback = await userIdFromCustomerId(customerId);
          userId = fallback ?? undefined;
        }
        if (!userId) break;

        await upsertSubscriptionRow({
          user_id: userId,
          stripe_customer_id: customerId,
          stripe_subscription_id:
            typeof inv.subscription === "string"
              ? inv.subscription
              : inv.subscription?.id ?? null,
          status: "past_due",
          price_id: null,
          current_period_end: null,
        });

        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Webhook handler error" }, { status: 500 });
  }
}
