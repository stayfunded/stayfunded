import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const analysisText = body?.analysisText;
  if (!analysisText || typeof analysisText !== "string") {
    return NextResponse.json({ error: "Missing analysisText" }, { status: 400 });
  }

  const { error } = await supabase
    .from("strategy_analyses")
    .update({
      analysis_text: analysisText,
      status: "sent",
      sent_at: new Date().toISOString()
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
