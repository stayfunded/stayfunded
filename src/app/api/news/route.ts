// src/app/api/news/route.ts
import { NextResponse } from "next/server";

type RawItem = {
  title: string;
  link: string;
  source?: string;
  pubDate?: string;
  description?: string;
};

type NewsItem = {
  id: string;
  title: string;
  link: string;
  source?: string;
  publishedAt: string; // ISO
  summary?: string;
  tags: string[];
  impact: "High" | "Medium" | "Low";
  impactScore: number; // 0..100
};

const FEEDS: Array<{ label: string; url: string; tags: string[] }> = [
  {
    label: "Google News — Macro",
    url:
      "https://news.google.com/rss/search?q=(FOMC%20OR%20Fed%20OR%20CPI%20OR%20PCE%20OR%20NFP%20OR%20jobs%20report%20OR%20inflation%20OR%20rate%20hike%20OR%20rate%20cut)%20when:7d&hl=en-US&gl=US&ceid=US:en",
    tags: ["macro", "rates", "inflation"],
  },
  {
    label: "Google News — Equities",
    url:
      "https://news.google.com/rss/search?q=(earnings%20OR%20guidance%20OR%20S%26P%20500%20OR%20Nasdaq%20OR%20Dow%20OR%20stocks)%20when:7d&hl=en-US&gl=US&ceid=US:en",
    tags: ["equities"],
  },
  {
    label: "Google News — Energy",
    url:
      "https://news.google.com/rss/search?q=(crude%20oil%20OR%20WTI%20OR%20Brent%20OR%20OPEC%20OR%20natural%20gas)%20when:7d&hl=en-US&gl=US&ceid=US:en",
    tags: ["energy", "commodities"],
  },
  {
    label: "Google News — FX & Crypto",
    url:
      "https://news.google.com/rss/search?q=(USD%20OR%20dollar%20index%20OR%20EURUSD%20OR%20JPY%20OR%20Bitcoin%20OR%20crypto)%20when:7d&hl=en-US&gl=US&ceid=US:en",
    tags: ["fx", "crypto"],
  },
];

function stripHtml(s: string) {
  return s
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(s: string) {
  // small, safe subset
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractTag(text: string, tag: string) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = text.match(re);
  return m?.[1] ?? null;
}

function extractAllItems(xml: string): string[] {
  // RSS2: <item>...</item>
  const items: string[] = [];
  const re = /<item\b[\s\S]*?<\/item>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) items.push(m[0]);
  if (items.length) return items;

  // Atom: <entry>...</entry>
  const entries: string[] = [];
  const re2 = /<entry\b[\s\S]*?<\/entry>/gi;
  while ((m = re2.exec(xml))) entries.push(m[0]);
  return entries;
}

function parseRssItem(block: string): RawItem | null {
  const title = extractTag(block, "title");
  let link = extractTag(block, "link");

  // Atom <link href="..."/>
  if (!link) {
    const m = block.match(/<link[^>]+href="([^"]+)"[^>]*\/?>/i);
    link = m?.[1] ?? null;
  }

  const pubDate = extractTag(block, "pubDate") ?? extractTag(block, "updated");
  const description =
    extractTag(block, "description") ??
    extractTag(block, "content") ??
    extractTag(block, "summary");

  // RSS source tag has attributes; keep inner text
  const sourceInner = extractTag(block, "source");

  if (!title || !link) return null;

  return {
    title: decodeEntities(stripHtml(title)),
    link: decodeEntities(stripHtml(link)),
    source: sourceInner ? decodeEntities(stripHtml(sourceInner)) : undefined,
    pubDate: pubDate ? decodeEntities(stripHtml(pubDate)) : undefined,
    description: description ? decodeEntities(stripHtml(description)) : undefined,
  };
}

function isoFromDateMaybe(s?: string) {
  if (!s) return new Date().toISOString();
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return new Date().toISOString();
  return d.toISOString();
}

