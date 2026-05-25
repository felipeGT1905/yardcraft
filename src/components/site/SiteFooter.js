import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/site/Logo";
import { BRAND } from "@/lib/brand";

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 15 15" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M3.65 1.5a.5.5 0 0 0-.36.15L2 2.94c-.74.74-.93 1.85-.52 2.85.82 1.98 2.35 4.08 4.28 6.01s4.03 3.46 6.01 4.28c1 .41 2.11.22 2.85-.52l1.29-1.29a.5.5 0 0 0 0-.7l-2.5-2.5a.5.5 0 0 0-.7 0l-1.5 1.5a.25.25 0 0 1-.33.02 16.9 16.9 0 0 1-3.54-3.54.25.25 0 0 1 .02-.33l1.5-1.5a.5.5 0 0 0 0-.7L4 1.65a.5.5 0 0 0-.35-.15z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-card-border/50 bg-black/25 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <Container className="py-9 sm:py-10">
        {/* Mobile + tablet: stacked left · Desktop (lg+): logo | contact center | copyright */}
        <div className="flex flex-col items-start gap-8 text-left lg:grid lg:grid-cols-3 lg:items-center lg:gap-10">
          <Logo
            variant="horizontal"
            className="origin-left overflow-visible lg:justify-self-start"
          />

          <div className="flex flex-col items-start gap-1.5 lg:items-center lg:justify-self-center">
            <a
              href={`tel:${BRAND.phoneTel}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground/80 transition hover:text-foreground lg:justify-center"
            >
              <PhoneIcon />
              {BRAND.phoneDisplay}
            </a>
            <p className="text-xs text-muted">Serving Northern Virginia</p>
          </div>

          <p className="text-xs text-muted lg:justify-self-end lg:text-right">
            © {new Date().getFullYear()} {BRAND.legalEntity}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
