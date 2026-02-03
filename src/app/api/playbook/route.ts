import { NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";

type FirmPhase =
  | "discovery"
  | "evaluation"
  | "stabilization"
  | "payout"
  | "maintenance";

type PlaybookSectionKey =
  | "designed"
  | "firmEdge"
  | "damagingRules"
  | "traderFailure"
  | "survivors"
  | "learning"
  | "misdirection"
  | "exit";

type PlaybookContent = {
  title: string;
  sections: Record<PlaybookSectionKey, string[]>;
};

function isFirmPhase(v: string): v is FirmPhase {
  return (
    v === "discovery" ||
    v === "evaluation" ||
    v === "stabilization" ||
    v === "payout" ||
    v === "maintenance"
  );
}

function safeSegment(v: string) {
  return /^[a-z0-9-]+$/.test(v);
}

function stripBullet(l: string) {
  return l.trim().replace(/^[-*]\s+/, "").trim();
}

function toLines(block: string): string[] {
  return block
    .split("\n")
    .map((l) => stripBullet(l))
    .filter(Boolean);
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** returns [] if not found */
function findSection(md: string, headingStartsWithAny: string[]): string[] {
  for (const h of headingStartsWithAny) {
    // match "## Heading..." at start OR after newline
    const r = new RegExp(
      `(?:^|\\n)##\\s+${escapeRegExp(h)}[^\\n]*\\n([\\s\\S]*?)(?=\\n##\\s+|$)`,
      "i"
    );
    const m = md.match(r);
    if (!m) continue;
    const body = (m[1] ?? "").trim();
    return body ? toLines(body) : [];
  }
  return [];
}

function firstNonEmpty(...arrs: string[][]): string[] {
  for (const a of arrs) if (a && a.length) return a;
  return [];
}

function parse(md: string): PlaybookContent | null {
  const title = md.match(/^#\s+(.+)$/m)?.[1]?.trim();
  if (!title) return null;

  // v0 contract headings
  const v0 = {
    phaseObjective: ["Phase objective"],
    primaryRisk: ["Primary risk"],
    failureModes: ["Common failure modes"],
    posture: ["Professional posture", "Professional posture / behavior"],
    ignore: ["What to ignore"],
    exit: ["Phase exit", "Phase exit + what changes next"],
  };

  // hidden-manual headings (your current writing)
  const hm = {
    designed: [
      "What This Phase Is Designed to Do",
      "What this phase is designed to do",
    ],
    firmEdge: [
      "How the Firm Actually Wins in This Phase",
      "How the firm actually wins in this phase",
    ],
    damagingRules: [
      "The Rules That Do the Real Damage",
      "Rules doing the real damage in this phase",
    ],
    traderFailure: [
      "How Traders Help the Firm Without Realizing It",
      "How traders help the firm without realizing it",
    ],
    survivors: ["What Survives This Phase", "What survives this phase"],
    learning: [
      "Where to Learn to Do This Correctly",
      "Where to learn to do this correctly",
    ],
    misdirection: [
      "What the Firm Wants You to Focus On (and Why You Shouldn't)",
      "What the firm wants you to focus on (and why you shouldn't)",
      "Misdirection",
    ],
    exit: [
      "How This Phase Ends—and Why the Game Changes After",
      "How this phase ends—and why the game changes after",
    ],
  };

  const designed = firstNonEmpty(
    findSection(md, hm.designed),
    findSection(md, v0.phaseObjective)
  );

  const firmEdge = firstNonEmpty(
    findSection(md, hm.firmEdge),
    findSection(md, v0.primaryRisk)
  );

  const damagingRules = firstNonEmpty(findSection(md, hm.damagingRules));

  const traderFailure = firstNonEmpty(
    findSection(md, hm.traderFailure),
    findSection(md, v0.failureModes)
  );

  const survivors = firstNonEmpty(
    findSection(md, hm.survivors),
    findSection(md, v0.posture)
  );

  const learning = firstNonEmpty(findSection(md, hm.learning));

  const misdirection = firstNonEmpty(
    findSection(md, hm.misdirection),
    findSection(md, v0.ignore)
  );

  const exit = firstNonEmpty(
    findSection(md, hm.exit),
    findSection(md, v0.exit)
  );

  return {
    title,
    sections: {
      designed,
      firmEdge,
      damagingRules,
      traderFailure,
      survivors,
      learning,
      misdirection,
      exit,
    },
  };
}

async function readFirstExisting(pathsToTry: string[]) {
  for (const p of pathsToTry) {
    try {
      const raw = await readFile(p, "utf8");
      return { raw, foundAt: p };
    } catch {}
  }
  return { raw: null as string | null, foundAt: null as string | null };
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const firm = (url.searchParams.get("firm") || "").toLowerCase();
  const phase = (url.searchParams.get("phase") || "").toLowerCase();

  if (!firm || !phase) {
    return NextResponse.json({ error: "Missing firm or phase" }, { status: 400 });
  }

  if (!safeSegment(firm) || !isFirmPhase(phase)) {
    return NextResponse.json({ error: "Invalid firm or phase" }, { status: 400 });
  }

  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, "docs", "playbooks", firm, `${phase}.md`),
    path.join(cwd, "..", "docs", "playbooks", firm, `${phase}.md`),
    path.join(cwd, "src", "docs", "playbooks", firm, `${phase}.md`),
    path.join(cwd, "..", "src", "docs", "playbooks", firm, `${phase}.md`),
  ];

  const { raw, foundAt } = await readFirstExisting(candidates);

  if (!raw) {
    return NextResponse.json(
      {
        error: "Playbook not found for firm/phase",
        debug:
          process.env.NODE_ENV !== "production"
            ? { cwd, tried: candidates }
            : undefined,
      },
      { status: 404 }
    );
  }

  const parsed = parse(raw);
  if (!parsed) {
    return NextResponse.json(
      {
        error: "Invalid playbook markdown format",
        debug: process.env.NODE_ENV !== "production" ? { foundAt } : undefined,
      },
      { status: 422 }
    );
  }

  return NextResponse.json(parsed);
}