function scoreImpact(text: string): { impact: "High" | "Medium" | "Low"; score: number; tags: string[] } {
  const t = text.toLowerCase();

  const high = [
    "fomc",
    "fed",
    "powell",
    "interest rate",
    "rate hike",
    "rate cut",
    "cpi",
    "pce",
    "nfp",
    "jobs report",
    "inflation",
    "recession",
    "bank failure",
    "credit",
    "default",
    "downgrade",
    "geopolitical",
    "war",
    "opec",
    "crude",
    "treasury",
    "yield spike",
    "circuit breaker",
    "halted",
  ];

  const medium = [
    "earnings",
    "guidance",
    "sec",
    "lawsuit",
    "settlement",
    "tariff",
    "sanction",
    "stimulus",
    "gdp",
    "ppi",
    "retail sales",
    "ism",
    "pmis",
    "housing",
    "jobless claims",
    "consumer confidence",
  ];

  let score = 15;

  for (const k of high) if (t.includes(k)) score += 18;
  for (const k of medium) if (t.includes(k)) score += 10;

  // quick tag inference
  const tags: string[] = [];
  if (/(fomc|fed|powell|rate|yield|treasury)/.test(t)) tags.push("rates");
  if (/(cpi|pce|inflation|ppi)/.test(t)) tags.push("inflation");
  if (/(nfp|jobs|employment|jobless)/.test(t)) tags.push("labor");
  if (/(earnings|guidance)/.test(t)) tags.push("earnings");
  if (/(crude|wti|brent|opec|oil|natural gas)/.test(t)) tags.push("energy");
  if (/(usd|dollar|eur|jpy|fx)/.test(t)) tags.push("fx");
  if (/(bitcoin|crypto)/.test(t)) tags.push("crypto");
  if (/(recession|gdp)/.test(t)) tags.push("growth");

  score = clamp(score, 0, 100);

  const impact =
    score >= 65 ? "High" : score >= 40 ? "Medium" : "Low";

  return { impact, score, tags: Array.from(new Set(tags)) };
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function hashId(s: string) {
  // stable-ish id without dependencies
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `n_${(h >>> 0).toString(16)}`;
}

export async function GET() {
  try {
    const results = await Promise.allSettled(
      FEEDS.map(async (f) => {
        const res = await fetch(f.url, {
          cache: "no-store",
          headers: { "user-agent": "StayFundedNewsTest/1.0" },
        });

        if (!res.ok) throw new Error(`Feed failed: ${f.label} (${res.status})`);
        const xml = await res.text();

        const blocks = extractAllItems(xml);
        const raw: RawItem[] = [];

        for (const b of blocks.slice(0, 40)) {
          const it = parseRssItem(b);
          if (it) raw.push(it);
        }

        return { feed: f, raw };
      })
    );

    const items: NewsItem[] = [];
    const sourcesUsed: string[] = [];

    for (const r of results) {
      if (r.status !== "fulfilled") continue;
      const { feed, raw } = r.value;

      sourcesUsed.push(feed.label);

      for (const it of raw) {
        const publishedAt = isoFromDateMaybe(it.pubDate);
        const basis = `${it.title} ${it.description ?? ""}`;

        const { impact, score, tags } = scoreImpact(basis);

        const mergedTags = Array.from(
          new Set([...(feed.tags ?? []), ...(tags ?? [])])
        );

        const summary = it.description ? it.description.slice(0, 240) : undefined;

        items.push({
          id: hashId(`${it.link}|${it.title}`),
          title: it.title,
          link: it.link,
          source: it.source || feed.label,
          publishedAt,
          summary,
          tags: mergedTags,
          impact,
          impactScore: score,
        });
      }
    }

    // Dedup by id
    const dedup = new Map<string, NewsItem>();
    for (const it of items) {
      if (!dedup.has(it.id)) dedup.set(it.id, it);
    }

    const out = Array.from(dedup.values());

    // Sort newest first on server
    out.sort((a, b) => {
      const at = new Date(a.publishedAt).getTime();
      const bt = new Date(b.publishedAt).getTime();
      return (Number.isFinite(bt) ? bt : 0) - (Number.isFinite(at) ? at : 0);
    });

    return NextResponse.json({
      items: out.slice(0, 180),
      fetchedAt: new Date().toISOString(),
      sources: sourcesUsed,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to load news" },
      { status: 500 }
    );
  }
}
