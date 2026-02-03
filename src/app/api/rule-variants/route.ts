// src/app/api/rule-variants/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readdir, readFile, stat } from "fs/promises";

type Variant = {
  firm: string;
  phase?: string;
  title?: string;
};

function safeSlug(v: string) {
  return /^[a-z0-9-]+$/.test(v);
}

function parseFirstHeading(md: string): string | null {
  const m = md.match(/^#\s+(.+)$/m);
  return m?.[1]?.trim() ?? null;
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await walk(p)));
    } else if (e.isFile() && e.name.toLowerCase().endsWith(".md")) {
      out.push(p);
    }
  }
  return out;
}

// GET /api/rule-variants?slug=trailing-drawdown
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = (searchParams.get("slug") || "").trim().toLowerCase();

  if (!slug || !safeSlug(slug)) {
    return NextResponse.json({ error: "Missing/invalid slug" }, { status: 400 });
  }

  const ROOT = process.cwd();
  const firmsRoot = path.join(ROOT, "docs", "rules", "firms");

  try {
    const s = await stat(firmsRoot).catch(() => null);
    if (!s || !s.isDirectory()) {
      return NextResponse.json({ items: [] as Variant[] }, { status: 200 });
    }

    const files = await walk(firmsRoot);
    const matches = files.filter((p) => p.toLowerCase().endsWith(`${slug}.md`));

    const items: Variant[] = [];

    for (const fullPath of matches) {
      // firms/{firm}/{slug}.md  OR  firms/{firm}/{phase}/{slug}.md
      const rel = path.relative(firmsRoot, fullPath);
      const parts = rel.split(path.sep).filter(Boolean);

      const firm = (parts[0] || "").trim().toLowerCase();
      const maybePhase = parts.length >= 3 ? parts[1] : undefined;

      if (!firm || !safeSlug(firm)) continue;

      const raw = await readFile(fullPath, "utf8");
      const title = parseFirstHeading(raw) ?? undefined;

      const phase = maybePhase ? maybePhase.trim().toLowerCase() : undefined;

      items.push({
        firm,
        ...(phase ? { phase } : {}),
        ...(title ? { title } : {}),
      });
    }

    // stable sort: firm then phase
    items.sort((a, b) => {
      if (a.firm !== b.firm) return a.firm.localeCompare(b.firm);
      return (a.phase ?? "").localeCompare(b.phase ?? "");
    });

    return NextResponse.json({ items }, { status: 200 });
  } catch {
    return NextResponse.json({ items: [] as Variant[] }, { status: 200 });
  }
}
