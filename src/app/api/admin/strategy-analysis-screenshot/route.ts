import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  const { data, error } = await supabase.storage
    .from("strategy-analyses")
    .createSignedUrl(path, 60 * 10); // 10 minutes

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: "Unable to sign URL" }, { status: 500 });
  }

  return NextResponse.redirect(data.signedUrl);
}
