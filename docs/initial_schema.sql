-- StayFunded Initial Schema (v1) — UPDATED
-- Product intent source of truth:
-- - /docs/core product model - Playbooks.md (authoritative)
--
-- IMPORTANT MODEL ALIGNMENT:
-- - Path Templates = lifecycle templates (firm-specific)
-- - Paths (current implementation) = Account instances (per user)
--   We keep the table name `paths` to avoid breaking the app code,
--   but conceptually it is an Account instance record.
--
-- Notes:
-- - Assumes Supabase (Postgres) with Supabase Auth enabled.
-- - Do NOT store trading credentials, broker logins, or prop-firm credentials.
-- - We reference auth.users via user_id UUID.

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- ENUMS
-- ------------------------------------------------------------

do $$ begin
  create type public.plan_tier as enum ('free', 'pro');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.user_role as enum ('user', 'affiliate', 'admin');
exception
  when duplicate_object then null;
end $$;

-- Phase enum is used as the Account "current_phase" and Playbook "phase".
-- Keep names phase-centric; no progress semantics.
do $$ begin
  create type public.account_phase as enum ('discovery', 'evaluation', 'stabilization', 'payout', 'maintenance');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.subscription_status as enum ('inactive', 'active', 'canceled', 'past_due');
exception
  when duplicate_object then null;
end $$;

-- ------------------------------------------------------------
-- USERS / PROFILES
-- ------------------------------------------------------------

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  timezone text,
  experience_level text,
  referral_source text,

  -- Convenience pointer for routing (active account instance)
  active_path_id uuid,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan public.plan_tier not null default 'free',
  role public.user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- SUBSCRIPTIONS (Stripe)
-- ------------------------------------------------------------

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,

  status public.subscription_status not null default 'inactive',
  current_period_end timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);

-- ------------------------------------------------------------
-- FIRMS / RULES / FINE PRINT
-- ------------------------------------------------------------

create table if not exists public.firms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,              -- e.g. "topstep"
  name text not null,                     -- e.g. "Topstep"
  status text default 'active',           -- active/inactive (informational)
  short_description text,
  website_url text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_firms_slug on public.firms(slug);

create table if not exists public.firm_rules (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.firms(id) on delete cascade,

  category text not null,                 -- e.g. "drawdown", "daily_loss", "payouts", "scaling", "time_limits"
  rule_key text not null,                 -- stable internal key, e.g. "trailing_drawdown"
  title text not null,                    -- display title
  summary text not null,                  -- plain English summary (public)
  details text,
  example text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (firm_id, rule_key)
);

create index if not exists idx_firm_rules_firm_id on public.firm_rules(firm_id);

create table if not exists public.fine_print_entries (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.firms(id) on delete cascade,

  rule_key text not null,                 -- ties back to firm_rules.rule_key (soft link)
  title text not null,

  what_it_is text not null,
  why_firm_uses_it text not null,
  how_traders_get_hurt text not null,
  how_traders_adapt text not null,

  phase_relevance public.account_phase[] default '{}',
  severity int default 3,
  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (firm_id, rule_key)
);

create index if not exists idx_fine_print_firm_id on public.fine_print_entries(firm_id);

-- ------------------------------------------------------------
-- PLAYBOOKS (FIRST-CLASS)
-- ------------------------------------------------------------

create table if not exists public.playbooks (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.firms(id) on delete cascade,

  phase public.account_phase not null,
-- slug text not null,                 -- stable URL slug for /firms/[firm]/phases/playbooks/[slug]
-- NOTE: phase is gated by account state; phase is NOT in the URL
  title text not null,

  -- Optional v1 rendering: can be null if content is static in code initially.
  -- If stored, must remain aligned with canonical /docs playbooks.
  body_md text,

  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (firm_id, phase, slug)
);

create index if not exists idx_playbooks_firm_phase on public.playbooks(firm_id, phase);

-- ------------------------------------------------------------
-- PATH TEMPLATES (LIFECYCLE TEMPLATES)
-- ------------------------------------------------------------
-- Canon model: Paths are templates; Accounts are instances.
-- v1 implementation: we keep `paths` as the instance table (account),
-- and introduce `path_templates` for the template concept.

create table if not exists public.path_templates (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.firms(id) on delete cascade,

  slug text not null,                 -- stable internal slug, e.g. "topstep-standard"
  name text not null,                 -- display label, e.g. "Topstep (Standard)"
  description text,

  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (firm_id, slug)
);

create index if not exists idx_path_templates_firm_id on public.path_templates(firm_id);

-- ------------------------------------------------------------
-- PATHS (ACCOUNT INSTANCES / ACCOUNT STATE)
-- ------------------------------------------------------------
-- NOTE: This table is an ACCOUNT INSTANCE (per user). Name retained as `paths`
-- to match current code + routing. Treat each row as a single prop-firm account.

