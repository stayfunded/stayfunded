# StayFunded — Build Blueprint (AUTHORITATIVE)

## Status
This document is the single source of truth for building StayFunded.

It supersedes:
- stayfunded-prd.md
- all pre-canon planning documents
- any previous architectural or product notes

This blueprint must be used together with:
- `core product model - Playbooks.md` (AUTHORITATIVE product model + language)
- `flight-plan-canon.md`
- `thread-bootstrap.md`

If any of these documents are missing in a build thread, work must stop.

Playbooks are first-class. If the blueprint conflicts with `core product model - Playbooks.md`, the Playbooks doc wins.

If either document is missing in a build thread, work must stop.


## Section 1 — Overview & Operating Rules

### Purpose of This Document

This blueprint defines **exactly what to build** under the `stayfunded.io` domain.

It is written so that:
- another AI
- or another developer
- or a future version of this assistant

can build StayFunded **without re-deciding product direction, scope, or tone**.

This is not a conceptual document.
This is an execution contract.


### Relationship to the Product Canon

The Product Canon (`flight-plan-canon.md`) defines:
- why StayFunded exists
- what problem it solves
- what it is and is not

This blueprint defines:
- how that product is expressed as a website and system
- what pages exist
- what users see
- what features are available
- what is public vs paid
- what is v1 vs deferred

The canon is philosophical truth.
The blueprint is operational truth.

If there is ever a conflict:
- the canon wins on meaning
- the blueprint wins on implementation


### What We Are Building (High-Level)

StayFunded is:
- a public information resource on the prop firm industry
- a paid companion product for traders
- a phase-aware guidance system (“Flight Plans”) that follows a trader from discovery to payouts
- an affiliate-first business with tooling to support partners

The **Flight Plan** is the core product.
Everything else exists to support it.


### What We Are Not Building

We are explicitly NOT building:
- a trading education platform
- a strategy marketplace
- a signals service
- a coaching program
- a brokerage or trading platform
- automated account ingestion from prop firms
- daily trade decision engines (v1)

Any suggestion that moves StayFunded toward those directions must be rejected unless the canon is explicitly revised.


### v1 Product Philosophy (Locked)

For v1:
- Guidance is **phase-based**, not daily micromanagement
- Inputs are **minimal and manual**
- The product emphasizes **understanding and adaptation**, not optimization
- The product assumes **intelligent users**, not beginners

Daily check-ins, automation, and deeper integrations may be explored later.
They are not required for v1 success.


### Monetization Model (Locked)

- Primary monetization: **$49/month**
- Secondary option: **$199/year** (confidence option, not the default CTA)
- No per-firm pricing
- No per-plan pricing

The value is access to:
- synthesis
- phase-aware guidance
- firm-specific Playbooks
- survivability calculators
- structured application of rules



### Growth Model (Locked)

- Primary growth channel: **affiliate marketing**
- Secondary growth channel: organic discovery via public firm resources

Affiliates must be given:
- simple links or codes
- clear messaging
- easy-to-use assets
- a private hub to track performance


### Execution Rules for This Blueprint

When building from this document:
- Do not add pages not specified here
- Do not change tone to be more neutral or polite
- Do not soften the adversarial framing
- Do not invent features to “improve UX” unless specified

If something feels missing:
- check later sections
- do not assume
- do not improvise

Changes require:
- explicit revision of this blueprint
- not silent interpretation


### Blueprint Structure

The remaining sections of this document will define:

- Site architecture & navigation
- Page-by-page specifications (with exact copy)
- Flight Plan v1 product spec
- Auth & subscription flows
- Affiliate system (public + private)
- Technology stack
- v1 vs v2 scope boundaries

Each section is written to be appended sequentially.

This document is authoritative once complete.

## Section 2 — Site Architecture & Navigation (Canonical)

### Purpose

This section defines:
- the full site map
- primary navigation
- visibility rules (public vs free vs paid)
- how Discovery, Firms, Flight Plans, Tools, and Affiliates relate

This structure is canonical.
Future builds must follow it unless this blueprint is revised.


## Top-Level Navigation (Public)

Visible to all users (logged out):

- Home
- Firms
- How It Works
- Pricing
- Affiliates
- Login / Sign up

Design rules:
- Navigation must feel simple and intentional
- Avoid feature sprawl in the top nav
- The product should feel focused, not bloated


## Authenticated Navigation (Logged In, Free or Paid)

Visible after login:

- Home (or Dashboard)
- Firms
- Flight Plans
- Tools
- Account
- Logout

Additional rules:
- Paid-only sections must still be discoverable (with gating)
- Gated content should explain what’s unlocked, not just block access


## Core Information Architecture

The site is organized around three conceptual layers:

1. **Industry & Firms (Public Resource)**
2. **Flight Plans (Paid Synthesis)**
3. **Tools (Supporting Utilities)**

Everything on the site must map cleanly to one of these layers.


## Layer 1 — Industry & Firms (Discovery Layer)

### Purpose
This is the public-facing intelligence layer.

It exists to:
- educate traders on how prop firms differ
- explain why rules exist
- establish authority and trust
- funnel users into paid Flight Plans

This layer is **mostly public**.

### Pages
- `/firms`
- `/firms/[firm]`
- `/firms/[firm]/rules`
- `/firms/[firm]/fine-print`
- `/firms/[firm]/comparisons` (optional v1-lite)

These pages:
- do NOT require payment
- may require login for deeper views
- must never give phase-specific guidance

They explain the terrain — not how to traverse it.


## Layer 2 — Flight Plans (Core Product)

### Purpose
This is the paid product.

Flight Plans:
- synthesize firm rules + phase context
- guide traders from discovery to payouts
- change meaningfully as phases change

This layer is **paid**, with preview access for free users.

### Pages
- `/flight-plans` (index)
- `/flight-plans/new`
- `/flight-plans/[planId]`
- `/flight-plans/[planId]/phase/[phase]`

Rules:
- Users may create multiple Flight Plans
- Each Flight Plan maps to one firm + one evaluation
- Phases are explicit and user-controlled (v1)

Flight Plans are the reason the product exists.


## Layer 3 — Tools (Supporting Utilities)

### Purpose
Tools support Flight Plans.
They are not standalone products.

### Pages
- `/tools`
- `/tools/calculators`
- `/tools/ai-lab`

Rules:
- Tools must be usable independently
- Tools must explain how they relate to phases
- Tools must not override Flight Plan guidance

Tools increase perceived value and retention.
They do not define the product.


## Affiliates (Growth Layer)

### Purpose
Affiliates are first-class users.

The affiliate system must:
- be easy to understand
- be easy to use
- reduce friction to promotion

### Pages
Public:
- `/affiliates` (landing page)

Authenticated (Affiliate role):
- `/affiliates/dashboard`
- `/affiliates/assets`
- `/affiliates/links`
- `/affiliates/payouts` (v1 read-only)

Affiliate pages are separate from trader pages.
Do not mix roles in the UI.


## Footer Navigation (All Pages)

Required footer links:
- About
- Contact
- Privacy Policy
- Terms of Service
- Disclaimers
- Affiliates

Footer tone:
- professional
- direct
- not salesy


## Visibility & Gating Rules

### Public
- Home
- Firms index
- Firm overview pages
- How It Works
- Pricing
- Affiliates landing

### Login Required (Free)
- Firm deep dives
- Limited tool usage
- Flight Plan previews

### Paid
- Full Flight Plans
- Phase-specific guidance
- Full calculators
- AI Lab workflows
- Advanced firm insights

Gating must:
- explain value
- never feel punitive
- always point to what’s unlocked


## Navigation Tone Rules

- Do not call Flight Plans “courses”
- Do not call Tools “features”
- Avoid jargon in nav labels
- Use language traders actually use

If a nav label requires explanation, it is wrong.


## Canonical Rule

If a new page or section does not clearly support:
- Discovery
- Flight Plans
- or Tools

It does not belong on the site.

## Section 3 — Page-by-Page Specification (Core Pages)

This section defines the exact pages, structure, copy, CTAs, and gating.
Text marked as “FINAL COPY” should be used verbatim unless the canon is revised.


────────────────────────────────
PAGE: Home
ROUTE: /
AUDIENCE: Public (prospects)
PURPOSE: Establish belief, authority, and necessity. Drive Discovery or Signup.

SECTIONS (in order):

1) Hero
HEADLINE (FINAL COPY):
“Good trading changes when the rules change.”

SUBHEAD (FINAL COPY):
“The rules, limits, and incentives of prop firms redefine what ‘good trading’ means — and that meaning changes again as your account moves from discovery to payouts.”

