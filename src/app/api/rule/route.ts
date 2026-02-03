// src/app/api/rule/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

type SectionKey =
  | "definition"
  | "mechanics"
  | "why"
  | "misbeliefs"
  | "hurt"
  | "phaseInteraction"
  | "adaptationLocked"
  | "references";

type RuleContent = {
  title: string;
  slug: string;
  category?: string;

  definition: string[];
  mechanics: string[];
  why: string[];
  misbeliefs: string[];
  hurt: string[];
  phaseInteraction: string[];
  adaptationLocked: string[];
  references: string[];
};

const HEADERS: Record<string, SectionKey> = {
  Definition: "definition",
  "Mechanics & math": "mechanics",
  "Why firms use it": "why",
  "Common trader misbeliefs": "misbeliefs",
  "How traders get hurt": "hurt",
  "Phase interaction": "phaseInteraction",
  "How to trade against it (locked)": "adaptationLocked",
  References: "references",
};

function safeSlug(v: string) {
  return /^[a-z0-9-]+$/.test(v);
}

function readFileSafe(p: string): string | null {
  try {
    if (!fs.existsSync(p)) return null;
    return fs.readFileSync(p, "utf8");
  } catch {
    return null;
  }
}

function parseRuleMarkdown(md: string, fallbackSlug: string): RuleContent {
  const lines = md.split(/\r?\n/);

  let title = "";
  let slug = fallbackSlug;
  let category: string | undefined;

  const out: Omit<RuleContent, "title" | "slug" | "category"> = {
    definition: [],
    mechanics: [],
    why: [],
    misbeliefs: [],
    hurt: [],
    phaseInteraction: [],
    adaptationLocked: [],
    references: [],
  };

  let active: SectionKey | null = null;

  for (const raw of lines) {
    const line = raw.trim();

    if (line.startsWith("# ")) {
      title = line.replace(/^#\s+/, "").trim();
      continue;
    }

    // HTML comment meta: <!-- key: value -->
    if (line.startsWith("<!--") && line.endsWith("-->")) {
      const inner = line.replace("<!--", "").replace("-->", "").trim();
      const idx = inner.indexOf(":");
      if (idx > -1) {
        const k = inner.slice(0, idx).trim();
        const v = inner.slice(idx + 1).trim();
        if (k === "ruleSlug") slug = v;
        if (k === "category") category = v;
      }
      continue;
    }

    if (line.startsWith("## ")) {
      const h = line.replace(/^##\s+/, "").trim();
      active = HEADERS[h] ?? null;
      continue;
    }

    if (!active) continue;

    if (line.startsWith("- ")) {
      out[active].push(line.replace(/^- /, "").trim());
    }
  }

  return {
    title: title || slug,
    slug,
    category,
    ...out,
  };
}

function mergeRule(base: RuleContent, override: RuleContent): RuleContent {
  const pick = (k: SectionKey) => (override[k]?.length ? override[k] : base[k]);

  return {
    title: override.title || base.title,
    slug: base.slug,
    category: override.category || base.category,
    definition: pick("definition"),
    mechanics: pick("mechanics"),
    why: pick("why"),
    misbeliefs: pick("misbeliefs"),
    hurt: pick("hurt"),
    phaseInteraction: pick("phaseInteraction"),
    adaptationLocked: pick("adaptationLocked"),
    references: pick("references"),
  };
}

function resolveRulesDirs() {
  const cwd = process.cwd();

  // Mirror /api/rules behavior so index + detail cannot drift.
  const candidates = [
    path.join(cwd, "docs", "rules"),
    path.join(cwd, "..", "docs", "rules"),
    path.join(cwd, "src", "docs", "rules"),
    path.join(cwd, "..", "src", "docs", "rules"),
  ];

  for (const root of candidates) {
    const typesDir = path.join(root, "types");
    const firmsDir = path.join(root, "firms");
    if (fs.existsSync(typesDir)) {
      return { root, typesDir, firmsDir, tried: candidates };
    }
  }

  return {
    root: null as string | null,
    typesDir: null as string | null,
    firmsDir: null as string | null,
    tried: candidates,
  };
}

// GET /api/rule?slug=trailing-drawdown&firm=topstep&phase=evaluation
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = (searchParams.get("slug") || "").trim().toLowerCase();
  const firm = (searchParams.get("firm") || "").trim().toLowerCase();
  const phase = (searchParams.get("phase") || "").trim().toLowerCase();

  if (!slug || !safeSlug(slug)) {
    return NextResponse.json({ error: "Missing/invalid slug" }, { status: 400 });
  }
  if (firm && !safeSlug(firm)) {
    return NextResponse.json({ error: "Invalid firm" }, { status: 400 });
  }
  if (phase && !safeSlug(phase)) {
    return NextResponse.json({ error: "Invalid phase" }, { status: 400 });
  }

  const resolved = resolveRulesDirs();

  if (!resolved.typesDir) {
    return NextResponse.json(
      {
        error: "Rules directory not found",
        debug:
          process.env.NODE_ENV !== "production"
            ? { cwd: process.cwd(), tried: resolved.tried }
            : undefined,
      },
      { status: 404 }
    );
  }

  const basePath = path.join(resolved.typesDir, `${slug}.md`);
  const baseMd = readFileSafe(basePath);

  if (!baseMd) {
    return NextResponse.json(
      {
        error: "Rule not found",
        debug:
          process.env.NODE_ENV !== "production" ? { basePath } : undefined,
      },
      { status: 404 }
    );
  }

  const base = parseRuleMarkdown(baseMd, slug);

  if (!firm) {
    return NextResponse.json(base, { status: 200 });
  }

  // Prefer firm+phase override, then firm override.
  const overrideCandidates = [
    ...(phase && resolved.firmsDir
      ? [path.join(resolved.firmsDir, firm, phase, `${slug}.md`)]
      : []),
    ...(resolved.firmsDir ? [path.join(resolved.firmsDir, firm, `${slug}.md`)] : []),
  ];

  let overrideMd: string | null = null;
  let usedOverridePath: string | null = null;

  for (const p of overrideCandidates) {
    const md = readFileSafe(p);
    if (md) {
      overrideMd = md;
      usedOverridePath = p;
      break;
    }
  }

  if (!overrideMd) {
    return NextResponse.json(base, { status: 200 });
  }

  const override = parseRuleMarkdown(overrideMd, slug);
  const merged = mergeRule(base, override);

  return NextResponse.json(
    process.env.NODE_ENV !== "production"
      ? { ...merged, _debug: { usedOverridePath } }
      : merged,
    { status: 200 }
  );
}
