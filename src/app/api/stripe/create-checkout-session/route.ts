import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function mustEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

function stripeClient() {
  return new Stripe(mustEnv("STRIPE_SECRET_KEY"), {
    apiVersion: "2025-09-30.clover" as any,
  });
}

function supabaseAdmin() {
  return createClient(
    mustEnv("SUPABASE_URL"),
    mustEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false } }
  );
}

async function requireUserId(req: Request): Promise<string> {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) throw new Error("Missing Authorization Bearer token");

  const admin = supabaseAdmin();
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data?.user?.id) throw new Error("Invalid session");
  return data.user.id;
}

async function getOrCreateCustomer(userId: string): Promise<string> {
  const admin = supabaseAdmin();
  const stripe = stripeClient();

  const { data: existing } = await admin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing?.stripe_customer_id) return existing.stripe_customer_id;

  const customer = await stripe.customers.create({
    metadata: { app: "stayfunded", user_id: userId },
  });

  await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customer.id,
      status: "inactive",
    },
    { onConflict: "user_id" }
  );

  return customer.id;
}

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      hint: "POST only. Call from the app with Authorization: Bearer <supabase access token>.",
    },
    { status: 200 }
  );
}

export async function POST(req: Request) {
  try {
    const userId = await requireUserId(req);
    const { plan } = (await req.json().catch(() => ({}))) as {
      plan?: "monthly" | "lifetime";
    };

    if (plan !== "monthly" && plan !== "lifetime") {
      throw new Error("Invalid plan");
    }

    const isTestKey = mustEnv("STRIPE_SECRET_KEY").startsWith("sk_test_");

    const monthlyPrice = isTestKey
      ? mustEnv("STRIPE_PRICE_TEST_FOUNDER_MONTHLY")
      : mustEnv("STRIPE_PRICE_FOUNDER_MONTHLY");

    const lifetimePrice = isTestKey
      ? mustEnv("LIFETIME_TEST_PRICE_ID")
      : mustEnv("STRIPE_PRICE_FOUNDER_LIFETIME");

    const isLifetime = plan === "lifetime";
    const priceId = isLifetime ? lifetimePrice : monthlyPrice;

    const stripe = stripeClient();
    const customerId = await getOrCreateCustomer(userId);

    const session = await stripe.checkout.sessions.create({
      mode: isLifetime ? "payment" : "subscription",
      customer: customerId,
      client_reference_id: userId,
      success_url: `${siteUrl()}/account?stripe=success`,
      cancel_url: `${siteUrl()}/account?stripe=cancel`,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: false,
      metadata: {
        app: "stayfunded",
        user_id: userId,
        plan: isLifetime ? "founder_lifetime" : "founder_monthly",
      },
      subscription_data: isLifetime
        ? undefined
        : {
            metadata: { app: "stayfunded", user_id: userId },
          },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to create checkout session" },
      { status: 400 }
    );
  }
}