SUPPORTING COPY (FINAL COPY):
“Most traders trade evaluations like normal accounts. Prop firms design rules to punish that mistake. StayFunded shows you how to adapt — from eval selection to payouts.”

PRIMARY CTA:
“Explore firms”

SECONDARY CTA:
“See how it works”

VISUAL:
Lifecycle diagram showing Discovery → Evaluation → Stabilization → Payout.

2) The Problem (Blunt)
TITLE:
“Why most prop firm traders fail”

BULLETS (FINAL COPY):
- “They trade evaluations like normal money.”
- “They ignore how rules interact.”
- “They don’t change behavior as the account changes.”
- “They learn the rules — but not what the rules are designed to do.”

3) The Insight (Black Book Tone)
TITLE:
“Every rule exists for a reason”

COPY (FINAL):
“Prop firms don’t add rules by accident. Each one protects the firm and quietly punishes certain trader behaviors. If you don’t understand why a rule exists, you will trade directly into it.”

4) The Solution
TITLE:
“The Flight Plan”

COPY (FINAL):
“StayFunded gives you a phase-aware Flight Plan for each prop firm account — showing what matters, what breaks traders, and how ‘good trading’ changes at each stage.”

CTA:
“Create a Flight Plan”

5) What You Get
CARDS:
- “Firm-specific fine print that actually matters”
- “Phase-aware guidance (not generic advice)”
- “Survivability calculators”
- “AI analysis tools (no signals)”

6) Pricing Anchor
TITLE:
“Built to save evaluations, not sell hype”

COPY:
“Unlimited Flight Plans. All firms. All phases.”

CTA:
“View pricing”

7) Disclaimer
FINAL COPY:
“No signals. No performance claims. No trade calls. This product explains the game — it doesn’t play it for you.”


────────────────────────────────
PAGE: How It Works
ROUTE: /how-it-works
AUDIENCE: Public
PURPOSE: Explain the model clearly without jargon.

SECTIONS:

1) Step 1 — Discovery
COPY:
“Choose which firm and evaluation to buy — based on real risk, not marketing.”

2) Step 2 — Flight Plan
COPY:
“Create a Flight Plan for your account. One plan per firm + evaluation.”

3) Step 3 — Phases
COPY:
“As your account moves, what matters changes. StayFunded updates the guidance.”

4) Step 4 — Tools
COPY:
“Use calculators and AI workflows to stay inside constraints.”

CTA:
“Explore firms”


────────────────────────────────
PAGE: Firms Index
ROUTE: /firms
AUDIENCE: Public / Logged-in
PURPOSE: Discovery and authority.

CONTENT:
- List of supported prop firms
- Short neutral description per firm
- Status indicator (Active / Changes frequently / Watchlist)

CTA per firm:
“View firm”

GATING:
Public, deeper pages may require login.


────────────────────────────────
PAGE: Firm Detail
ROUTE: /firms/[firm]
AUDIENCE: Public / Logged-in
PURPOSE: Educate without guiding behavior.

SECTIONS:
- Overview
- Evaluation Types
- Rule Summary
- Industry Context
- Links to Fine Print

CTA:
“Create Flight Plan for this firm” (requires login)


────────────────────────────────
PAGE: Firm Fine Print
ROUTE: /firms/[firm]/fine-print
AUDIENCE: Logged-in (Free preview, Paid full)
PURPOSE: Black-book style rule explanation.

STRUCTURE PER RULE:
- The rule
- Why the firm uses it
- How traders misinterpret it
- Why it causes failure
- (Paid only) What kind of behavior survives it

NOTE:
Do NOT give strategies or trade instructions.


────────────────────────────────
PAGE: Flight Plans Index
ROUTE: /flight-plans
AUDIENCE: Logged-in
PURPOSE: Central product hub.

CONTENT:
- List of user Flight Plans
- Button: “New Flight Plan”
- Status (phase)

EMPTY STATE COPY:
“No Flight Plans yet. Create one to stop trading blind.”


────────────────────────────────
PAGE: Create Flight Plan
ROUTE: /flight-plans/new
AUDIENCE: Logged-in
PURPOSE: Minimal setup.

FIELDS:
- Firm (dropdown)
- Evaluation type
- Starting phase (Discovery or Evaluation)

CTA:
“Create Flight Plan”

NOTE:
No balances or daily data in v1.


────────────────────────────────
PAGE: Flight Plan Detail
ROUTE: /flight-plans/[planId]
AUDIENCE: Paid (Free preview allowed)
PURPOSE: Show phase-based guidance.

SECTIONS:
- Current Phase
- What matters now
- Rules that kill accounts in this phase
- Calculators relevant to this phase
- Resources for this phase

CTA:
“Change phase”


────────────────────────────────
PAGE: Tools Index
ROUTE: /tools
AUDIENCE: Logged-in
PURPOSE: Utility hub.

LINKS:
- Calculators
- AI Lab


────────────────────────────────
PAGE: Calculators
ROUTE: /tools/calculators
AUDIENCE: Logged-in (Paid full)
PURPOSE: Quantify survivability.

TOOLS:
- Loss capacity
- Max risk per attempt

DISCLAIMER (FINAL COPY):
“These calculators model constraints — not profitability.”


────────────────────────────────
PAGE: AI Lab
ROUTE: /tools/ai-lab
AUDIENCE: Paid
PURPOSE: Enable trader-driven analysis.

CONTENT:
- Prompts
- Data guidance
- Use cases

FINAL COPY:
“We don’t analyze the market for you. We show you how to do it safely.”


────────────────────────────────
PAGE: Pricing
ROUTE: /pricing
AUDIENCE: Public
PURPOSE: Simple decision.

PRICE:
$149/year

COPY:
“Unlimited Flight Plans. All firms. All phases.”

CTA:
“Get access”


────────────────────────────────
PAGE: About
ROUTE: /about
AUDIENCE: Public
PURPOSE: Credibility.

COPY:
“StayFunded exists because prop firm rules change what good trading means.”


────────────────────────────────
PAGE: Contact
ROUTE: /contact
AUDIENCE: Public
PURPOSE: Support.

FIELDS:
- Email
- Message

NOTE:
No phone support.


────────────────────────────────
PAGE: Affiliates (Landing)
ROUTE: /affiliates
AUDIENCE: Public
PURPOSE: Recruit partners.

COPY:
“Earn recurring revenue helping traders survive prop firms.”

CTA:
“Apply as affiliate”


────────────────────────────────
PAGE: Affiliate Dashboard
ROUTE: /affiliates/dashboard
AUDIENCE: Affiliate role
PURPOSE: Enable promotion.

SECTIONS:
- Referral link
- Codes
- Clicks
- Conversions
- Assets

NOTE:
Payouts read-only in v1.


────────────────────────────────
END OF SECTION 3

## Section 4 — Flight Plan v1 Product Specification

### Purpose

This section defines the Flight Plan as a concrete product.
It removes ambiguity around what it does, what it shows, and how users interact with it.

The Flight Plan is the **core paid product**.
All other site features support it.


## What a Flight Plan Is

A Flight Plan is:
- a structured, phase-based guide
- for one specific prop firm account
- designed to help traders adapt behavior as constraints change

A Flight Plan is NOT:
- a strategy
- a checklist of trades
- a performance tool
- a daily trade journal (v1)

It is a **lens** through which the trader interprets rules, risk, and behavior.


## One-to-One Mapping

Each Flight Plan maps to:
- One prop firm
- One evaluation type
- One active phase at a time

Users may create multiple Flight Plans.
There is no limit for paid users.


## Supported Phases (v1)

Flight Plan phases are fixed and explicit:

1. Discovery  
2. Evaluation  
3. Stabilization  
4. Payout  

Phases are:
- user-controlled (manual change)
- mutually exclusive
- always visible

There is no “hidden” or inferred phase logic in v1.


## Phase Definitions (Canonical)

### Discovery
Purpose:
- Decide which firm and evaluation to purchase

Focus:
- Cost vs risk
- Rule structures
- Failure modes before trading begins

Flight Plan shows:
- Firm comparison context
- Rules that dominate evaluation survivability
- Common evaluation traps
- Discovery calculators (cost, risk mismatch)
- Links to firm detail pages

No trading guidance appears in Discovery.


### Evaluation
Purpose:
- Prove profitability under artificial constraints

Focus:
- Daily loss limits
- Trailing drawdown behavior
- Time pressure
- Rule interactions

Flight Plan shows:
- “Rules that actually end evals”
- Why these rules exist
- What behaviors increase violation risk
- Calculators tied to loss capacity
- Resources aligned to eval survival

No strategies or setups are provided.


### Stabilization
Purpose:
- Survive the post-funding danger zone

Focus:
- Trailing drawdown mechanics
- Psychological overtrading
- Scaling rules
- Capital preservation

