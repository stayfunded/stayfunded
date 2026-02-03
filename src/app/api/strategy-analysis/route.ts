import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const email = String(formData.get("email") || "");
    const firm = String(formData.get("firm") || "");
    const phase = String(formData.get("phase") || "");
    const intakeRaw = String(formData.get("intake") || "");

    if (!email || !firm || !phase || !intakeRaw) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let intake: any = null;
    try {
      intake = JSON.parse(intakeRaw);
    } catch {
      return NextResponse.json({ error: "Invalid intake JSON" }, { status: 400 });
    }

    const screenshots = formData.getAll("screenshots") as File[];

    // 0 screenshots allowed; if provided, must be 3+
    if (screenshots.length > 0 && screenshots.length < 3) {
      return NextResponse.json(
        { error: "If screenshots are provided, at least 3 are required." },
        { status: 400 }
      );
    }

    const screenshotPaths: string[] = [];

    if (screenshots.length >= 3) {
      for (const file of screenshots) {
        const path = `${crypto.randomUUID()}-${file.name}`;
        const { error } = await supabase.storage
          .from("strategy-analyses")
          .upload(path, file);

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        screenshotPaths.push(path);
      }
    }

    const { error: insertError } = await supabase
      .from("strategy_analyses")
      .insert({
        email,
        firm,
        phase,
        status: "pending",
        intake_json: intake,
        screenshot_paths: screenshotPaths
      });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
