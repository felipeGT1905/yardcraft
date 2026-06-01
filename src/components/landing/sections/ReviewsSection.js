import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";

const MAX_GOOGLE_REVIEWS = 3;

function StarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor" aria-hidden="true">
      <path d="M6.5 0.5L7.9 4.6H12.3L8.7 7.1L10.1 11.2L6.5 8.7L2.9 11.2L4.3 7.1L0.7 4.6H5.1L6.5 0.5Z" />
    </svg>
  );
}

function Stars({ count = 5 }) {
  return (
    <div className="flex items-center gap-0.5 text-gold" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <StarIcon key={i} />
      ))}
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-label="Google review" role="img">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export function ReviewsSection({ id, label, title, items, googleMapsUrl }) {
  const mapsUrl =
    googleMapsUrl ||
    "https://www.google.com/maps/place/YardCraft/@38.9210323,-77.5133646,11z/data=!4m18!1m9!3m8!1s0x89b7b7245ae0c827:0x1cf8fa7c6cd458b!2sYardCraft!8m2!3d38.921447!4d-77.201547!9m1!1b1!16s%2Fg%2F11rt_x51sq!3m7!1s0x89b7b7245ae0c827:0x1cf8fa7c6cd458b!8m2!3d38.921447!4d-77.201547!9m1!1b1!16s%2Fg%2F11rt_x51sq?entry=ttu&g_ep=EgoyMDI2MDUyNy4wIKXMDSoASAFQAw%3D%3D";
  const displayedReviews = (items ?? []).slice(0, MAX_GOOGLE_REVIEWS);

  return (
    <section id={id} className="relative scroll-mt-20 py-16 sm:py-24">
      <Container>
        {/* Header row */}
        <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Reveal>
              <p className="mb-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-gold/80">
                {label}
              </p>
            </Reveal>
            <Reveal
              as="h2"
              className="font-serif text-pretty text-3xl font-semibold leading-[1.1] tracking-[-0.01em] text-foreground sm:text-[2.5rem]"
            >
              {title.split("\n").map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </Reveal>
          </div>

          <Reveal y={10} duration={0.8}>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex shrink-0 items-center gap-1.5 text-sm text-muted transition hover:text-foreground"
            >
              View all reviews on Google
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </Reveal>
        </div>

        {/* Review cards */}
        <Stagger className="grid gap-4 sm:grid-cols-3">
          {displayedReviews.map((review) => (
            <article
              key={review.name}
              data-stagger
              className="flex flex-col gap-4 rounded-2xl border border-card-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-white/12 hover:bg-white/5 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)]"
            >
              <Stars count={review.stars} />

              {review.body ? (
                <p className="flex-1 text-[14px] leading-[1.75] text-foreground/70">
                  {review.body}
                </p>
              ) : null}

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{review.name}</p>
                  {review.location ? (
                    <p className="text-[11px] text-muted">{review.location}</p>
                  ) : null}
                </div>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" aria-label="View on Google">
                  <GoogleLogo />
                </a>
              </div>
            </article>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