Flight Plan shows:
- Why funded accounts die early
- What changes after the eval
- Rules that matter more now than before
- Calculators with tighter buffers
- Resources focused on restraint

This phase is treated as distinct from Evaluation.


### Payout
Purpose:
- Extract value while staying compliant

Focus:
- Payout rules
- Minimum days
- Consistency requirements
- Long-term account survival

Flight Plan shows:
- Payout mechanics
- Rules that silently reset accounts
- Behavioral traps post-profit
- Tools focused on preservation

The product never implies guaranteed payouts.


## Flight Plan Page Structure (v1)

Each Flight Plan page contains:

1. Header
   - Firm name
   - Evaluation type
   - Current phase
   - Button: “Change phase”

2. Phase Overview
   - Plain-language description of what matters now

3. Rule Focus
   - 3–5 rules that dominate this phase
   - Each rule includes:
     - What it is
     - Why the firm uses it
     - How traders misread it
     - Why it causes failure

4. What Breaks Traders Here
   - Behavioral and structural mistakes
   - No trade examples

5. Tools for This Phase
   - Linked calculators
   - Clear explanation of why they matter now

6. Resources
   - External links (videos, articles, concepts)
   - Curated by phase
   - No in-house strategy training

7. Disclaimer
   - “This is not trading advice.”


## Inputs Required (v1)

Flight Plans require minimal input:

Required:
- Firm
- Evaluation type
- Phase

Optional (future, not required):
- Account balance
- Drawdown values
- Trade counts

v1 assumes **conceptual guidance**, not real-time monitoring.


## What v1 Explicitly Does NOT Do

- No daily check-ins
- No balance tracking
- No alerts
- No automation
- No integration with prop firm systems
- No judgment or scoring

These may be explored later but are excluded from v1.


## Why This Is Enough for v1

The core value is not precision.
It is **contextual clarity**.

If a trader understands:
- why rules exist
- how phases change incentives
- what behaviors are punished

They are materially better equipped to survive.

That belief is the product.


## Success Criteria (v1)

A successful Flight Plan:
- makes traders rethink how they trade prop accounts
- reduces rule violations
- increases evaluation completion
- feels indispensable once used

If users feel “naked” without it, the product is working.


## Canonical Lock

This Flight Plan specification is locked for v1.

Any expansion requires:
- explicit blueprint revision
- not ad-hoc feature additions

## Section 5 — Auth, Subscription, and Access Control

### Purpose

This section defines:
- how users sign up
- how access is granted
- how paid vs free functionality is enforced
- how affiliates and admins are handled

The goal is:
- low friction for users
- minimal complexity in v1
- clear upgrade paths
- no custom auth logic beyond what is necessary


## Authentication Model (v1)

### Supported Login Methods

StayFunded supports:

1. Email magic link (primary)
2. Google OAuth (secondary)
3. Email/password (optional fallback)

Rationale:
- Magic link reduces friction and password support issues
- Google OAuth matches common trader behavior
- Password auth remains optional, not emphasized

Users may link multiple auth methods to the same account.


## Auth Provider

Recommended provider:
- Supabase Auth

Reasons:
- Email magic links built-in
- Google OAuth supported
- Row-level security integrates with database
- Matches existing project direction

No custom auth service is built in v1.


## User Roles

There are four user roles:

1. Public (not logged in)
2. Free User
3. Pro User
4. Affiliate
5. Admin

Roles are additive where appropriate.


## Access Levels by Role

### Public (No Account)
Can access:
- Marketing pages
- Firm overview pages (limited)
- Educational content
- Sample excerpts (read-only)

Cannot:
- Create Flight Plans
- Access calculators
- Use AI Lab


### Free User
Can:
- Create up to 1 Flight Plan
- View limited firm rule summaries
- Access selected calculators (read-only or capped)
- See full UI but with locked features

Cannot:
- Create additional Flight Plans
- Access full rule breakdowns
- Access full calculator functionality
- Access affiliate hub


### Pro User ($149/year)
Can:
- Create unlimited Flight Plans
- Access all phases
- Access all calculators
- Access AI Lab
- Save and revisit Flight Plans
- Use firm comparison tools fully

This is the primary paid tier.


### Affiliate
Can:
- Access affiliate dashboard
- View referral links and codes
- Download marketing assets
- View basic referral metrics

Affiliate users may also be Free or Pro.


### Admin
Can:
- Manage firms
- Edit rules content
- Edit Flight Plan copy
- View system metrics
- Manage affiliates
- Issue comped Pro access

Admins are not exposed publicly.


## Subscription Model

### Pricing (v1)

- Pro: $149 / year
- No monthly option in v1
- No trials (may be added later)
- Refund policy handled via Stripe settings

Free account is permanent and does not expire.


## Payment Provider

Provider:
- Stripe

Stripe handles:
- Checkout
- Subscription lifecycle
- Payment failures
- Receipts
- Tax handling

No custom billing UI in v1.


## Upgrade Flow

1. User hits locked feature
2. Inline prompt explains value
3. “Upgrade to Pro” CTA
4. Stripe Checkout
5. Redirect back to original context

No forced sales pages.


## Feature Gating Logic

Access is controlled by:
- subscription_status field
- role field

All gating enforced at:
- UI level (buttons, pages)
- API level (server-side checks)

Never rely on frontend-only checks.


## Database Fields (Auth-Related)

User table requires:

- id (uuid)
- email
- role
- subscription_status (free | pro)
- created_at
- last_login_at

Affiliate fields (if applicable):
- affiliate_code
- referred_by
- payout_status


## Security Principles

- No sensitive data stored unnecessarily
- No trading data ingestion
- No account credentials
- No firm API keys

StayFunded never touches brokerage or prop firm accounts.


## Canonical Lock

Auth and access control are intentionally simple in v1.

Do not add:
- team accounts
- seat management
- enterprise tiers
- complex permission trees

Those are explicitly out of scope.

## Section 6 — Firms, Rules, and Industry Knowledge Base

### Purpose

This section defines the public and paid knowledge base that powers:
- discovery (which firm to trade with)
- credibility (why the site is worth trusting)
- Flight Plans (how guidance adapts by firm and phase)

This is the backbone of StayFunded’s authority.

Public users see education.
Pro users get synthesis.


## Core Principle

Prop firm rules are not arbitrary.
They exist to:
- control trader behavior
- limit firm risk
- maximize expected value for the firm

StayFunded explains:
- why each rule exists
- how it affects traders psychologically and operationally
- how traders adapt their behavior to survive under it

This framing is non-negotiable and must appear everywhere.


## Firm Pages (Public-Facing)

Each firm has a public page with:

### Required Fields
- Firm name
- Logo
- Status (active / declining / questionable / defunct)
- Country / jurisdiction
- Years operating
- Payout reputation (qualitative, not promises)

### Rule Overview (Public)
- Max drawdown type (static vs trailing)
- Daily loss rules (yes/no)
- Time constraints
- Scaling mechanics
- Reset availability
- Typical eval cost ranges

This is informational, not advisory.


## Rule Deep Dives (Paid)

Each rule has a structured breakdown:

### Rule Anatomy Template

For each rule:

1. What the rule is
2. Why the firm uses it
3. How it hurts traders
4. Common trader mistakes
5. Behavioral adaptations that help
6. Phase sensitivity (which phases this rule matters most)

This content is Pro-only.


## Rule Categories

Rules are normalized into categories:

- Drawdown mechanics
- Daily loss limits
- Profit targets
- Time constraints
- Scaling / payout rules
- Consistency requirements
- News / session restrictions
- Contract limits

Every firm rule must map to one or more categories.


## Industry Education Content

Public-facing educational pages include:

- How prop firms make money
- Why “real-time trailing drawdown” exists
- Why evaluations are designed to fail
- Why consistency rules exist
- Why payouts are delayed or capped

Tone:
- blunt
- explanatory
- non-salesy
- non-conspiratorial

This is education, not outrage bait.


## Firm Comparison (Pro Feature)

Pro users can:
- compare firms side by side
- filter by rule structure
- filter by trader profile (conservative / aggressive / swing)

Comparisons focus on constraints, not payouts.


## Data Freshness and Accuracy

Rules change.

System must support:
- rule versioning
- last updated timestamp
- “rules may change” disclaimers

Admin tools must allow quick updates.


## Database Entities (Firms)

Required tables:

### firms
- id
- name
- slug
- status
- description
- logo_url
- country
- created_at

### firm_rules
- id
- firm_id
- rule_category
- rule_text
- explanation_text
- firm_motivation_text
- trader_impact_text
- adaptation_text
- phase_sensitivity
- last_updated

### rule_categories
- id
- name
- description


## Canonical Lock

