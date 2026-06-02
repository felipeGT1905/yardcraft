import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { GoogleReviewCard } from "@/components/reviews/GoogleReviewCard";

const MAX_GOOGLE_REVIEWS = 3;

export function ReviewsSection({ id, label, title, items, googleMapsUrl }) {
  const mapsUrl =
    googleMapsUrl ||
    "https://www.google.com/maps/place/YardCraft/@38.9210323,-77.5133646,11z/data=!4m18!1m9!3m8!1s0x89b7b7245ae0c827:0x1cf8fa7c6cd458b!2sYardCraft!8m2!3d38.921447!4d-77.201547!9m1!1b1!16s%2Fg%2F11rt_x51sq!3m7!1s0x89b7b7245ae0c827:0x1cf8fa7c6cd458b!8m2!3d38.921447!4d-77.201547!9m1!1b1!16s%2Fg%2F11rt_x51sq?entry=ttu&g_ep=EgoyMDI2MDUyNy4wIKXMDSoASAFQAw%3D%3D";
  const displayedReviews = (items ?? []).slice(0, MAX_GOOGLE_REVIEWS);

  return (
    <section id={id} className="relative scroll-mt-20 py-20 sm:py-28 lg:py-32">
      {/* Cinematic ambient glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-gold/10 blur-[90px]" />
        <div className="absolute left-[-220px] bottom-[-220px] h-[520px] w-[520px] rounded-full bg-green/10 blur-[90px]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_0%,rgba(255,255,255,0.06),transparent_62%)]" />
      </div>
      <Container>
        {/* Header row */}
        <div className="relative mb-12 flex flex-col gap-5 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <Reveal>
              <p className="mb-3 text-[11px] font-semibold tracking-[0.26em] uppercase text-gold/80">
                {label}
              </p>
            </Reveal>
            <Reveal
              as="h2"
              className="font-serif text-pretty text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.02em] text-foreground sm:text-[2.85rem] lg:text-[3.15rem]"
            >
              {title.split("\n").map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </Reveal>
            <Reveal y={10} duration={0.8}>
              <p className="mt-4 max-w-[54ch] text-[15px] leading-[1.85] text-foreground/60">
                Real homeowners. Real transformations. A premium crew that shows up, communicates, and finishes clean.
              </p>
            </Reveal>
          </div>

          <Reveal y={10} duration={0.8}>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex shrink-0 items-center gap-2 rounded-full border border-white/12 bg-white/5 px-5 py-2.5 text-[12px] font-semibold tracking-[0.16em] uppercase text-foreground/80 shadow-[0_20px_60px_-50px_rgba(0,0,0,0.9)] transition hover:border-white/18 hover:bg-white/8 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/55"
            >
              View on Google
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </Reveal>
        </div>

        {/* Equal-height 3-up grid */}
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
          {displayedReviews.map((review) => (
            <div
              key={review.name}
              data-stagger
              className="h-full"
            >
              <GoogleReviewCard
                name={review.name}
                meta={review.meta || review.location || ""}
                stars={review.stars}
                body={review.body}
                avatarUrl={review.avatarUrl}
                photos={review.photos}
                timeAgo={review.timeAgo}
                badge={review.badge}
                href={mapsUrl}
              />
            </div>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
