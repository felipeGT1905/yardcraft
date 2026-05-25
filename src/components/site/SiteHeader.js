import Link from "next/link";

import { landingContent } from "@/content/landing";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/Button";
import { BRAND } from "@/lib/brand";

function PhoneIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M3.65 1.5a.5.5 0 0 0-.36.15L2 2.94c-.74.74-.93 1.85-.52 2.85.82 1.98 2.35 4.08 4.28 6.01s4.03 3.46 6.01 4.28c1 .41 2.11.22 2.85-.52l1.29-1.29a.5.5 0 0 0 0-.7l-2.5-2.5a.5.5 0 0 0-.7 0l-1.5 1.5a.25.25 0 0 1-.33.02 16.9 16.9 0 0 1-3.54-3.54.25.25 0 0 1 .02-.33l1.5-1.5a.5.5 0 0 0 0-.7L4 1.65a.5.5 0 0 0-.35-.15z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-background/80 backdrop-blur-md">
      <Container className="flex min-h-15 items-center justify-between gap-4 overflow-visible py-3 sm:min-h-18 sm:py-3.5">
        <Logo variant="horizontal" className="overflow-visible" />

        <nav className="hidden items-center gap-6 lg:flex">
          {landingContent.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13px] font-medium text-foreground/70 transition hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Phone in nav — all mobile; tablet+ uses text link + CTAs */}
          <a
            href={`tel:${BRAND.phoneTel}`}
            className="inline-flex max-w-[calc(100vw-8rem)] items-center gap-1.5 whitespace-nowrap rounded-full border border-white/30 px-3 py-2 text-[11px] font-semibold tracking-[0.03em] text-foreground transition hover:border-white/50 hover:bg-white/8 sm:hidden"
          >
            <PhoneIcon />
            {BRAND.phoneDisplay}
          </a>

          <a
            href={`tel:${BRAND.phoneTel}`}
            className="hidden items-center gap-1.5 text-[13px] font-medium text-foreground/80 transition hover:text-foreground sm:flex"
          >
            <PhoneIcon />
            {BRAND.phoneDisplay}
          </a>

          <a
            href={`sms:${BRAND.phoneTel}?body=${encodeURIComponent("Hi YardCraft, I'd love to learn more about your outdoor services for my property.")}`}
            className="hidden items-center justify-center rounded-full border border-white/30 px-4 py-2 text-[12px] font-semibold tracking-[0.02em] text-foreground transition hover:border-white/50 hover:bg-white/8 sm:inline-flex sm:px-5 sm:text-[13px]"
          >
            Text Us
          </a>

          <Button
            href="#quote"
            className="!hidden shrink whitespace-nowrap px-4 py-2 text-center text-[12px] leading-normal portrait:max-md:!hidden landscape:max-md:!inline-flex md:!inline-flex"
          >
            Request Your Custom Plan
          </Button>
        </div>
      </Container>
    </header>
  );
}