- Firm content is not crowdsourced in v1
- No user comments on rules
- No ratings or reviews
- No promises of accuracy beyond “best available understanding”

Authority comes from clarity, not consensus.

## Section 7 — Flight Plan (Core Product)

### Purpose

The Flight Plan is the core paid product.

It exists to solve one specific problem:

> Traders trade prop firm accounts the same way they trade personal accounts — and that doesn’t work.

The Flight Plan tells a trader:
- what phase they are in
- what “good trading” means in that phase
- what matters and what does not
- how to adapt behavior to survive the rules

It does NOT:
- give trade signals
- give entry/exit instructions
- tell traders how to make money

It teaches adaptation to constraints.


## Core Mental Model

One account = one Path  
Each Path moves through phases  
Each phase changes what matters  

The Flight Plan is phase-based in v1.


## Supported Phases (v1)

Every Path must support all phases:

1. Discovery  
2. Evaluation  
3. Stabilization  
4. Payout  
5. Post-Payout / Scaling (if applicable)

Phases are firm-aware.


## Flight Plan Structure (v1)

Each Flight Plan is generated from:
- firm
- phase

Not from:
- intraday balance
- real-time P&L
- proximity to drawdown

This keeps v1 buildable and defensible.


## Flight Plan Output (Per Phase)

Each phase delivers a structured briefing:

### 1. Phase Definition
- What this phase is
- What success looks like
- What failure usually looks like

### 2. What Matters Most
- Top 3 rules that dominate outcomes in this phase
- Why those rules matter *now*

### 3. Common Ways Traders Blow This Phase
- Behavioral mistakes
- Overtrading patterns
- Psychological traps

### 4. How Traders Adapt in This Phase
- Position sizing mindset
- Trade frequency mindset
- Risk posture (qualitative)
- Patience vs urgency framing

No numbers. No strategy specifics.


### 5. What Not To Care About
- Things traders obsess over that don’t matter in this phase
- Distractions that increase failure risk


### 6. Learning Resources
- Curated external resources
- YouTube videos
- Articles
- Concepts to study

StayFunded does not train strategies.
It points traders in the right direction.


### 7. Phase Transition Signals
- What changes when this phase ends
- What to prepare for next
- What mindset shift is required


## Discovery Phase (Special Case)

Discovery Phase is pre-account.

It helps traders decide:
- which firms to avoid
- which structures fit them
- what type of eval they should purchase

Discovery Flight Plan includes:
- firm comparison guidance
- rule structure explanations
- “who this firm is for / not for” framing

This is a major conversion driver.


## UX: How Users Interact with Flight Plans

- User selects a firm
- User selects a phase
- Flight Plan renders immediately

No daily check-ins in v1.
No journaling.
No P&L tracking.

Fast. Simple. Opinionated.


## Updating a Flight Plan

Flight Plans update when:
- user manually changes phase
- firm rules change
- StayFunded updates guidance

No automation in v1.


## Database Entities (Flight Plan)

### flight_plans
- id
- firm_id
- phase
- overview_text
- what_matters_text
- common_mistakes_text
- adaptations_text
- dont_care_text
- resources (array)
- transition_text
- updated_at


## Paywall Rules

- Public users: no Flight Plans
- Free users: limited preview (Discovery only)
- Pro users: full access to all phases


## Tone Requirements

Flight Plans must feel:
- calm
- confident
- blunt but not aggressive
- practical, not academic

Language must be human.
No jargon unless unavoidable.


## Canonical Lock

- Flight Plans are phase-based in v1
- No daily state tracking
- No calculators inside Flight Plans
- No signals, setups, or strategies

Any deviation requires explicit versioning.

## Section 8 — Authentication, Accounts, and User Roles

### Purpose

Authentication exists to:
- unlock paid content
- personalize Flight Plans
- support affiliates
- remain low-friction for traders

Auth is not a product feature.
It should feel invisible.


## Authentication Methods (v1)

The system must support:

1. Magic Link (email-based)
2. Social Login
   - Google (required)
   - Apple (optional but recommended)

Email/password is NOT required in v1.


## Why Magic Link + Social Login

- Traders hate passwords
- Faster onboarding = higher conversion
- Mobile-friendly
- Low support burden

Magic link is the fallback.
Google is the default preference.


## Auth Technology

Recommended stack:
- Supabase Auth

Reasons:
- Magic links supported
- Google OAuth supported
- Easy session handling
- Tight DB integration

This is a hard recommendation unless changed explicitly.


## User Roles

### 1. Visitor (Unauthenticated)
- Can browse public content
- Can view firm overviews
- Cannot access Flight Plans
- Cannot access calculators
- Cannot access affiliate resources


### 2. Free User
- Authenticated
- Can access:
  - Firm hubs
  - Limited Discovery Phase previews
  - Public calculators (if enabled)
- Cannot access:
  - Full Flight Plans
  - Advanced tools
  - Affiliate dashboards


### 3. Pro User
- Authenticated
- Paid
- Full access to:
  - All Flight Plans
  - All phases
  - All firms
  - AI Lab
  - Calculators
- Can start at any phase


### 4. Affiliate
- Authenticated
- Special access:
  - Affiliate dashboard
  - Referral links
  - Marketing assets
  - Conversion stats

Affiliates may or may not be Pro users.


### 5. Admin (Internal)
- Full access
- Can edit:
  - Firms
  - Rules
  - Flight Plans
  - Pricing
  - Affiliate payouts


## Account Creation Flow

### Default Flow
1. User clicks gated content
2. Auth modal appears
3. User chooses:
   - Continue with Google
   - Email magic link
4. Session created
5. User lands back where they started

No onboarding wizard in v1.


## Account Data Stored (Minimal)

### users
- id
- email
- auth_provider
- role
- created_at


### profiles
- user_id
- display_name (optional)
- referral_code (if affiliate)
- referred_by (nullable)
- plan (free/pro)
- plan_started_at


## Session Handling

- Sessions persist across reloads
- Logged-out users see gated CTAs
- No session timeout messaging needed


## Security Constraints

- No sensitive trading data stored
- No account credentials for prop firms
- No brokerage access
- No API keys from users

This keeps compliance and liability low.


## Canonical Lock

- Magic link + Google OAuth only in v1
- No passwords required
- No complex onboarding
- Roles are static and explicit

Changes require versioning.

## Section 9 — Firms, Rules, and the Industry Knowledge Base

### Purpose

This section defines StayFunded’s public-facing authority.

The site is:
- an industry knowledge base (public)
- a synthesis engine (paid)

The Firm Knowledge Base exists to:
- explain how prop firms actually make money
- show why rules exist
- expose how rules trap traders
- set up the need for Flight Plans

This section is a major acquisition channel.


## Core Principle

Not all prop firms are created the same.
Not all rules matter equally.
Every rule exists for a reason — and that reason is usually adverse to traders.

StayFunded explains:
- why the rule exists
- how it benefits the firm
- how it breaks traders
- how traders can adapt (without signals)


## Firm Hub Structure

Each prop firm has a dedicated hub page.

URL pattern:
- /firms/{firm-slug}


### Firm Hub Sections (in order)

1. Firm Overview
2. Evaluation Structure(s)
3. Rules That Matter
4. Why These Rules Exist
5. Common Trader Failure Modes
6. Discovery Verdict
7. CTA into Flight Plans


## 1. Firm Overview (Public)

Content:
- Firm name
- Status (active / unstable / shutdown history)
- Business model summary
- Who the firm is best for / worst for

Tone:
- blunt
- neutral
- non-promotional


## 2. Evaluation Structure(s)

Each firm may have multiple eval types.

For each eval:
- Cost
- Profit target
- Drawdown type (static / trailing / real-time)
- Time constraints
- Scaling rules
- Payout cadence

Displayed as a structured table.


## 3. Rules That Matter (Critical)

Not all rules are equal.

This section highlights:
- The 1–3 rules that actually end accounts
- Rules that appear minor but dominate risk
- Rules that interact dangerously with others

Rules are ranked by:
- account kill probability
- trader misunderstanding rate


## 4. Why These Rules Exist (The Black Book Layer)

For each major rule:

Explain:
- Why the firm uses it
- How it increases firm profitability
- What behavior it incentivizes
- What behavior it punishes

This section is:
- analytical
- unapologetic
- subversive in tone

Example framing:
“This rule exists because it reliably causes traders to self-destruct under pressure.”


## 5. Common Trader Failure Modes

Examples:
- Trading evals like cash accounts
- Over-sizing near targets
- Ignoring trailing drawdown mechanics
- Time pressure behavior

This section builds recognition:
“Oh — that’s me.”


## 6. Discovery Verdict

A clear, opinionated summary:
- Who should consider this firm
- Who should avoid it
- What type of trader survives here

