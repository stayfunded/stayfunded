# StayFunded — Product Requirements Document
## v1 (Full Website)

---

## Product Goal

Help prop firm traders adapt their trading behavior to firm rules and account phases so they can survive evaluations, stabilize funded accounts, and reach payouts.

---

## Site Architecture

Public (no auth)
- Home
- Firms index
- Individual firm pages
- Industry explanations
- Rule breakdowns

Authenticated (free)
- Save firms
- View limited Flight Plan previews
- Basic calculators
- Limited AI Lab access

Paid (Pro)
- Full Flight Plans
- Phase-specific guidance
- Black Book rule explanations
- Full calculators
- Full AI Lab

---

## Core Pages

### Home (/)

Purpose:
- establish the core belief
- frame trading as phase-dependent
- position StayFunded as “us vs the system”

Messaging pillars:
- prop firms are not neutral
- rules exist to protect firms
- good trading changes by phase
- StayFunded helps you adapt

CTA:
- Explore firms
- Start with Discovery

---

### Firms Index (/firms)

Purpose:
- discovery entry point
- compare firms structurally, not by marketing

Content:
- firm summaries
- evaluation types
- rule highlights
- “who this firm works for / doesn’t”

---

### Firm Detail Page (/firms/[firm])

Purpose:
- deep intelligence layer

Sections:
- firm overview
- rule breakdowns
- incentive analysis
- “the fine print”
- common trader mistakes
- platform quirks

CTA:
- Start a Flight Plan with this firm

---

### Flight Plan (/flight-plan)

Authenticated.

User inputs:
- firm
- account type
- current phase

Output:
- phase summary
- what matters now
- behavior adjustments
- black book insights
- curated resources

Phase switching allowed.

---

### Calculators (/calculators)

Constraint-first tools:
- loss capacity
- max risk per trade
- survivability buffers

Firm-aware where relevant.

---

### AI Lab (/ai-lab)

Purpose:
- enable traders to do AI-assisted analysis themselves

Includes:
- prompts
- workflows
- tick data guidance
- examples

Explicitly no signals.

---

## Auth & Accounts

Auth:
- email + password
- magic link optional

User model:
- saved firms
- saved flight plans
- subscription status

---

## Data Model (Initial)

User
- id
- email
- plan

Firm
- id
- name
- rules (structured)
- incentives

FlightPlan
- id
- user_id
- firm_id
- phase
- created_at

---

## Visual Style

- serious
- high-contrast
- dark hero sections
- minimal illustration
- diagram-based visuals
- no gimmicks

---

## Monetization

Plans:
- Free
- Pro ($149/year)

Pro unlocks:
- full Flight Plans
- black book explanations
- advanced calculators
- full AI Lab

---

## Explicit Non-Goals

- trading education
- signal service
- social features
- coaching
- broker integration

---

## Success Criteria

A trader should say:
“I can’t imagine trading a prop firm account without this.”

---

## Canon Compliance

All features must align with the canonical product definition.