create table if not exists public.paths (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  firm_id uuid not null references public.firms(id) on delete restrict,
  firm_slug text,                         -- denormalized convenience; keep in sync in app

  -- Optional link to a Path Template (canonical model alignment)
  path_template_id uuid references public.path_templates(id) on delete set null,

  name text,                              -- optional user label (e.g. "Topstep 50K #1")

  current_phase public.account_phase not null default 'discovery',
  started_at timestamptz not null default now(),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_paths_user_id on public.paths(user_id);
create index if not exists idx_paths_firm_id on public.paths(firm_id);
create index if not exists idx_paths_path_template_id on public.paths(path_template_id);

-- Unlocked Playbooks per Account (explicit; no progress semantics)
create table if not exists public.path_playbook_unlocks (
  id uuid primary key default gen_random_uuid(),
  path_id uuid not null references public.paths(id) on delete cascade,
  playbook_id uuid not null references public.playbooks(id) on delete cascade,

  unlocked_at timestamptz not null default now(),

  unique (path_id, playbook_id)
);

create index if not exists idx_path_playbook_unlocks_path_id on public.path_playbook_unlocks(path_id);
create index if not exists idx_path_playbook_unlocks_playbook_id on public.path_playbook_unlocks(playbook_id);

-- Optional: read-only history of phase changes for an Account
create table if not exists public.path_phase_events (
  id uuid primary key default gen_random_uuid(),
  path_id uuid not null references public.paths(id) on delete cascade,
  from_phase public.account_phase,
  to_phase public.account_phase not null,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists idx_path_phase_events_path_id on public.path_phase_events(path_id);

-- Backfill: ensure user_profiles.active_path_id references paths
-- (FK added as separate statement so table exists)
do $$ begin
  alter table public.user_profiles
    add constraint fk_user_profiles_active_path
    foreign key (active_path_id) references public.paths(id) on delete set null;
exception
  when duplicate_object then null;
end $$;

-- ------------------------------------------------------------
-- AFFILIATES
-- ------------------------------------------------------------

create table if not exists public.affiliate_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,

  affiliate_code text not null unique,
  status text not null default 'active',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.affiliate_referrals (
  id uuid primary key default gen_random_uuid(),
  affiliate_user_id uuid not null references auth.users(id) on delete cascade,
  referred_user_id uuid references auth.users(id) on delete set null,

  referral_code text not null,
  landing_path text,
  utm_source text,
  utm_medium text,
  utm_campaign text,

  signed_up_at timestamptz not null default now(),
  converted_to_pro_at timestamptz,
  stripe_customer_id text,

  created_at timestamptz not null default now()
);

create index if not exists idx_affiliate_referrals_affiliate_user_id on public.affiliate_referrals(affiliate_user_id);
create index if not exists idx_affiliate_referrals_referred_user_id on public.affiliate_referrals(referred_user_id);

create table if not exists public.affiliate_payouts (
  id uuid primary key default gen_random_uuid(),
  affiliate_user_id uuid not null references auth.users(id) on delete cascade,

  period_start date not null,
  period_end date not null,

  amount_cents int not null,
  currency text not null default 'usd',

  status text not null default 'pending',
  stripe_transfer_id text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_affiliate_payouts_affiliate_user_id on public.affiliate_payouts(affiliate_user_id);

-- ------------------------------------------------------------
-- BASIC UPDATED_AT TRIGGERS
-- ------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

do $$ begin
  create trigger trg_user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger trg_user_entitlements_updated_at
  before update on public.user_entitlements
  for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger trg_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger trg_firms_updated_at
  before update on public.firms
  for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger trg_firm_rules_updated_at
  before update on public.firm_rules
  for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger trg_fine_print_updated_at
  before update on public.fine_print_entries
  for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger trg_playbooks_updated_at
  before update on public.playbooks
  for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger trg_path_templates_updated_at
  before update on public.path_templates
  for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger trg_paths_updated_at
  before update on public.paths
  for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger trg_affiliate_profiles_updated_at
  before update on public.affiliate_profiles
  for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger trg_affiliate_payouts_updated_at
  before update on public.affiliate_payouts
  for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------

alter table public.user_profiles enable row level security;
alter table public.user_entitlements enable row level security;
alter table public.subscriptions enable row level security;

alter table public.firms enable row level security;
alter table public.firm_rules enable row level security;
alter table public.fine_print_entries enable row level security;

alter table public.playbooks enable row level security;

alter table public.path_templates enable row level security;
alter table public.paths enable row level security;
alter table public.path_playbook_unlocks enable row level security;
alter table public.path_phase_events enable row level security;

alter table public.affiliate_profiles enable row level security;
alter table public.affiliate_referrals enable row level security;
alter table public.affiliate_payouts enable row level security;

-- ------------------------------------------------------------
-- USER PROFILES / ENTITLEMENTS
-- ------------------------------------------------------------

create policy "users read own profile"
on public.user_profiles
for select
using (auth.uid() = user_id);

create policy "users update own profile"
on public.user_profiles
for update
using (auth.uid() = user_id);

create policy "users read own entitlements"
on public.user_entitlements
for select
using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- SUBSCRIPTIONS
-- ------------------------------------------------------------

create policy "users read own subscription"
on public.subscriptions
for select
using (auth.uid() = user_id);

-- Inserts/updates handled server-side (Stripe webhooks)

-- ------------------------------------------------------------
-- FIRMS / RULES / FINE PRINT (PUBLIC READ)
-- ------------------------------------------------------------

create policy "public read firms"
on public.firms
for select
using (true);

create policy "public read firm rules"
on public.firm_rules
for select
using (true);

create policy "public read fine print"
on public.fine_print_entries
for select
using (true);

-- ------------------------------------------------------------
-- PLAYBOOKS (PUBLIC READ; GATING IN APP)
-- ------------------------------------------------------------

create policy "public read playbooks"
on public.playbooks
for select
using (true);

-- Writes restricted to service role / admin only (no client policies)

-- ------------------------------------------------------------
-- PATH TEMPLATES (PUBLIC READ)
-- ------------------------------------------------------------

create policy "public read path templates"
on public.path_templates
for select
using (true);

-- Writes restricted to service role / admin only

-- ------------------------------------------------------------
-- PATHS (ACCOUNT INSTANCES)
-- ------------------------------------------------------------

create policy "users read own paths"
on public.paths
for select
using (auth.uid() = user_id);

create policy "users create paths"
on public.paths
for insert
with check (auth.uid() = user_id);

create policy "users update own paths"
on public.paths
for update
using (auth.uid() = user_id);

-- Path -> Playbook unlocks
create policy "users read own path playbook unlocks"
on public.path_playbook_unlocks
for select
using (
  auth.uid() = (
    select user_id
    from public.paths
    where paths.id = path_playbook_unlocks.path_id
  )
);

-- Inserts/updates for unlocks should be server-side (rules engine / admin tooling),
-- but allow user insert if you want simple v1 unlock flows from the client.
create policy "users insert own path playbook unlocks"
on public.path_playbook_unlocks
for insert
with check (
  auth.uid() = (
    select user_id
    from public.paths
    where paths.id = path_playbook_unlocks.path_id
  )
);

-- Optional: phase events
create policy "users read own path phase events"
on public.path_phase_events
for select
using (
  auth.uid() = (
    select user_id
    from public.paths
    where paths.id = path_phase_events.path_id
  )
);

create policy "users insert own path phase events"
on public.path_phase_events
for insert
with check (
  auth.uid() = (
    select user_id
    from public.paths
    where paths.id = path_phase_events.path_id
  )
);

-- ------------------------------------------------------------
-- AFFILIATES
-- ------------------------------------------------------------

create policy "affiliates read own profile"
on public.affiliate_profiles
for select
using (auth.uid() = user_id);

create policy "affiliates update own profile"
on public.affiliate_profiles
for update
using (auth.uid() = user_id);

create policy "affiliates read own referrals"
on public.affiliate_referrals
for select
using (auth.uid() = affiliate_user_id);

create policy "affiliates read own payouts"
on public.affiliate_payouts
for select
using (auth.uid() = affiliate_user_id);

-- Inserts/updates for referrals and payouts handled server-side
-- =========================
-- Account Snapshots (v0)
-- =========================

create table if not exists public.account_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  account_id uuid not null references public.paths(id) on delete cascade,
  date date not null,

  balance numeric not null,
  remaining_drawdown numeric not null,
  drawdown_type text,

  days_used integer,
  days_remaining integer,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (account_id, date)
);

create index if not exists account_snapshots_user_date_idx
  on public.account_snapshots (user_id, date);

create index if not exists account_snapshots_account_date_idx
  on public.account_snapshots (account_id, date desc);

alter table public.account_snapshots enable row level security;

drop policy if exists "snapshots_select_own" on public.account_snapshots;
drop policy if exists "snapshots_insert_own" on public.account_snapshots;
drop policy if exists "snapshots_update_own" on public.account_snapshots;
drop policy if exists "snapshots_delete_own" on public.account_snapshots;

create policy "snapshots_select_own"
  on public.account_snapshots for select
  using (auth.uid() = user_id);

create policy "snapshots_insert_own"
  on public.account_snapshots for insert
  with check (auth.uid() = user_id);

create policy "snapshots_update_own"
  on public.account_snapshots for update
  using (auth.uid() = user_id);

create policy "snapshots_delete_own"
  on public.account_snapshots for delete
  using (auth.uid() = user_id);
