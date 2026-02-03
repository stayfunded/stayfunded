# Change Spec — Public link hygiene (remove legacy marketing)

## Rule
Public pages should not link to or promote these routes:
- /today
- /playbooks
- /accountability
- /discovery

## Allowed public routes
- /framework
- /recovery
- /strategy-analysis
- /pricing
- /why
- /login
- /dashboard (only via auth button)
- /account (if that is the current signup route)

## Required changes
- src/app/page.tsx: remove any links/buttons pointing to disallowed routes
- src/app/framework/page.tsx: same
- src/app/pricing/page.tsx: ensure no mention of Discovery remains
- src/components/TopNav.tsx: already compliant; do not change unless needed
