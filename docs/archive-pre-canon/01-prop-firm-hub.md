⚠️ Archived: Created before the product canon was locked.
Not authoritative. Reference only if explicitly instructed.

# 01 — Prop Firm Hub (Core Product Blueprint)

StayFunded is not a collection of random tools.
It is a **firm-centered operating layer** that adapts the product experience to the prop firm a trader is currently trading.

The Prop Firm Hub is the organizing principle that makes everything feel cohesive.

## V0 STANDARD (LOCKED)
All firm hubs use the same UX + styling as Topstep.

### Hub page (per-firm)
- Route: `/firms/[firm]`
- Dark “authoritative” hero band
- 2-column card grid linking to:
  - Rules, Strategy, Calculators, Bias, Checklists
- “Concrete proof” block at bottom (outcomes-based bullets)

### Subpages (per-firm)
- Routes:
  - `/firms/[firm]/rules`
  - `/firms/[firm]/strategy`
  - `/firms/[firm]/calculators`
  - `/firms/[firm]/bias`
  - `/firms/[firm]/checklists`
- Each subpage starts with the same dark hero band:
  - Left: section label + headline + short description
  - Right: two CTAs
    - Back to Hub
    - Cross-link to the next logical module

### Styling constraints
- Tailwind utilities only (no inline styles)
- Shared palette: slate/white
- Shared radius + elevation:
  - hero: `rounded-3xl`
  - cards: `rounded-2xl`
  - light shadow + subtle border


---

## Core Idea

**User selects a prop firm → StayFunded becomes a firm-specific toolkit.**

That one choice drives:
- rule breakdown (normalized + explained)
- “how the firm wins” (friction points + traps)
- strategy fit guidance (what styles survive in this firm)
- calculators prefilled with that firm’s limits
- checklists tuned to that firm’s rules
- “session bias console” context overlay
- upgrade prompts tied to firm value

Anything that is not firm-specific (AI Lab, News) lives as global nav items.

---

## The One Core Object (Cohesion Mechanism)

In the database, everything hangs off one object:

### `FirmProfile`
Represents a prop firm + a specific account type/program.

A firm is not one rule set. Firms have:
- eval vs funded
- different account sizes
- different trailing drawdown modes
- different consistency rules
- different allowed instruments / trading hours
- different scaling requirements

So the Hub is driven by **FirmProfile**, not “Firm”.

**User always has an “Active FirmProfile”.**
That becomes the lens for the entire app.

---

## v0 User Flow (Happy Path)

1) User lands on marketing site
2) Clicks “Choose your prop firm”
3) Selects Firm + Account Type (FirmProfile)
4) Enters a few optional inputs (account size, platform, instrument)
5) Sees the Hub dashboard for that FirmProfile
6) Uses Hub modules daily
7) Upgrades when they want:
   - full rules + edge cases
   - calculators + simulators
   - strategy fit playbook
   - news alert emails
   - bias console + TV indicator access
   - AI lab downloads/prompt packs

---

## Hub Layout (v0)

### Hub Header (always visible)
- Firm name + logo
- Program / account type selector
- Active status label: “Evaluation” / “Funded”
- Quick links: Rules · Strategy Fit · Calculators · Checklists

### Hub Modules (core tiles)
1) **Rules (Decoded)**
2) **How They Win**
3) **Strategy Fit (for this firm)**
4) **Calculators**
5) **Daily Checklists**
6) **Session Bias Console** (value-focused, not prescriptive)
7) **News Risk (for your instrument)** (global, but shows firm-safe framing)

---

## Module Definitions (v0)

### 1) Rules (Decoded)
Goal: trader understands rules fast, without reading a PDF.

Includes:
- normalized rule table (daily loss, trailing drawdown, consistency, scaling, etc.)
- plain-language explanation
- edge cases
- “what actually kills accounts” callouts (framed as “where traders get surprised”)

Free preview:
- top 3 rules summary
Paid:
- full rule set + edge cases + examples

---

### 2) How They Win
Goal: trader feels empowered, not fearful.

This is not “prop firms are evil”.
This is “prop firms run risk systems; here’s how those systems extract mistakes.”

Includes:
- rule friction map (what most traders underestimate)
- volatility traps (news, chop, revenge)
- drawdown mechanics (why trailing dd kills)
- consistency constraints (how over-sizing ends runs)