This is NOT a recommendation to trade.
It is a structural assessment.


## 7. CTA into Flight Plans

End every firm hub with:

“You don’t trade this firm the same way in every phase.
If you choose this firm, here’s how StayFunded guides you.”

CTA options:
- Start a Flight Plan (Discovery)
- Jump to Evaluation Phase
- Compare firms first


## Data Model (Firms)

### firms
- id
- name
- slug
- status
- overview
- created_at


### firm_evals
- id
- firm_id
- name
- cost
- profit_target
- drawdown_type
- drawdown_amount
- time_rules
- scaling_rules


### firm_rules
- id
- firm_id
- rule_name
- rule_description
- impact_rank
- why_it_exists
- how_traders_fail
- how_to_adapt


## Access Control

- Firm Overview: Public
- Evaluation Structures: Public
- Rules That Matter: Free (partial), Pro (full)
- Why These Rules Exist: Pro
- Discovery Verdict: Free summary, Pro full


## Canonical Lock

- Firms are NOT promoted
- No affiliate bias in firm analysis
- Tone is analytical and blunt
- This section feeds the Flight Plan engine

Any change to tone or purpose must update the Canon.

## Section 10 — Flight Plans (Core Product)

### Purpose

Flight Plans are the core paid product.

They are the reason traders pay $149/year.

A Flight Plan:
- adapts “good trading” to prop firm rules
- changes guidance by account phase
- replaces guesswork with structured context
- makes traders feel naked without it

This is not education.
This is not signals.
This is not a course.

This is a **companion system** that tells traders:
“What matters right now — given the rules you’re under.”


## Core Belief (Primary Messaging)

“The rules, limits, and incentives change what ‘good trading’ means.
StayFunded shows you how to adapt — from discovery to payouts.”

Everything in this product reinforces that belief.


## What a Flight Plan Is

A Flight Plan is:
- tied to one firm + one evaluation type
- progresses through phases
- phase-aware, not trade-aware
- opinionated but non-prescriptive

A trader may have:
- multiple Flight Plans at once
- plans at different firms
- plans at different phases


## Flight Plan Phases (v1)

Flight Plan v1 supports **stage-based guidance only**  
(no daily balance math, no automation).

Phases:

1. Discovery
2. Evaluation
3. Stabilization
4. Payout
5. Maintenance (optional, post-payout continuity)

Each phase has:
- different goals
- different risks
- different “good behavior”
- different learning resources


## Phase Definitions

### 1. Discovery Phase

Purpose:
- help traders choose the right firm + eval
- frame risk before money is spent

What matters here:
- cost vs profit target asymmetry
- drawdown mechanics
- rule interaction risk
- time pressure

Flight Plan output:
- what to look for
- what to avoid
- which trader profiles fit / don’t fit
- links into firm hubs

This phase may be skipped if the trader already has an account.


### 2. Evaluation Phase

Purpose:
- pass without violating rules

What matters here:
- survival > profit
- behavior under constraints
- drawdown mechanics
- rule stacking

Flight Plan guidance includes:
- how “good trading” differs from cash accounts
- common eval-killing behaviors
- styles of trading that fit this phase
- styles that don’t

No setups are taught.
Only **setup categories** and **behavioral framing**.


### 3. Stabilization Phase

Purpose:
- survive post-eval
- build buffer
- avoid giving the account back

What matters here:
- trailing drawdown behavior
- overconfidence risk
- size creep
- reset psychology

Flight Plan guidance:
- why most traders lose here
- what behavior shifts are required
- how firms expect traders to fail


### 4. Payout Phase

Purpose:
- get paid without triggering violations

What matters here:
- payout rules
- minimum days
- withdrawal timing
- risk compression

Flight Plan guidance:
- what firms punish here
- what behavior delays payouts
- how traders sabotage themselves near money


### 5. Maintenance Phase (Optional v1)

Purpose:
- keep funded accounts alive

This phase is informational only in v1.


## What a Flight Plan Shows (UI-Level)

Each Flight Plan page shows:

- Firm name
- Evaluation type
- Current phase
- Phase goal (plain English)
- Phase risks (top 3)
- Rules that matter *right now*
- Behavior shifts required
- Resources mapped to this phase

Tone:
- blunt
- supportive
- practical


### Phase-linked references (non-primary)

Some phases may include optional outbound references
(e.g., firm rule pages, platform docs).

These are:
- supplemental
- non-instructional
- never the primary value
- never framed as education

Playbooks remain the sole primary unit of value.


We teach **how to think**, not what to trade.


## User Input (v1)

Minimal.

At Flight Plan creation:
- select firm
- select eval
- select starting phase

At phase changes:
- user manually advances phase

No balance input in v1.


## Why This Is Worth Paying For

A book:
- is static
- doesn’t adapt
- can’t meet traders where they are

Flight Plans:
- change by phase
- change by firm
- synthesize thousands of rules into what matters now
- reduce cognitive load at the exact moments traders fail

This is not content.
This is context.


## Data Model (Flight Plans)

### flight_plans
- id
- user_id
- firm_id
- eval_id
- current_phase
- created_at
- updated_at


### flight_plan_phase_notes
- id
- flight_plan_id
- phase
- content_blocks (json)
- resources (json)


## Access Control

- Creating Flight Plans: Pro only
- Viewing Discovery phase summaries: Free
- Full phase guidance: Pro
- Multiple concurrent plans: Pro


## Canonical Lock

- Flight Plans are the product
- Phases are the organizing principle
- No daily micromanagement in v1
- No signals, no trade calls
- Language must stay human, not academic

Any feature that violates these rules is out of scope.

## Section 11 — Authentication, Accounts, and User Model

### Purpose

Authentication must be:
- frictionless
- fast
- familiar
- invisible once complete

The goal is **zero resistance to first value**.

Traders should be able to:
- get into the product in under 30 seconds
- come back repeatedly without friction
- use social login if available


## Auth Strategy (v1)

We will support:

1. Magic link (email-based)
2. Google OAuth (Gmail)
3. Optional email/password (fallback only)

Primary recommendation:
- Magic link + Google OAuth

Rationale:
- traders hate passwords
- many already use Gmail
- lowest drop-off
- simplest mental model


## Login Flow

### Entry Points
- “Create free account”
- “Start a Flight Plan”
- “View Fine Print (locked)”
- “Explore firms (advanced)”

If unauthenticated:
- user is prompted to log in
- after login, user is returned to original action


### First Login Experience

Upon first successful login:
1. user lands on onboarding screen
2. explanation of Flight Plans (1–2 screens)
3. CTA to create first Flight Plan or explore firms


## User Roles

### Roles

- Public (unauthenticated)
- Free User (authenticated)
- Pro User (paid)
- Affiliate (special role)
- Admin (internal)

Roles are additive (e.g., Pro + Affiliate).


## User Object (Data Model)

### users
- id
- email
- name (optional)
- role
- plan (free | pro)
- created_at
- last_login_at


### user_profiles
- user_id
- display_name (optional)
- timezone (optional)
- experience_level (optional)
- referral_source (optional)


## Subscription State

Subscriptions are binary in v1.

### plans
- free
- pro ($149/year)

We do NOT support:
- monthly plans
- tiered feature flags beyond free/pro
- seat-based pricing in v1


## Paywall Behavior

Free users can:
- browse firms
- read public industry content
- create zero Flight Plans
- view partial Discovery summaries

Pro users can:
- create unlimited Flight Plans
- access all phases
- access calculators
- access Fine Print library
- access AI Lab

Paywall messaging should always say:
“Unlock phase-specific guidance.”


## Session Behavior

- Persistent login (30+ days)
- Silent refresh
- No forced re-auth during normal usage


## Security Requirements

- No trading credentials stored
- No broker API connections
- No firm credentials
- No sensitive PII beyond email

We never:
- access trading accounts
- ingest account balances automatically
- claim data synchronization with firms


## Canonical Lock

- Auth must never block learning
- Login exists to unlock context, not gatekeep
- No friction-heavy onboarding
- Social login is required

Any auth flow that feels “enterprise” is wrong.

## Section 12 — Firms, Industry Knowledge, and The Fine Print

### Purpose

The public-facing credibility of StayFunded comes from one thing:

**We understand prop firms better than they explain themselves.**

This section of the site establishes:
- authority
- trust
- industry literacy
- why Discovery exists
- why Flight Plans matter

This is NOT marketing fluff.
This is the foundation that justifies the paid product.


## Core Principle

Not all prop firms are created the same.

And more importantly:
**Every rule exists for a reason — and that reason is usually not the trader.**

StayFunded makes those reasons explicit.


## Firms Hub (Top-Level)

