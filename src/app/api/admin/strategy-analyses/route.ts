import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const email = formData.get("email") as string;
    const firm = formData.get("firm") as string;
    const phase = formData.get("phase") as string;
    const intake = JSON.parse(formData.get("intake") as string);
    const screenshots = formData.getAll("screenshots") as File[];

    if (!email || !firm || !phase || screenshots.length < 3) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const screenshotPaths: string[] = [];

    for (const file of screenshots) {
      const path = `${crypto.randomUUID()}-${file.name}`;

      const { error } = await supabase.storage
        .from("strategy-analyses")
        .upload(path, file);

      if (error) throw error;

      screenshotPaths.push(path);
    }

    const { error: insertError } = await supabase
      .from("strategy_analyses")
      .insert({
        email,
        firm,
        phase,
        intake_json: intake,
        screenshot_paths: screenshotPaths
      });

    if (insertError) throw insertError;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
