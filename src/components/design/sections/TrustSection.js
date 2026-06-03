"use client";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { GoogleReviewCard } from "@/components/reviews/GoogleReviewCard";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/YardCraft/@38.9210323,-77.5133646,11z/data=!4m18!1m9!3m8!1s0x89b7b7245ae0c827:0x1cf8fa7c6cd458b!2sYardCraft!8m2!3d38.921447!4d-77.201547!9m1!1b1!16s%2Fg%2F11rt_x51sq!3m7!1s0x89b7b7245ae0c827:0x1cf8fa7c6cd458b!8m2!3d38.921447!4d-77.201547!9m1!1b1!16s%2Fg%2F11rt_x51sq?entry=ttu&g_ep=EgoyMDI2MDUyNy4wIKXMDSoASAFQAw%3D%3D";
const MAX_GOOGLE_REVIEWS = 3;

// Add real reviews here as they come in. text is optional — card renders
// stars + author even if text is absent. Only the first MAX_GOOGLE_REVIEWS are shown.
const REVIEWS = [
  {
    name: "Anne farrell",
    meta: "4 photos",
    stars: 5,
    timeAgo: "9 hours ago",
    badge: "New",
    body:
      "I have been using Javier's business for my yard clean up and maintenance for several years. I have always had a great experience. My yard always looks fantastic when they are finished. They have always been easy to work with and responsive to any questions or concerns. I highly recommend them!",
    avatarUrl:
      "https://lh3.googleusercontent.com/a-/ALV-UjVSPrvfubXpMSaVTENZFmzxiG6FhZ3vP9rigI2hbDc0yqA5Pz4=w45-h45-p-rp-mo-br100",
    photos: [
      "/images/reviews/anne-collage.png",
    ],
    photoFit: "cover",
  },
  {
    name: "Will Cullin",
    meta: "8 reviews · 1 photo",
    stars: 5,
    timeAgo: "5 days ago",
    badge: "New",
    body:
      "We have trusted Javier and his crew for many years now. They do excellent work from routine trimming to full landscaping projects. They have planted and removed trees and shrubs for us, laid down a new path, and fully redid our front bed with retaining wall and plants. 10/10 work!",
    avatarUrl:
      "https://lh3.googleusercontent.com/a/ACg8ocIA6HLD9-WfJUkt6s-KAo5zx3ngG2K-eRLIURfl9Svj8ad6xQ=w45-h45-p-rp-mo-br100",
    photos: [
      "/images/reviews/will-before-after.jpg",
    ],
  },
  {
    name: "Dianna Rodriguez",
    meta: "7 reviews · 1 photo",
    stars: 5,
    timeAgo: "6 days ago",
    badge: "New",
    body:
      "Javier and his crew have done many projects for us including new sod, irrigation, stone patios, and regular maintenance of our flower beds. They make sure to always tell me exactly what in need to do to keep it looking great based on the season and weather. I highly recommend them!",
    avatarUrl:
      "https://lh3.googleusercontent.com/a/ACg8ocLHvXwVjOCVVE5_qnctc6y6LaDQe-mjKOz4hAmyaFw2nx7yfA=w45-h45-p-rp-mo-br100",
    photos: [
      "/images/reviews/dianna-before-after.jpg",
    ],
  },
  {
    name: "Doris Benavides",
    meta: "Northern Virginia",
    stars: 5,
    body: "",
  },
];

export function TrustSection() {
  const displayedReviews = REVIEWS.slice(0, MAX_GOOGLE_REVIEWS);
  const hasReviews = displayedReviews.length > 0;

  return (
    <section id="trust" className="relative scroll-mt-24 py-28 sm:py-36">
      {/* Cinematic ambient glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-240px] h-[540px] w-[980px] -translate-x-1/2 rounded-full bg-gold/10 blur-[90px]" />
        <div className="absolute right-[-260px] bottom-[-240px] h-[540px] w-[540px] rounded-full bg-green/10 blur-[90px]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_0%,rgba(255,255,255,0.06),transparent_62%)]" />
      </div>
      <Container>
        <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-black/35 p-6 shadow-[0_40px_120px_-86px_rgba(0,0,0,0.95)] sm:p-8 lg:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent_48%)]"
          />

          {/* Header */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:gap-8">
            <div className="relative">
              <Reveal
                as="h2"
                className="font-serif text-4xl font-semibold leading-[1.04] tracking-[-0.02em] text-foreground sm:text-5xl"
              >
                Trusted by Homeowners
                <br className="sm:hidden" />
                {" "}Across Northern Virginia
              </Reveal>
              <Reveal y={10} duration={0.85}>
                <p className="mt-4 max-w-[60ch] text-[15px] leading-[1.85] text-foreground/60">
                  Reviews that match the work: premium execution, clear communication, and a finished yard you’re proud of.
                </p>
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
                className="flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-[12px] font-semibold tracking-[0.16em] uppercase text-foreground/80 shadow-[0_20px_60px_-50px_rgba(0,0,0,0.9)] transition hover:border-white/18 hover:bg-white/8 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/55"
              >
                <GoogleIcon size={14} />
                View on Google
              </a>
            </Reveal>
          </div>

          <Stagger className="relative mt-14 sm:mt-16" stagger={0.07}>

            {/* Review cards */}
            {hasReviews && (
              <div data-stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
                {displayedReviews.map((review, i) => (
                  <div key={`${review.name || "review"}-${i}`} className="h-full">
                    <GoogleReviewCard
                      name={review.name}
                      meta={review.meta}
                      stars={review.stars}
                      body={review.body}
                      avatarUrl={review.avatarUrl}
                      photos={review.photos}
                      photoLayout={review.photoLayout}
                      photoFit={review.photoFit}
                      timeAgo={review.timeAgo}
                      badge={review.badge}
                      href={GOOGLE_MAPS_URL}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Google Maps CTA */}
            <div data-stagger className={hasReviews ? "mt-14 flex justify-center sm:mt-16" : "mt-12 flex justify-center"}>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/6 px-7 py-3.5 text-[12px] font-semibold tracking-[0.18em] uppercase text-foreground/85 shadow-[0_30px_90px_-70px_rgba(0,0,0,0.95)] transition hover:border-white/18 hover:bg-white/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/55"
              >
                <GoogleIcon size={16} />
                See more reviews
              </a>
            </div>

          </Stagger>
        </div>
      </Container>
    </section>
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