Route:
- `/firms`

Purpose:
- act as the industry index
- allow Discovery before purchase
- drive SEO + inbound traffic
- funnel users into Flight Plans

The Firms Hub is available to:
- public users
- free users
- pro users


### Firms Hub Page Content

Each firm card displays:
- Firm name
- Account types offered
- Evaluation style (1-step, 2-step, instant)
- High-level risk profile (low / medium / high)
- CTA: “View Firm”


## Firm Detail Pages

Route:
- `/firms/[firm]`

Each firm page is structured identically.

### Firm Overview Section

Includes:
- brief neutral description of the firm
- who the firm is designed for
- how the firm makes money (high level)
- where most traders misunderstand this firm


### Rule Structure Section

Explicit breakdown of:
- profit targets
- daily loss limits
- trailing drawdown mechanics
- max position sizing rules
- time limits
- payout rules
- scaling rules

Rules must be written in:
- plain English
- concrete examples
- zero marketing language


## The Fine Print (Core Differentiator)

This is the most important content on the site.

Route:
- `/firms/[firm]/fine-print`

Access:
- preview for public users
- partial for free users
- full for Pro users


### Fine Print Structure

Each Fine Print page is structured rule-by-rule.

For each rule:

1. **What the rule is**
   - rewritten in plain English

2. **Why the firm uses it**
   - how it protects the firm
   - how it reduces firm risk

3. **How traders get hurt by it**
   - common misconceptions
   - typical failure modes

4. **How traders adapt**
   - behavior changes
   - mindset shifts
   - what *not* to do
   - no trade signals
   - no setups
   - no strategy calls


Tone:
- blunt
- honest
- respectful
- slightly adversarial
- never promotional


## Discovery Mode

Discovery exists to answer one question:

**“Which evaluation should I buy next?”**

Discovery is firm-agnostic but rule-aware.


### Discovery Tools

Discovery includes:
- comparison tables
- structural risk explanations
- cost vs. profit vs. drawdown framing
- “fragility” indicators (qualitative, not numeric hype)


### Discovery Output

Discovery never recommends:
- a specific firm
- a specific account size
- a specific strategy

Discovery DOES help traders understand:
- what type of trader a firm favors
- what type of mistakes a firm punishes
- which structures are most forgiving
- which structures are most fragile


## Relationship to Flight Plans

Discovery is:
- optional if user already has an account
- mandatory if user wants help choosing one

Flight Plans can begin at:
- Discovery
- Evaluation
- Stabilization
- Payout

Discovery is the default entry point.


## Canonical Lock

- Firms pages are informational first
- Fine Print is the crown jewel
- No hype language
- No “best firm” claims
- No affiliate bias in language

If a firm removed affiliate links tomorrow,
this content must still stand on its own.

## Section 13 — Flight Plans (Core Product)

### Purpose

Flight Plans are the product.

Everything else on StayFunded exists to support, inform, or enrich a Flight Plan.

A Flight Plan is:
- a guided companion for a single prop firm account
- phase-based (not daily in v1)
- rule-aware
- firm-aware
- behavior-focused, not strategy-driven

If Flight Plans were removed, StayFunded would no longer justify its price.


## Core Thesis (Canonical)

The rules, limits, and incentives change what “good trading” means.

Most traders fail because they trade evaluations the same way they trade personal accounts.

Flight Plans exist to help traders adapt their behavior to:
- the firm
- the account structure
- the current phase of the account


## What a Flight Plan Is (v1)

A Flight Plan is:
- tied to ONE firm
- tied to ONE account / evaluation
- progresses through phases
- updated manually by the trader when the phase changes

A Flight Plan is NOT:
- a trading journal
- a performance tracker
- a signal service
- a strategy coach
- a real-time account monitor


## Supported Phases (v1)

Every Flight Plan must support all phases:

1. Discovery
2. Evaluation
3. Stabilization
4. Payout
5. Maintenance (optional, informational)

Phases are sequential but users may start at any phase.


## Phase Definitions

### 1. Discovery

Purpose:
- help traders choose which evaluation to buy
- help traders understand structural risk BEFORE spending money

Flight Plan behavior:
- firm comparison insights
- structural fragility explanations
- rule trade-offs
- “who this favors / who this punishes”

No account data required.


### 2. Evaluation

Purpose:
- pass the evaluation
- avoid rule violations
- avoid unnecessary risk

Flight Plan focus:
- small, repeatable wins
- consistency over aggression
- understanding the *one rule that matters most*

Content emphasis:
- what behavior gets traders failed here
- what behavior keeps traders alive
- common psychological traps

No strategies.
No setups.
Only behavioral framing.


### 3. Stabilization

Purpose:
- survive the post-funding drawdown period
- create breathing room
- avoid “death by confidence”

Flight Plan focus:
- drawdown mechanics
- why funded accounts die here
- how firms expect traders to behave
- how traders sabotage themselves

This phase is where most traders lose funded accounts.


### 4. Payout

Purpose:
- make consistent withdrawals
- avoid violations while extracting capital

Flight Plan focus:
- payout cadence
- scaling pressure
- how firms manage payout risk
- why overconfidence ruins this phase


### 5. Maintenance (Optional)

Purpose:
- long-term funded account survivability
- discipline reinforcement
- avoiding slow bleed failures

This phase is informational in v1.


## Flight Plan Creation Flow

1. User clicks “Create Flight Plan”
2. Selects firm
3. Selects starting phase
4. Optionally names the plan
5. Plan is created and saved

Default:
- one free user = zero plans
- pro user = unlimited plans


## Flight Plan Dashboard

Route:
- `/plans/[plan_id]`

Each Flight Plan dashboard includes:

1. Plan summary
   - firm
   - current phase
   - date started
   - phase explanation

2. Phase Guidance Panel
   - what matters in this phase
   - what traders get wrong
   - how firms expect behavior

3. Fine Print Highlights
   - top 1–3 rules that matter MOST in this phase
   - pulled from firm Fine Print

4. Tools Relevant to Phase
   - calculators (if applicable)
   - AI Lab links (if applicable)

5. Resource Direction
   - concepts to study
   - behaviors to practice
   - external resources (YouTube, articles)
   - no proprietary strategy training


## Phase Change Flow

When a trader changes phase:

1. User manually selects new phase
2. Confirmation prompt explains what changes
3. Plan dashboard updates content
4. Historical phase data is preserved (read-only)

No automatic detection in v1.


## Language Guidelines

Flight Plans must:
- speak like a human mentor
- avoid buzzwords
- avoid jargon where possible
- be blunt but not arrogant

Banned phrases:
- “guardrails”
- “safe envelope”
- “constraints” (use “rules” or “limits”)
- “optimize”
- “maximize”

Approved tone:
- practical
- honest
- slightly subversive
- trader-first


## Value Justification

Traders pay for Flight Plans because:
- the advice changes by phase
- the advice changes by firm
- the advice explains *why* rules exist
- the advice prevents expensive mistakes

This cannot be delivered as:
- a static blog
- a single PDF
- a one-time course


## Canonical Lock

Flight Plans are:
- phase-based
- rule-aware
- behavior-focused
- manually updated
- the core paid product

If a feature does not support Flight Plans,
it should not exist in v1.

## Section 14 — Calculators (Support Tools)

### Purpose

Calculators exist to answer one question:

“What can I afford to do without getting killed by the rules?”

They are:
- conservative by design
- survivability-first
- rule-aware
- phase-aware (where applicable)

Calculators support Flight Plans.
They do not stand alone as a “trading edge.”


## Core Principle

If a calculator encourages risk-taking, it is wrong.

Calculators must:
- reduce ambiguity
- reduce overconfidence
- expose hidden fragility
- err on the side of caution


## Access

- Public: read-only explanations, examples
- Free: limited calculator access (demo inputs)
- Pro: full calculators with firm + phase context


## Calculator Categories (v1)

### 1. Loss Capacity Calculator

Purpose:
- determine how much loss is survivable TODAY

Inputs:
- account size
- trailing drawdown type (if applicable)
- daily loss limit (if applicable)
- current phase

Outputs:
- maximum allowable loss buffer
- warning zones (qualitative, not numeric alarms)
- explanation of what actually ends the account

Language:
- “If you lose X, the account is effectively dead”
- “This is where most traders think they’re safe — and aren’t”


### 2. Max Risk Per Trade Calculator

Purpose:
- determine trade-level risk that does not threaten account survival

Inputs:
- loss capacity output
- number of planned trades per day/session
- phase of account

Outputs:
- conservative max risk per trade
- explanation of compounding risk
- why “one big trade” is dangerous in this structure

No RR optimization.
No expectancy math.
No profit projections.


### 3. Structural Fragility Explorer (Discovery)

