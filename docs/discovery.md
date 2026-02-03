Discovery — Canonical Specification

Status: LOCKED
Audience: Anonymous + authenticated traders
Surface: Public, facts-first, conversion-oriented
Last updated: 2026-01-02

1. Purpose (Non-Negotiable)

Discovery exists to help traders:

Identify which prop firm + account best fits them

Understand why that recommendation is made

See explicit tradeoffs (rules, costs, restrictions, odds)

Purchase the recommended account via StayFunded affiliate links

Discovery is:

Free to use

Public

Immediate (no onboarding or quiz)

Explainable, not opinionated

Discovery is the primary acquisition and intent-capture surface for StayFunded.

2. What Discovery Is Not

Discovery is not:

A quiz

A scoring engine

A personalization flow

A learning product

A community or social surface

A paywalled feature

Discovery never:

Forces account creation

Asks “how do you trade?” up front

Shows ratings, percentages, or probability claims

Uses influencer or testimonial content

3. Discovery Modes (Locked)
3.1 Facts-First Discovery (Primary)

Default mode. Always used on first load.

Designed for:

Skeptical traders

Traders already using a prop firm

Traders who want answers without introspection

Inputs (hard facts only):

Account price

Reset / monthly fees

Rule constraints (drawdown, daily loss, time pressure)

Scaling mechanics

Payout rules

Phase structure

Outputs:

One primary recommended account

Ranked alternatives

Plain-English reasoning

Explicit tradeoffs

Affiliate purchase CTA

This mode is non-optional and must always work with zero input.

3.2 Consultative Discovery (Secondary, Optional)

Opt-in only

Skippable at any step

Light constraint toggles only

Possible inputs:

Avoid trailing drawdown

Minimize monthly fees

Avoid inactivity rules

Prefer fewer phases

No sliders.
No “risk tolerance.”
No personality language.

4. Route & Entry Points
Route

/discovery (canonical)

Entry Points

Homepage (primary CTA)

Top navigation (first-class item)

Firms pages (/firms/*)

Rules pages (/rules/*)

Discovery must render immediately on entry.

5. Zero-Input Default Behavior (Critical)

On first load, Discovery:

Produces a recommendation immediately

Uses internal “house defaults” based on common failure patterns

Does not display assumptions explicitly

Default orientation:

Evaluation phase focus

Avoids trailing drawdown where possible

Prefers fewer “kill rules”

Minimizes reset exposure

Penalizes time pressure

UI framing:

“Based on common failure patterns across prop firms.”

6. Data Model (Facts-First)
6.1 Core Entities
Firm

firmSlug

displayName

affiliateTemplate (optional initially)

Account

accountId

firmSlug

accountName

accountSize

phaseStructure

priceInitial

priceReset

monthlyFee

purchaseUrl

AccountRuleProfile

accountId

phase

ruleFacts[]

Each rule fact includes:

ruleSlug

label

value

severity (kill | constraint | friction)

source (optional)

6.2 Derived Outputs (Computed)
Cost Model

Typical cost to get funded

Reset exposure

Carrying cost visibility

Rule Risk Surface

Kill rules

Time pressure rules

Variance amplifiers

Tradeoff Deltas

Cost differences

Rule differences

Phase differences

No numeric scoring.
No weighted ratings.

7. Ranking Logic (Explainable, Non-Scored)

Ranking follows this order:

Apply hard disqualifiers (user constraints, if any)

Reduce exposure to kill rules in evaluation

Break ties via total cost + reset exposure

Present alternatives with explicit “why not #1” reasoning

Discovery always outputs:

One primary recommendation

Ranked alternatives

Tradeoffs

8. UI Components (Locked)
8.1 DiscoveryHeader

Headline

Subhead

Mode pill (“Facts-first”)

“Adjust constraints” link

8.2 PrimaryRecommendationCard (Hero)

Firm + account identity

“Recommended” tag

Signal triplet:

Cost reality

Kill rules count

Time pressure level

“Why this wins” (3–6 bullets)

Primary CTA: Buy this account

Secondary link: Compare alternatives

8.3 TradeoffDisclosure

Collapsed by default

Mandatory

2–4 bullets

Honest negatives only

8.4 RankedAlternativeCard

Rank badge

Compact signals

“Why not #1” explainer

No CTAs

8.5 ComparisonTable

Rows (locked):

Initial cost

Reset / monthly fees

Drawdown type

Daily loss behavior

Time pressure rules

Scaling limits

Phase structure

Payout constraints

Differences highlighted only.

8.6 RuleInlineExplainer

“Why this rule matters”

1–2 sentence explanation

Link to canonical rule page

8.7 BottomReinforcementCTA

One framing sentence

Repeat primary CTA

Optional soft link to Playbooks

9. Copy Guardrails (Strict)

Allowed language:

“Reduces failure pressure”

“Increases forcing behavior”

“Makes normal variance dangerous”

Banned language:

Best / optimal / perfect

Scores / ratings

Win rates

Guarantees

“For your trading style”

Discovery speaks in mechanics, not promises.

10. Flow Summary

User lands on /discovery

Immediate recommendation renders

User may:

Buy recommended account

Compare alternatives

Drill into rules

Leave to firms / rules / pricing

All exits are valid outcomes.

11. Explicit Non-Goals (Deferred)

Discovery explicitly does not include:

Firm ranking hubs

Cross-firm scoreboards

Trader-submitted reviews

Surveys or polls

Discord incentives

Social proof

These are post-Discovery features.

12. Change Control

Any future change to Discovery must:

Reference this document

State what is being modified

Update this document

Otherwise, defaults revert here.