Free preview:
- 3 bullets
Paid:
- full breakdown + firm-specific nuance

---

### 3) Strategy Fit (for this firm)
Goal: trader gets **actionable strategic guidance** without being told what to do.

This is the key “insider value” section.

Includes:
- which strategy styles survive here (and why)
  - trend-following vs mean reversion
  - scalping vs swing
  - high winrate/low RR vs low winrate/high RR
- what to avoid given this firm’s constraints
- “best path to pass” framing (behavioral + risk posture)

Important: no “exact entry system” is provided in v0.
We provide **strategic constraints + fit guidance**.

Free preview:
- one “strategy fit snapshot”
Paid:
- full playbook + examples + common adaptations

---

### 4) Calculators
Goal: rules become numbers the trader can act on.

Calculators are **prefilled from the active FirmProfile**.

v0 calculators:
- Max risk per trade (given drawdown + daily loss)
- “How many losses can I take today?”
- Position sizing guardrails (contracts / size caps)
- Scenario sim: “If X happens, what breaks first?”

Free preview:
- 1 calculator
Paid:
- all calculators + scenario sim

---

### 5) Daily Checklists
Goal: traders use StayFunded daily.

Checklists are firm-aware:
- “Am I allowed to trade today?” logic
- daily risk state check
- end-of-day survivability check

Free preview:
- generic checklist
Paid:
- firm-specific checklist + downloadable print view

---

### 6) Session Bias Console (v0)
Goal: be “sexy” and valuable without being blamed for calls.

The console does NOT say:
- “Today is a trend day”
- “Go long now”

Instead it provides:
- a structured **context lens** the trader can tune
- a “bias confidence meter” based on user-selected toggles
- a way to document their own read (optional inputs)

v0 outputs:
- Session posture suggestions (defensive / normal / aggressive)
- “Conditions that usually cause failure today” (news + chop + range)
- “If you’re wrong, this is what breaks first” (risk framing)

This can later connect to TradingView indicators.
v0 can exist as a UI console.

Paid:
- full toggle set + presets per firm + save settings

---

### 7) News Risk
Global section, but framed as “account-threatening volatility”.

v0 includes:
- calendar view (ForexFactory-style)
- filter by impact + instrument (NQ/ES/etc.)
- “tomorrow alert” email (daily digest option)

Free:
- calendar view
Paid:
- email alerts + instrument filters + “tomorrow” warnings

---

## What Users Can Save (v0-lite)

We keep this minimal but valuable.

Saved per user:
- active FirmProfile (selected firm/program)
- instrument preference (NQ/ES/etc.)
- calculator inputs defaults (account size, max risk comfort)
- bias console toggles + saved preset name (1 preset free, more paid)

We do NOT store:
- trade logs
- PnL imports
- journal entries

---

## Navigation (Global)

Top nav:
- Prop Firms (Hub selection + firm directory)
- AI Lab (downloads + prompts)
- News (calendar + alerts)
- Pricing

Within a Firm Hub:
- Rules
- Strategy Fit
- Calculators
- Checklists
- Bias Console

---

## Cohesion Summary

StayFunded is cohesive because:
- the whole app is anchored on **Active FirmProfile**
- all “meat” is experienced through that firm lens
- global tools (News, AI Lab) exist, but don’t fragment the product

Prop Firm Hub is the spine. Everything else attaches to it.

## LOCKED: Firm Hub Architecture (Routing + Linking)

- Route pattern (Next.js App Router):
  - `/firms/[firm]` (hub)
  - `/firms/[firm]/rules`
  - `/firms/[firm]/strategy`
  - `/firms/[firm]/calculators`
  - `/firms/[firm]/bias`
  - `/firms/[firm]/checklists`

- `[firm]` is the authoritative dynamic segment.
  - All internal links MUST include the `[firm]` param.
  - Any `/firms/undefined/...` path is a bug (missing param in link construction).

- Firm content is firm-agnostic for now.
  - Firm-specific rules/constants will be injected later via data, not new routes.

## Routing (LOCKED)
- Firm hubs use the App Router dynamic segment: `src/app/firms/[firm]/...`
- All hub links must use the active slug: `/firms/${firm}/<section>`
- Do not create or use any `[firms]` segment (plural). Only `[firm]`.
- Layout files must never assume params exist; guard `params?.firm`.