Purpose:
- help traders understand eval risk BEFORE purchase

Inputs:
- eval cost
- profit target
- drawdown structure
- time limit

Outputs:
- qualitative fragility assessment
- explanation of which traders this structure punishes
- explanation of which traders it favors

This tool supports Discovery, not trading.


## Calculator UX Rules

- No green/red profit visuals
- No “you should risk X%” language
- No sliders that gamify risk
- Heavy use of explanations and warnings

Each calculator page must answer:
“Why does this matter for my account survival?”


## Calculator Placement

Calculators appear in:
- Flight Plan dashboards (contextual)
- Tools section (standalone)
- Discovery pages (structural only)

They must never feel disconnected from rules.


## Canonical Lock

Calculators:
- exist to prevent mistakes
- are conservative by default
- support Flight Plans
- never promise performance
- never replace judgment

If a calculator feels exciting,
it is doing the wrong job.

## Section 15 — AI Lab

### Purpose

AI Lab exists to solve a real problem traders have:

“They know AI could help them, but they don’t know how to use it safely or practically.”

AI Lab is NOT:
- an AI trading bot
- a signal generator
- a strategy engine
- a black box

AI Lab is:
- a guided workspace
- a learning accelerator
- a way to do your own analysis with AI
- fully trader-controlled


## Core Principle

StayFunded does NOT generate trades.

We teach traders how to:
- ask better questions
- analyze their own data
- understand markets at a structural level
- avoid hallucinations and false confidence


## Access

- Public: explanation of what AI Lab is
- Free: limited prompts + examples
- Pro: full prompt library + workflows


## AI Lab Components (v1)

### 1. Prompt Library

Curated prompts organized by:
- purpose (market structure, risk review, session review)
- data type (price action, statistics, notes)
- experience level

Each prompt includes:
- what it’s for
- what data to paste
- what NOT to expect
- common mistakes


### 2. Workflows

Step-by-step AI-assisted processes such as:
- “Review a losing day without bias”
- “Analyze market structure without indicators”
- “Translate raw notes into structured insights”

Workflows never include:
- entries
- exits
- targets
- trade instructions


### 3. Data Guidance

AI Lab explains:
- what tick data is
- where to obtain it
- what quality matters
- what is overkill

We do NOT sell data.
We point traders to reputable sources.


## Safety Controls

AI Lab must:
- include disclaimers about hallucinations
- emphasize verification
- discourage blind trust
- explain limitations clearly

Tone:
- cautious
- educational
- empowering without hype


## Integration With Flight Plans

AI Lab content is surfaced contextually:
- different prompts per phase
- different workflows per firm structure
- never mandatory
- always optional support


## UX Rules

- No flashing AI gimmicks
- No “AI-powered edge” language
- No performance claims
- No automation illusions

AI Lab should feel:
- calm
- serious
- professional
- grounded


## Canonical Lock

AI Lab exists to:
- reduce confusion
- accelerate understanding
- empower independent thinking

If AI Lab ever feels like a shortcut,
it is wrong.

## Section 16 — Pages, Navigation, and Site Structure

### Purpose

The site must feel:
- intentional
- calm
- authoritative
- not overwhelming

Navigation should make it obvious:
- what StayFunded is
- where value lives
- what is free vs paid
- how to start

No page should feel “orphaned.”
Everything ladders back to Flight Plans.


## Top-Level Navigation (Primary)

Visible on all pages.

1. Firms
2. Flight Plans
3. Calculators
4. AI Lab
5. Pricing
6. Sign In / Account

Notes:
- “Firms” doubles as Discovery
- “Flight Plans” is the product
- Calculators and AI Lab are supporting tools, not the hero
- Pricing is always visible


## Footer Navigation (Secondary)

Footer appears on all pages.

### Company
- About
- Contact
- Terms
- Privacy
- Disclaimer

### Product
- Flight Plans
- Firms
- Fine Print
- Calculators
- AI Lab

### Affiliates
- Affiliate Program
- Affiliate Login
- Resources

### Legal
- Terms of Service
- Privacy Policy
- Risk Disclaimer


## Page Inventory (v1)

### Public Pages (No Auth)

- `/` (Home)
- `/firms`
- `/firms/[firm]`
- `/firms/[firm]/rules`
- `/firms/[firm]/fine-print` (preview)
- `/pricing`
- `/about`
- `/contact`
- `/affiliate`
- `/terms`
- `/privacy`
- `/disclaimer`


### Authenticated Pages (Free + Pro)

- `/account`
- `/plans` (list)
- `/plans/new`
- `/plans/[plan_id]`
- `/calculators` (limited)
- `/ai-lab` (limited)


### Pro-Only Pages

- `/plans/[plan_id]` (full)
- `/calculators/*`
- `/ai-lab/*`
- `/firms/[firm]/fine-print` (full)


### Affiliate Pages

- `/affiliate/login`
- `/affiliate/dashboard`
- `/affiliate/resources`
- `/affiliate/links`
- `/affiliate/payouts`


## Page Structure Conventions

Every page must have:
- clear page title
- short explanation of purpose
- visible next action

Avoid:
- long scroll walls without structure
- hidden CTAs
- ambiguous page intent


## Home Page Intent (Reminder)

The home page must answer:
1. Why prop firms exist
2. Why traders fail
3. Why rules change behavior
4. Why phases matter
5. Why StayFunded exists
6. Why Flight Plans are worth paying for

The home page is not a blog.
It is a product explanation.


## Canonical Lock

Navigation exists to:
- orient
- reassure
- guide

If a user feels lost,
the navigation has failed.

## Section 17 — Affiliate Program and Growth Engine

### Purpose

Affiliate marketing is a primary growth channel for StayFunded.

The affiliate experience must be:
- simple
- transparent
- trustworthy
- easy to sell

Affiliates should feel:
“If I send someone here, they’ll understand the value — and I’ll get paid.”


## Core Philosophy

We do not recruit “marketers.”
We empower:
- traders
- educators
- influencers
- community leaders

Affiliates sell StayFunded because:
- it aligns with their audience’s pain
- it protects traders
- it explains why prop firms win


## Affiliate Roles

Affiliate is a role layered on top of:
- Free User
- Pro User

Affiliates must:
- have an account
- agree to affiliate terms


## Affiliate Onboarding Flow

1. User applies or opts into Affiliate Program
2. Terms acceptance
3. Affiliate dashboard created
4. Unique referral code generated
5. Access to resources unlocked


## Affiliate Dashboard

Route:
- `/affiliate/dashboard`

Displays:
- referral link(s)
- referral code
- total clicks
- signups
- paid conversions
- earnings to date
- payout status


## Referral Mechanics

- Each affiliate has a unique referral code
- Code is embedded in:
  - signup links
  - pricing links
  - firm links
- Code persists via cookies + account association


## Attribution Rules (v1)

- Last-touch attribution
- Cookie window: 30 days
- Referral tied to user account at signup

No multi-touch attribution in v1.


## Affiliate Payouts

- Payouts via Stripe
- Monthly payout cadence
- Minimum payout threshold (e.g., $50)

Affiliate dashboard shows:
- pending earnings
- approved earnings
- paid earnings


## Affiliate Resources Hub

Route:
- `/affiliate/resources`

Includes:
- logos
- brand guidelines
- approved messaging
- screenshots
- explainer PDFs
- sample copy
- talking points

Messaging must be:
- compliant
- honest
- non-promissory
- aligned with product ethos


## Prohibited Affiliate Claims

Affiliates may NOT claim:
- guaranteed profits
- passing rates
- “beat the system”
- inside access to firms
- trading signals

Violations result in:
- warning
- suspension
- termination


## Growth Flywheel

Affiliates drive:
- Discovery traffic
- Education-first trust
- Product-led conversion

StayFunded supports them by:
- reducing friction
- giving clear narratives
- making the product easy to explain


## Canonical Lock

The affiliate program exists to:
- amplify trust
- distribute education
- reward alignment

If affiliates have to “invent” selling points,
the product messaging has failed.

## Section 18 — About, Contact, and Trust Pages

### Purpose

These pages exist to:
- establish legitimacy
- reduce skepticism
- answer “who is behind this?”
- satisfy due diligence instincts

They should feel:
- professional
- grounded
- honest
- not over-branded


## About Page

Route:
- `/about`

### About Page Goals

The About page must:
- explain why StayFunded exists
- explain what it is NOT
- avoid guru narratives
- avoid founder worship
- reinforce trader-first alignment


### About Page Content Structure

1. The Problem
   - Prop firms are designed to protect capital
   - Most traders misunderstand this
   - Failure is often structural, not skill-based

2. Our Point of View
   - Rules change what “good trading” means
   - Phases matter
   - Firms optimize for survival and profitability

