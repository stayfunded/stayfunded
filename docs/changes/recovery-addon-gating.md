# Change Spec — Recovery add-on (post-auth gating)

## Goal
Recovery is a paid add-on that:
- Requires an active Framework membership (Pro or Lifetime)
- Is enabled/managed per account (account-level toggle)
- Is not marketed as a separate “main product” post-auth; it’s a layer you activate

## Definitions
- Framework Membership = Pro monthly OR Lifetime
- Recovery Add-on = $299 month one, then $99/mo starting month two (cancel anytime)

## Requirements (v0)
1) Public
- /recovery must clearly state: requires active Framework membership.
- /pricing must list Recovery as an add-on.

2) Post-auth UX (must exist even if payments aren’t wired yet)
- On the account view page (dashboard account detail), add:
  - A “Recovery” section with:
    - Status: Not active / Active
    - Button: “Activate Recovery” (if eligible) or “Requires Framework membership”
- Activation behavior (v0):
  - If user not eligible: show a modal explaining membership requirement + link to /pricing
  - If eligible: show a modal “Recovery activation is coming” (until Stripe is wired)

## Constraints
- No new nav items.
- Do not change existing account logic; only add the Recovery section and conservative gating.
- No promises/outcome claims.
