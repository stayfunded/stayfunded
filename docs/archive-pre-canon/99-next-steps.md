⚠️ Archived: Created before the product canon was locked.
Not authoritative. Reference only if explicitly instructed.

# Next Steps (Execution Order)

This file exists so new threads do NOT re-decide product direction.
All items below are already agreed.

---

## CURRENT STATE (DONE)
- App Router + Tailwind stable
- Global layout + nav locked
- Firm hub architecture locked
- Topstep is the reference firm
- Pages exist and render for:
  - Hub
  - Rules
  - Strategy
  - Calculators (placeholder)
  - Bias (placeholder)
  - Checklists

---

## NEXT BUILD PHASE (DO NOT SKIP ORDER)

### 1. Calculators (highest leverage)
Build real interactive calculators on:
- `/firms/[firm]/calculators`

Start with:
- Max risk per trade
- Loss capacity today

Constraints:
- Firm-agnostic math first
- Inputs must be explicit
- Outputs must be conservative (buffered)
- No performance/backtesting features

This is the first place users feel the $149 value.

---

### 2. Paid Gating (lightweight)
After calculators work:
- Add simple “Paid feature” banner to:
  - Calculators
  - Bias
  - Checklists
- No auth/Stripe wiring until UX is proven

---

### 3. News System (read-only → alerts later)
- Build `/news` as a filtered high-impact calendar
- Focus on account-threatening events only
- Email alerts later (not v0 blocker)

---

### 4. AI Lab (non-interactive first)
- Explain:
  - Where to get tick data
  - How to think about pattern discovery
- Provide:
  - Download links (or placeholders)
  - Prompt packs (research-oriented, not trade advice)
- No embedded chat in v0

---

### 5. Bias Console (simple inputs)
- Inputs:
  - Session
  - Risk posture
  - No-trade flags
- Output:
  - “Allowed posture today” (textual, not signals)

---

## EXPLICIT NON-GOALS (V0)
- No signals
- No trade calls
- No strategy optimization
- No journaling
- No backtesting UI
- No ML claims

---

## FINAL NOTE
If a future thread suggests:
- adding indicators for entries
- predicting markets
- coaching workflows
→ STOP and re-read `02-free-vs-paid.md` and `01-prop-firm-hub.md`.