3. What StayFunded Is
   - A phase-based companion
   - A rule-aware system
   - An educational product
   - Not a signal service

4. What StayFunded Is Not
   - Not a trading course
   - Not a strategy provider
   - Not affiliated with prop firms

5. Who It’s For
   - Serious traders
   - Traders using prop firms
   - Traders who want clarity, not hype


Tone:
- calm
- factual
- confident
- not salesy


## Contact Page

Route:
- `/contact`

### Contact Page Purpose

The Contact page exists to:
- provide a legitimate communication channel
- support users
- satisfy trust requirements


### Contact Form Fields

- Name
- Email
- Topic (dropdown)
  - General
  - Support
  - Billing
  - Affiliate
- Message

Form behavior:
- email delivery
- confirmation message
- no live chat in v1


## Trust Pages

### Terms of Service
Route:
- `/terms`

Must include:
- no financial advice disclaimer
- no performance guarantees
- educational-only positioning
- subscription terms
- affiliate disclosure


### Privacy Policy
Route:
- `/privacy`

Must include:
- data collected (email only)
- cookies
- analytics
- affiliate tracking
- third-party services


### Risk Disclaimer
Route:
- `/disclaimer`

Must state:
- trading is risky
- prop firm trading has additional constraints
- StayFunded does not guarantee outcomes
- users are responsible for decisions


## Visual Treatment

These pages should be:
- simple
- readable
- low on visuals
- high on clarity

No hero animations.
No aggressive CTAs.


## Canonical Lock

Trust pages exist to:
- reduce doubt
- protect the business
- reinforce seriousness

If these pages feel “thin,”
the product will feel untrustworthy.

## Section 19 — Technology Stack and Architecture

### Purpose

This section defines the **canonical technology decisions** for StayFunded.

These choices are made to:
- move fast
- reduce complexity
- minimize future rewrites
- keep the system understandable by another AI or developer

No experimentation unless explicitly approved later.


## Frontend

### Framework
- Next.js (App Router)
- TypeScript
- Tailwind CSS

Rationale:
- fast iteration
- strong ecosystem
- server components where useful
- SEO-friendly for firm pages


### Styling
- Tailwind CSS only
- no component libraries (v1)
- no design systems beyond Tailwind tokens

Design goals:
- calm
- high-contrast
- readable
- professional
- not flashy


## Backend / Data Layer

### Primary Backend
- Supabase

Supabase is used for:
- authentication
- user data
- Flight Plans
- affiliate tracking
- subscriptions metadata

No custom backend in v1.


### Database (Postgres via Supabase)

Primary tables:

- users (managed by Supabase auth)
- user_profiles
- subscriptions
- firms
- firm_rules
- fine_print_entries
- flight_plans
- affiliate_profiles
- affiliate_referrals
- affiliate_payouts

All data models must support:
- read-heavy access
- simple writes
- minimal joins


## Authentication

Handled by Supabase Auth:
- magic link
- Google OAuth
- email/password fallback

No custom auth logic.


## Payments

### Payment Processor
- Stripe

Used for:
- Pro subscription ($149/year)
- affiliate payouts

No alternative processors in v1.


### Subscription Logic

- single plan: Pro
- yearly billing
- no trials (unless added later)
- upgrade-only (no downgrade in v1)


## Affiliate Tracking

- referral codes stored in database
- cookies for attribution
- Stripe for payout calculation

No third-party affiliate software in v1.


## Hosting & Infrastructure

- Vercel (recommended)
- Supabase-hosted database
- Stripe-hosted billing

No server maintenance required.


## Analytics

- Privacy-first analytics (e.g., Plausible or Vercel Analytics)
- No invasive tracking
- Focus on:
  - page views
  - conversions
  - funnel drop-offs


## Email

- Transactional emails via Supabase / SMTP
- Use for:
  - magic links
  - receipts
  - affiliate notifications
  - basic support replies

No marketing drip campaigns in v1.


## What We Explicitly Do NOT Build in v1

- Mobile apps
- Trading account integrations
- Broker APIs
- Real-time data feeds
- Journaling
- Strategy backtesting
- Community forums
- Chat features


## Security & Compliance

- HTTPS everywhere
- no storage of trading credentials
- no financial advice claims
- GDPR-compliant basics
- simple data retention policy


## Canonical Lock

This stack is chosen to:
- minimize engineering risk
- maximize clarity
- keep the product buildable by a single founder + AI

Any deviation from this stack
requires explicit justification.

## Section 20 — Canonical Documents, Thread Bootstrap, and Process

### Purpose

This section defines how StayFunded work proceeds **without relitigating decisions**.

The goal:
- preserve momentum
- prevent scope drift
- ensure every new thread starts aligned
- allow any AI to contribute effectively


## Canonical Documents (Required)

These documents are the **source of truth**.

If a thread does not have them, it must immediately ask for them.

### Required in Every Build Thread

1. `stayfunded-build-blueprint.md`  ← THIS DOCUMENT
2. `README.md` (repo overview + how to run locally)
3. `schema.sql` (database schema)
4. `routes.md` (generated from Section 16)
5. `copy.md` (approved page copy snippets, optional but recommended)

If any are missing:
> “Please upload the canonical documents before we proceed.”


## Document Hierarchy

Priority order:
1. Build Blueprint
2. Database Schema
3. Routes
4. Page Code
5. Thread Conversation

If a conflict exists:
- the Blueprint wins


## Thread Bootstrap (Carry-Over Template)

Every new thread must start with:

> “This project uses a canonical build blueprint.
> Do not redesign product direction.
> Do not rename core concepts.
> Ask for missing canonical documents before proceeding.”

The user should then upload:
- `stayfunded-build-blueprint.md`
- current `/src` folder (if relevant)


## Allowed Changes

Changes may occur if:
- explicitly requested by the user
- documented as a revision
- appended to the blueprint with a version note

No silent reinterpretation.


## How to Use This Blueprint

This document is used to:
- build pages
- write copy
- define database schema
- design flows
- validate features
- onboard collaborators (human or AI)

It should be referenced:
- before writing code
- before changing UI
- before adding features


## Archiving Old Documents

Old planning docs should:
- be moved to `/docs/archive`
- include a warning at top:
  “Archived — superseded by stayfunded-build-blueprint.md”

This prevents future confusion.


## Scope Discipline Rules

If a feature does not:
- support Flight Plans
- support Discovery
- support Fine Print
- support Calculators
- support AI Lab
- support Affiliates

…it does not belong in v1.

## Core Product Terminology (Authoritative)

StayFunded is a **playbook-driven lifecycle system**, not a tools library, course platform, or signals product.

### Playbooks (Primary Value Unit)
A **Playbook** is the core product artifact in StayFunded.

Playbooks are:
- Firm-specific
- Phase-specific
- Non-prescriptive (no trade calls)

A Playbook defines:
- The objective of the current phase (what success actually means here)
- The primary risk that ends accounts in this phase
- Common failure modes
- Professional posture and behavior
- What to ignore
- How this phase ends and what changes next

Playbooks do **not** tell traders what to trade.
They define how to survive, operate, and advance within the rules of the account.

If any section of this blueprint uses language such as “guides,” “resources,” “strategies,” or “education,” those concepts should be interpreted as **Playbooks** unless explicitly stated otherwise.

The authoritative conceptual definition of Playbooks lives in:
`/docs/core product model - Playbooks.md`

---

### Paths (Lifecycle Containers)
A **Path** is a lifecycle container that sequences Playbooks across a prop firm account’s phases.

Paths:
- Are firm-specific
- Represent **account state**, not content progress
- Gate which Playbooks are accessible
- Will later control permissions (including social access)

A Path does not imply completion or graduation.
It reflects where an account currently exists in its lifecycle.

---

### Phases
A **Phase** represents the current structural context of a prop firm account (e.g. Evaluation, Funded, Payout).

Phases:
- Change the objective of trading
- Change which risks dominate
- Change which Playbooks are active

The same trader behavior may be correct in one phase and destructive in another.

---

### Account State (Implementation Requirement)
At all times, an account must be able to answer:
- Which firm is this account with?
- Which phase is it currently in?
- Which Path is active?
- Which Playbooks are unlocked?

Account state is **not** inferred from content consumption.
It is explicit and authoritative.

---

### Non-Negotiables
StayFunded is **not**:
- A signals product
- A coaching system
- A course platform
- A personality-driven community

There are:
- No trade calls
- No guru feeds
- No opinion-driven chat

If a design or implementation decision creates ambiguity here, it is wrong.



## Canonical Lock (Final)

This blueprint is:
- the north star
- the decision boundary
- the guard against drift

All future work must reference it.

No exceptions.
