# Change Spec — Remove Discovery from public surfaces

## Goal
Discovery should be removed/hidden for now. Do not promote it on public pages.

## Required changes
1) src/app/pricing/page.tsx
- Remove "Discovery" from:
  - MiniCompare grid row "Discovery (firm structure & constraints)"
  - Free plan bullets ("Discovery ...")
- Replace with nothing (do not add a substitute feature).
- Leave Strategy Analysis and Rule Changes tracking.

## Constraints
- Do not delete the /discovery route (if it exists). Just stop promoting it publicly.
- Do not change pricing tier pricing/CTAs.
