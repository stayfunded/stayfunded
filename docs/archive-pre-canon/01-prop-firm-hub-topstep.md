⚠️ Archived: Created before the product canon was locked.
Not authoritative. Reference only if explicitly instructed.

# Topstep — Prop Firm Hub (V0)

## STATUS
- Topstep is the reference implementation for the hub UX + page styling.
- Other firms will reuse the same layout/components; only the content/data changes later.

## LOCKED UX PATTERN (V0)
- Hub page: dark “authoritative” hero band + 2-column card grid + Concrete proof block.
- Subpages (Rules / Strategy / etc.): same dark hero band + two primary CTAs:
  - Back to Hub
  - Cross-link to the next most logical module (e.g., Rules → Calculators, Strategy → Rules)
- Styling: Tailwind utilities only (no inline styles), consistent rounded-3xl/2xl + slate palette.

## ROUTES (MUST MATCH)
- /firms/topstep
- /firms/topstep/rules
- /firms/topstep/strategy
- /firms/topstep/calculators
- /firms/topstep/bias
- /firms/topstep/checklists

# 01a — Prop Firm Hub Instance: Topstep (v0)

This document is a **concrete implementation** of the Prop Firm Hub blueprint for a single firm.
It exists to prove that StayFunded is not theoretical — it produces firm-specific insight that traders cannot easily get elsewhere.

Topstep is used as the reference firm because:
- it is widely known
- it has clear rule friction
- many traders repeatedly fail it for non-obvious reasons

This document defines how Topstep appears inside StayFunded v0.

---

## FirmProfile: Topstep — Trading Combine

### Program Types (v0 scope)
- Trading Combine (Evaluation)
- Funded Account (Express / Funded)

Each program is a separate **FirmProfile** because the rules, incentives, and failure modes differ.

---

## Hub Header (Topstep)

- **Firm:** Topstep
- **Program:** Trading Combine
- **Status:** Evaluation
- **Primary Instrument (user-selected):** NQ / ES / MNQ / MES

Persistent reminder in header:
> “You are trading a trailing drawdown system.”

This alone changes trader behavior.

---

## 1) Rules (Decoded) — Topstep

### Core Rules (Normalized)
- Trailing drawdown (end-of-day or intraday, depending on plan)
- Daily loss limit
- Profit target
- Minimum trading days
- Consistency rule (soft but real)
- News restrictions (during evaluation)

### Plain-Language Translation
- Trailing drawdown moves **against unrealized profits**
- Big green days increase the difficulty of tomorrow
- Late-session losses after a green morning are fatal
- Over-sizing early is punished more than being wrong

### Edge Cases Highlighted
- “I was up on the day and still failed”
- “I hit the profit target but violated drawdown”
- “One bad afternoon erased a good week”

Free:
- high-level summary
Paid:
- full edge-case breakdown + examples

---

## 2) How Topstep Wins (Without Villain Framing)

This section explains *why* the rules exist.

### Risk System Reality
- Topstep monetizes evaluation fees, not trader PnL
- The trailing drawdown ensures risk stays capped during upside
- Volatility events accelerate failure for aggressive sizing
- Consistency rules discourage one-shot gambling

### Where Traders Get Surprised
- “House money” illusion after early profits
- Trying to “finish” the eval too fast
- Trading news because “I’m already green”

Framing:
> “These rules are not unfair — they’re optimized for risk containment. Once you see that, you can trade accordingly.”

---

## 3) Strategy Fit — Topstep

### Strategy Styles That Survive
- Moderate win-rate, moderate RR
- Controlled trend participation
- Smaller size, more days
- Early-session focus, reduced afternoon exposure

### Strategy Styles That Struggle
- High variance scalping
- Late-day revenge trading
- Large size after green mornings
- News gambling

### Key Insight
Topstep rewards **stability over speed**.
Passing fast increases failure probability.

Free:
- one-paragraph snapshot
Paid:
- full strategy fit table + behavioral guidance

---

## 4) Calculators — Topstep

Prefilled with Topstep rules.

v0 calculators:
- Max contracts allowed **today**
- “If I lose X trades, I fail”
- Risk per trade vs trailing drawdown impact
- “What hurts more: one big loss or three small ones?”

The calculator output always ties back to:
> “This is how traders usually fail Topstep.”

---

## 5) Daily Checklists — Topstep

### Pre-Market
- Is trailing drawdown close?
- Is there high-impact news?
- Is today a “protect gains” day?

### During Session
- Max loss for the day (visible)
- Size guardrail reminder
- “If you’re green, what’s the rule risk?”

### End-of-Day
- Did trailing drawdown tighten?
- What changed for tomorrow?

Free:
- generic checklist
Paid:
- Topstep-specific checklist + printable

---

## 6) Session Bias Console — Topstep

This is **contextual**, not predictive.

Topstep bias console emphasizes:
- volatility awareness
- drawdown sensitivity
- session selection

Example outputs:
- “Given your drawdown position, today favors defense.”
- “If wrong today, trailing drawdown breaks first.”
- “News + size = primary risk for this firm.”

No trade calls.
No direction arrows.

---

## 7) News Risk — Topstep

- High-impact calendar filtered for futures
- Visual warning when news overlaps peak trading window
- “Tomorrow risk” email (paid)

---

## Why This Feels Valuable

A Topstep trader using StayFunded:
- understands *why* they keep failing
- stops guessing how much risk is allowed
- trades with the rules, not against them
- feels like they finally “see the game board”

This is the StayFunded promise in action.
