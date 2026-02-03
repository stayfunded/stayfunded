# StayFunded Routes (v1)

Source of truth for product intent:
- `/docs/core product model - Playbooks.md` (authoritative)
- `stayfunded-build-blueprint.md` (structural reference only)

---

## Global Routing Rules (Non-Negotiable)

All routes assume an explicit **account state**:

- Firm
- Current phase
- Active Path
- Unlocked Playbooks

Routes **never** imply:
- progress
- completion
- education
- learning flows
- checklists

Routes reflect **account state and phase-gated access only**.

Playbooks are first-class and authoritative.
Playbook language, framing, and intent must never be duplicated outside the canonical Playbooks document.

---

## Public Routes (No Auth)

These routes are discovery, framing, and trust-building only.

- `/` — Home
- `/firms` — Firms hub (discovery index)
- `/firms/[firm]` — Firm overview (high-level structure + phases)
- `/firms/[firm]/rules` — Public rules overview
- `/firms/[firm]/fine-print` — Fine print preview (limited)
- `/pricing` — Pricing
- `/about` — About
- `/contact` — Contact
- `/affiliate` — Affiliate program landing
- `/terms` — Terms of Service
- `/privacy` — Privacy Policy
- `/disclaimer` — Risk Disclaimer

---

## Authenticated Routes (Free + Pro)

These routes establish and reflect **account state**.
They are not courses, plans, or learning dashboards.

- `/account`
  - Account profile
  - Subscription status
  - Firm selection
  - Phase selection (explicit, not inferred)

- `/paths`
  - Lists available Paths for the selected firm
  - A Path represents a firm lifecycle container
  - No progress indicators

- `/paths/[pathId]`
  - Active account view for a Path
  - Displays:
    - Firm
    - Current phase
    - Unlocked Playbooks for that phase
  - This is the primary “what applies to me right now” view

- `/calculators`
  - Calculators hub
  - Limited access for free users

- `/ai-lab`
  - AI Lab hub
  - Limited access for free users
  - AI Lab assists analysis but does not generate signals

---

## Playbook Routes (First-Class)

Playbooks are rendered directly and are always:

- Firm-specific
- Phase-specific (gated by account state)
- Non-prescriptive
- Phase-gated

### v1 Implemented Playbook Route (matches repo)

- `/firms/[firm]/phases/playbooks/[slug]`

Rules:
- The URL does **not** include `[phase]` in v1.
- Phase gating is determined by **account state** (current phase + unlocked playbook IDs).
- The Playbook rendered must be consistent with the user’s current phase.
- No notion of completion or progression.

(If we later add `[phase]` to the URL, it must remain a reflection of account state, not a learning flow.)

---

## Pro-Only Routes (Gated by Subscription)

- `/firms/[firm]/fine-print`
  - Full fine print library for the firm

- `/calculators/*`
  - Full calculators (deep links as implemented)

- `/ai-lab/*`
  - Full AI prompts and workflows

- `/paths/[pathId]`
  - Full Playbook access for the active phase
  - Full tool access tied to account state

---

## Affiliate Routes (Auth + Affiliate Role Required)

Affiliate functionality is separate from trader lifecycle state.

- `/affiliate/login`
  - Affiliate authentication (may reuse `/account` entry)

- `/affiliate/dashboard`
  - Performance overview

- `/affiliate/resources`
  - Logos, assets, copy, documentation

- `/affiliate/links`
  - Referral links and codes

- `/affiliate/payouts`
  - Earnings and payout history

---

## Future Social Layer (Not Built in v1)

- Social is Discord-based
- Firm-specific
- Phase-gated
- Read-mostly
- Structured (no generic chat, no guru model)

Routing and permissions must assume:
- 1:1 mapping between firm + phase and social access
- No open community rooms
