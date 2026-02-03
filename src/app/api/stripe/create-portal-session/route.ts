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
  return createClient(mustEnv("SUPABASE_URL"), mustEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false },
  });
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

export async function POST(req: Request) {
  try {
    const userId = await requireUserId(req);
    const admin = supabaseAdmin();

    const { data: sub } = await admin
      .from("subscriptions")
      .select("stripe_customer_id,status")
      .eq("user_id", userId)
      .maybeSingle();

    if (!sub?.stripe_customer_id) throw new Error("No Stripe customer found for this user.");
    if (sub.status === "lifetime") throw new Error("Lifetime plan has no billing portal.");

    const stripe = stripeClient();
    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${siteUrl()}/account`,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to create portal session" },
      { status: 400 }
    );
  }
}
