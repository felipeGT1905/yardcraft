"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Logo } from "@/components/site/Logo";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getGsap } from "@/lib/motion/gsap";

export function AdminShell({ title, children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const overlayRef = useRef(null);
  const drawerRef = useRef(null);

  const shellLeftPadding = "lg:pl-70";

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReduced) return;
    if (!drawerOpen) return;

    const overlay = overlayRef.current;
    const drawer = drawerRef.current;
    if (!overlay || !drawer) return;

    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power3.out" });
      gsap.fromTo(drawer, { x: -18, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: "expo.out" });
    }, overlay);

    return () => ctx.revert();
  }, [drawerOpen]);

  return (
    <div className="min-h-screen">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-44 left-1/2 h-140 w-140 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute top-20 -left-55 h-130 w-130 rounded-full bg-green/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_-160px,rgba(214,178,94,0.16),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.62),transparent_45%,rgba(0,0,0,0.7))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.65)_100%)]" />
      </div>

      {/* Fixed desktop sidebar */}
      <div className="hidden lg:block">
        <div className="fixed inset-y-0 left-0 z-40 w-70">
          <AdminSidebar />
        </div>
      </div>

      {/* Mobile / tablet drawer */}
      {drawerOpen ? (
        <div className="lg:hidden">
          <button
            ref={overlayRef}
            type="button"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <div
            ref={drawerRef}
            className="fixed inset-y-0 left-0 z-50 w-[86vw] max-w-[320px]"
          >
            <AdminSidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      ) : null}

      {/* Top header */}
      <header
        className={[
          "sticky top-0 z-30 border-b border-card-border/70 bg-background/70 backdrop-blur-xl",
          shellLeftPadding,
        ].join(" ")}
      >
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--green)_40%,transparent),color-mix(in_oklab,var(--gold)_40%,transparent),transparent)]" />

        <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-12">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-card-border bg-black/10 text-foreground transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
          >
            <MenuIcon className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <div className="text-sm font-semibold tracking-tight text-foreground">
                {title}
              </div>
              <div className="text-xs text-muted">YardCraft Admin</div>
            </div>
            <div className="lg:hidden flex items-center gap-2">
              <Logo variant="icon" className="h-9 w-9" />
              <span className="text-sm font-semibold tracking-tight text-foreground">
                Admin
              </span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <Link className="text-sm text-muted transition hover:text-foreground" href="/">
              Back to site
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className={["relative", shellLeftPadding].join(" ")}>
        <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-12 lg:py-12">
          <div className="mb-7">
            <h1 className="font-serif text-3xl font-semibold leading-[1.08] tracking-[-0.01em] text-foreground sm:text-4xl">
              {title}
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-muted">
              Invite-only. Admin access required.
            </p>
          </div>

          <div className="relative">{children}</div>
        </div>
      </main>
    </div>
  );
}

function MenuIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M5 7h14M5 12h14M5 17h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

