# 00 — Tech Stack (StayFunded v0)
⚠️ Archived: Created before the product canon was locked.
Not authoritative. Reference only if explicitly instructed.


This document defines the technology stack and deployment approach for StayFunded v0.
The primary goal is speed, reliability, and low operational overhead — not technical novelty.

StayFunded is a **content-heavy, logic-driven web app** with light interactivity in v0.
We optimize for:
- fast launch
- easy iteration
- affiliate friendliness
- predictable costs

---

## Core Stack

### Frontend
- **Next.js (App Router)**
- **React**
- **Tailwind CSS (v4)**

Rationale:
- Server-rendered pages for SEO and affiliates
- Simple routing and layouts
- Fast iteration without framework friction
- Easy upgrade path to dashboards and gated tools

---

### Styling
- **Tailwind CSS v4**
- No component libraries in v0
- No dark/light toggle in v0 (theme decisions are deliberate and centralized)

Rationale:
- Full control over authority / premium feel
- Avoids over-abstracted UI kits
- Keeps design intentional and minimal

---

### Authentication
- **NextAuth (Auth.js)**

Login methods:
- Google
- Apple
- Email magic link

Rationale:
- Zero-friction onboarding
- Expected by modern users
- Affiliate traffic converts better with social login

---

### Database
- **Postgres**
- Hosted via **Supabase** or **Neon**

Used for:
- user accounts
- firm selection
- subscription state
- affiliate attribution
- saved calculators / preferences (later)

Rationale:
- Boring, reliable, cheap
- Strong support for analytics and future AI features

---

### Payments
- **Stripe**

Plans:
- Free tier
- Paid tier ($149 target)
- Monthly or lifetime (decision deferred)

Stripe handles:
- checkout
- subscriptions
- invoices
- webhooks

---

### Affiliate Tracking (Day One Requirement)
- **Rewardful** or **FirstPromoter**

Requirements:
- Referral links
- Cookie-based attribution
- Stripe integration
- Payout reporting

Rationale:
- Traders trust peer recommendations
- Affiliate adoption is a core growth lever
- Must be live at launch, not “later”

---

### Email & Notifications
- **Resend** or **Postmark**

Used for:
- account emails
- high-impact news alerts
- firm rule updates
- onboarding nudges

SMS is **not v0**.

---

### Hosting & Deployment
- **Vercel**

Rationale:
- Native Next.js support
- Fast global CDN
- Zero DevOps burden
- Easy environment management

---

## What We Are Explicitly NOT Doing in v0

- No mobile app
- No real-time trading data
- No live brokerage connections
- No signals
- No AI trade recommendations
- No complex dashboards
- No journaling

StayFunded v0 is **infrastructure and clarity**, not execution.

---

## AI Positioning (v0)

AI is exposed as a **research enabler**, not a decision engine.

v0 includes:
- downloadable tick data
- curated prompt packs
- structured research questions

v0 does NOT include:
- AI predictions
- AI trade advice
- AI account coaching

---

## Summary

This stack is designed to:
- launch fast
- feel professional
- support hundreds of affiliates
- scale in complexity only after revenue validation

Every technical choice favors **clarity, reliability, and speed** over ambition.

## Tailwind (LOCKED)
- Tailwind is required and must be stable before feature work.
- Use Tailwind utilities for styling (avoid inline styles in pages/components).
- Repo is currently on Tailwind v4 (tailwindcss@4.x + @tailwindcss/postcss + @tailwindcss/node).
- `src/app/globals.css` uses: `@import "tailwindcss";`
