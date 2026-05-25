"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { Logo } from "@/components/site/Logo";
import { getGsap } from "@/lib/motion/gsap";

const nav = [
  { href: "/admin", label: "Overview", Icon: GridIcon },
  { href: "/admin/designs", label: "Designs", Icon: PhotoIcon },
  { href: "/admin/users", label: "Users", Icon: UsersIcon },
  { href: "/admin/settings", label: "Settings", Icon: GearIcon },
];

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

export function AdminSidebar({ onNavigate } = {}) {
  const pathname = usePathname() || "";
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReduced) return;

    const { gsap } = getGsap();
    const items = el.querySelectorAll("[data-nav-item]");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { x: -10, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, ease: "expo.out" },
      );
      if (items.length) {
        gsap.fromTo(
          items,
          { x: -10, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.65, ease: "power3.out", stagger: 0.06, delay: 0.08 },
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <aside
      ref={ref}
      className="relative h-full overflow-hidden border-r border-card-border/70 bg-background/55 backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 -top-28 h-[360px] w-[360px] rounded-full bg-green/10 blur-3xl" />
        <div className="absolute -right-28 bottom-[-140px] h-[420px] w-[420px] rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.4),transparent_55%)]" />
        <div className="absolute inset-y-0 right-0 w-px bg-[linear-gradient(180deg,transparent,color-mix(in_oklab,var(--gold)_22%,transparent),transparent)]" />
      </div>

      <div className="relative px-6 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-card-border bg-black/10">
            <Logo variant="icon" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold tracking-tight text-foreground">
              YardCraft Admin
            </div>
            <div className="truncate text-xs font-medium tracking-[0.14em] uppercase text-muted">
              Invite-only dashboard
            </div>
          </div>
        </div>
        <div className="mt-5 h-px w-full bg-card-border/70" />
      </div>

      <nav className="relative flex flex-col gap-1 px-4 pb-6">
        {nav.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              data-nav-item
              onClick={() => onNavigate?.()}
              className={cx(
                "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition will-change-transform",
                active
                  ? "bg-white/10 text-foreground shadow-[0_0_0_1px_color-mix(in_oklab,var(--gold)_25%,transparent)]"
                  : "text-muted hover:bg-white/5 hover:text-foreground hover:translate-x-[2px]",
              )}
            >
              <span
                className={cx(
                  "grid h-10 w-10 place-items-center rounded-2xl border border-card-border bg-black/10 transition will-change-transform",
                  active
                    ? "text-[color-mix(in_oklab,var(--green-bright)_55%,white)]"
                    : "text-muted group-hover:text-foreground group-hover:scale-[1.03]",
                )}
              >
                <item.Icon className="h-4.5 w-4.5" />
              </span>
              <span className="font-semibold tracking-tight">{item.label}</span>
              {active ? (
                <span className="ml-auto h-2 w-2 rounded-full bg-[color-mix(in_oklab,var(--green)_70%,var(--gold))]" />
              ) : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function GridIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhotoIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M5 6h14v12H5V6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 11.5 11 14l2-2 3.5 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 9.2h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UsersIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M16 19c0-2.2-1.8-4-4-4s-4 1.8-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 12a3.2 3.2 0 1 0 0-6.4A3.2 3.2 0 0 0 12 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M19.2 19c0-1.7-1.1-3.1-2.6-3.7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

function GearIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M19 12a7 7 0 0 0-.1-1l2-1.2-2-3.5-2.3.8a7.7 7.7 0 0 0-1.7-1L14.6 3h-5.2L9 6.1a7.7 7.7 0 0 0-1.7 1L5 6.3 3 9.8 5 11a7 7 0 0 0 0 2l-2 1.2 2 3.5 2.3-.8a7.7 7.7 0 0 0 1.7 1l.4 3.1h5.2l.4-3.1a7.7 7.7 0 0 0 1.7-1l2.3.8 2-3.5-2-1.2c.1-.3.1-.7.1-1Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
        opacity="0.75"
      />
    </svg>
  );
}

