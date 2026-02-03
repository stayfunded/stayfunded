// src/components/TopNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type NavItem = {
  label: string;
  href: string;
  note?: string;
};

export default function TopNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authed, setAuthed] = useState(false);

  // Auth state (client) — only used for the right-side Login/Dashboard button
  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!cancelled) setAuthed(!!data?.user?.id);
    }

    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthed(!!session?.user?.id);
    });

    return () => {
      cancelled = true;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  /**
   * LOCKED top-level nav:
   * Framework, Recovery, Strategy Analysis, Pricing, Why
   * (No Today/Playbooks/Accountability/Discovery in nav)
   */
  const primaryItems: NavItem[] = useMemo(() => {
    return [
      { label: "Framework", href: "/framework", note: "How the system works" },
      { label: "Recovery", href: "/recovery", note: "30-day reset layer" },
      {
        label: "Strategy Analysis",
        href: "/strategy-analysis",
        note: "Free analysis (no signals)",
      },
      { label: "Pricing", href: "/pricing", note: "Membership + Recovery add-on" },
      { label: "Why", href: "/why", note: "Founder story" },
    ];
  }, []);

  const accountHref = authed ? "/dashboard" : "/login";
  const accountLabel = authed ? "Dashboard" : "Log in";

  const desktopLinkClass = (href: string) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      isActive(href)
        ? "text-white bg-white/10 ring-1 ring-white/10"
        : "text-white/80 hover:text-white hover:bg-white/5"
    }`;

  const mobileItemClass = (href: string) =>
    `rounded-xl px-4 py-2.5 text-sm font-semibold ${
      isActive(href)
        ? "bg-white text-black"
        : "bg-white/5 text-white/85 hover:bg-white/10"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0B1022]/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 min-w-[240px]">
          <div>
            <div className="text-sm font-semibold tracking-tight text-white">
              Stay<span className="text-amber-400">Funded</span>
            </div>
            <div className="text-[11px] text-white/60">
              The{" "}
              <span className="text-amber-400 font-semibold">framework</span> for
              staying funded.
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {primaryItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              title={item.note}
              className={desktopLinkClass(item.href)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/strategy-analysis"
            className="hidden sm:inline-flex rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300"
          >
            Start Strategy Analysis (Free)
          </Link>

          <Link
            href={accountHref}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90"
          >
            {accountLabel}
          </Link>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/85 hover:bg-white/10"
            aria-expanded={mobileOpen}
            aria-label="Open menu"
          >
            Menu
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0B1022]/95">
          <div className="px-4 py-4 grid gap-2">
            <Link
              href="/strategy-analysis"
              className="rounded-xl bg-amber-400 px-4 py-3 text-sm font-semibold text-black hover:bg-amber-300"
            >
              Start Strategy Analysis (Free)
            </Link>

            <div className="grid gap-2">
              {primaryItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={mobileItemClass(item.href)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <Link
              href={accountHref}
              className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-white/90"
            >
              {accountLabel}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
