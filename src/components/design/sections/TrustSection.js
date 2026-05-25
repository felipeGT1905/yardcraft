"use client";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";

const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/EqftrXDWDv6ejHjN8";
const MAX_GOOGLE_REVIEWS = 3;

// Add real reviews here as they come in. text is optional — card renders
// stars + author even if text is absent. Only the first MAX_GOOGLE_REVIEWS are shown.
const REVIEWS = [
  {
    text: "",
    author: "Doris Benavides",
    location: "Northern Virginia",
    rating: 5,
  },
];

export function TrustSection() {
  const displayedReviews = REVIEWS.slice(0, MAX_GOOGLE_REVIEWS);
  const hasReviews = displayedReviews.length > 0;

  return (
    <section id="trust" className="scroll-mt-24 py-28 sm:py-36">
      <Container>
        <div className="relative overflow-hidden rounded-2xl border border-white/6 bg-black/40 p-6 sm:rounded-[22px] sm:p-8 lg:p-10">

          {/* Header */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:gap-8">
            <div className="relative">
              <Reveal
                as="h2"
                className="font-serif text-4xl font-semibold leading-[1.06] tracking-[-0.012em] text-foreground sm:text-5xl"
              >
                Trusted by Homeowners
                <br className="sm:hidden" />
                {" "}Across Northern Virginia
              </Reveal>
            </div>

            <Reveal className="flex shrink-0 flex-col items-start gap-2 sm:items-end" y={10} duration={0.8}>
              <div className="flex items-center gap-2.5">
                <Stars />
                <span className="text-sm font-semibold text-foreground">5.0</span>
              </div>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-muted underline-offset-4 transition hover:text-foreground hover:underline"
              >
                <GoogleIcon size={12} />
                Verify on Google Maps →
              </a>
            </Reveal>
          </div>

          <Stagger className="relative mt-14 sm:mt-16" stagger={0.07}>

            {/* Review cards */}
            {hasReviews && (
              <div data-stagger className="grid gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3 lg:gap-x-12">
                {displayedReviews.map((review, i) => (
                  <ReviewCard key={`${review.author}-${i}`} {...review} />
                ))}
              </div>
            )}

            {/* Google Maps CTA */}
            <div data-stagger className={hasReviews ? "mt-14 flex justify-center sm:mt-16" : "mt-12 flex justify-center"}>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/6 px-7 py-3.5 text-[13px] font-semibold tracking-[0.03em] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] transition hover:border-white/24 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/55"
              >
                <GoogleIcon size={16} />
                See all reviews on Google
              </a>
            </div>

          </Stagger>
        </div>
      </Container>
    </section>
  );
}

function ReviewCard({ text, author, location, rating }) {
  return (
    <div className="space-y-4 border-t border-white/9 pt-7">
      <Stars count={rating} />
      {text ? (
        <p className="text-sm font-medium leading-[1.72] text-muted lg:text-[1.0625rem] lg:leading-[1.72]">
          &ldquo;{text}&rdquo;
        </p>
      ) : null}
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-medium tracking-[0.08em] uppercase text-muted/90 lg:text-[13px]">
          {author}{location ? ` • ${location}` : ""}
        </div>
        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 opacity-60 transition hover:opacity-100"
          aria-label="View on Google"
        >
          <GoogleIcon size={14} />
        </a>
      </div>
    </div>
  );
}

function Stars({ count = 5 }) {
  return (
    <span className="inline-flex items-center gap-1 text-[color-mix(in_oklab,var(--gold)_75%,white)]" aria-label={`${count} star rating`}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} aria-hidden="true">★</span>
      ))}
    </span>
  );
}

function GoogleIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
