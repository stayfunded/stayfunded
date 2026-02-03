import { NextResponse } from "next/server";
import path from "path";
import { readdir, readFile } from "fs/promises";

type RuleIndexItem = {
  title: string;
  slug: string;
  category?: string;
};

function safeSlug(v: string) {
  return /^[a-z0-9-]+$/.test(v);
}

function parseFirstHeading(md: string): string | null {
  const m = md.match(/^#\s+(.+)$/m);
  return m?.[1]?.trim() ?? null;
}

function parseMeta(md: string, key: string): string | null {
  // matches: <!-- key: value -->
  const r = new RegExp(`<!--\\s*${key}\\s*:\\s*([^>]+?)\\s*-->`, "i");
  const m = md.match(r);
  return m?.[1]?.trim() ?? null;
}

function inferSlugFromFilename(filename: string) {
  return filename.replace(/\.md$/i, "").trim().toLowerCase();
}

async function readDirSafe(dirPath: string) {
  try {
    return await readdir(dirPath, { withFileTypes: true });
  } catch {
    return null;
  }
}

export async function GET() {
  const cwd = process.cwd();

  // Try a few common locations (same spirit as your playbook API)
  const candidates = [
    path.join(cwd, "docs", "rules", "types"),
    path.join(cwd, "..", "docs", "rules", "types"),
    path.join(cwd, "src", "docs", "rules", "types"),
    path.join(cwd, "..", "src", "docs", "rules", "types"),
  ];

  let foundDir: string | null = null;
  let entries = null as Awaited<ReturnType<typeof readDirSafe>>;

  for (const dir of candidates) {
    const e = await readDirSafe(dir);
    if (e) {
      foundDir = dir;
      entries = e;
      break;
    }
  }

  if (!foundDir || !entries) {
    return NextResponse.json(
      {
        error: "Rules directory not found",
        debug:
          process.env.NODE_ENV !== "production"
            ? { cwd, tried: candidates }
            : undefined,
      },
      { status: 404 }
    );
  }

  const files = entries
    .filter((d) => d.isFile() && d.name.toLowerCase().endsWith(".md"))
    .map((d) => d.name);

  const items: RuleIndexItem[] = [];

  for (const filename of files) {
    const fullPath = path.join(foundDir, filename);
    const raw = await readFile(fullPath, "utf8");

    const title = parseFirstHeading(raw) ?? inferSlugFromFilename(filename);

    // optional meta
    const ruleSlug = parseMeta(raw, "ruleSlug") ?? inferSlugFromFilename(filename);
    const category = parseMeta(raw, "category") ?? undefined;

    const slug = ruleSlug.trim().toLowerCase();
    if (!safeSlug(slug)) continue;

    items.push({ title, slug, category });
  }

  // stable sort: category then title
  items.sort((a, b) => {
    const ac = (a.category ?? "uncategorized").toLowerCase();
    const bc = (b.category ?? "uncategorized").toLowerCase();
    if (ac !== bc) return ac.localeCompare(bc);
    return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
  });

  return NextResponse.json({ items });
}
