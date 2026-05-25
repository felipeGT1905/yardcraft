import { Hero } from "@/components/landing/sections/Hero";
import { ServicesSection } from "@/components/landing/sections/ServicesSection";
import { ProcessSection } from "@/components/landing/sections/ProcessSection";
import { ReviewsSection } from "@/components/landing/sections/ReviewsSection";
import { FinalCtaSection } from "@/components/landing/sections/FinalCtaSection";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Container } from "@/components/ui/Container";
import { QuoteIqEmbed } from "@/components/quoteiq/QuoteIqEmbed";

export function LandingPage({ content }) {
  return (
    <div className="relative">
      <SiteHeader />
      <Hero content={content.hero} />

      <div className="mx-auto h-px w-full max-w-6xl bg-card-border/70 opacity-70" />
      <ServicesSection
        id={content.sections.services.id}
        label={content.sections.services.label}
        title={content.sections.services.title}
        items={content.sections.services.items}
      />

      <div className="mx-auto h-px w-full max-w-6xl bg-card-border/70 opacity-70" />
      <ProcessSection
        id={content.sections.process.id}
        label={content.sections.process.label}
        title={content.sections.process.title}
        items={content.sections.process.items}
      />

      <div className="mx-auto h-px w-full max-w-6xl bg-card-border/70 opacity-70" />
      <ReviewsSection
        id={content.sections.reviews.id}
        label={content.sections.reviews.label}
        title={content.sections.reviews.title}
        items={content.sections.reviews.items}
        googleMapsUrl={content.sections.reviews.googleMapsUrl}
      />

      <div className="mx-auto h-px w-full max-w-6xl bg-card-border/70 opacity-70" />
      <section id="quote" className="scroll-mt-20 py-16 sm:py-24">
        <Container>
          <div className="mb-10 text-center">
            <p className="mb-3 text-[11px] font-semibold tracking-[0.2em] uppercase text-gold">
              GET A QUOTE
            </p>
            <h2 className="font-serif text-3xl font-semibold leading-[1.1] tracking-[-0.01em] text-foreground sm:text-[2.5rem]">
              Request Your Custom Plan
            </h2>
            <p className="mt-3 text-[15px] leading-[1.75] text-foreground/60">
              Tell us about your property and we&rsquo;ll get back to you fast.
            </p>
          </div>
          <div className="mx-auto max-w-2xl">
            <QuoteIqEmbed slug="" pageUrl="" />
          </div>
        </Container>
      </section>

      <FinalCtaSection />
      <SiteFooter />
    </div>
  );
}
