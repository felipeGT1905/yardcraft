import { notFound } from "next/navigation";

import { Container } from "@/components/ui/Container";
import { SiteFooter } from "@/components/site/SiteFooter";
import { getDesignBySlug } from "@/lib/designs";
import { DesignQrHeader } from "@/components/design/sections/DesignQrHeader";
import { ServicesSection } from "@/components/design/sections/ServicesSection";
import { TrustSection } from "@/components/design/sections/TrustSection";
import { isAdminRequest } from "@/lib/adminOptional";
import { AdminQuickEditFab } from "@/components/design/AdminQuickEditFab";
import { getSiteUrl } from "@/lib/site";
import { PremiumBeforeAfter } from "@/components/design/PremiumBeforeAfter";
import { BRAND } from "@/lib/brand";
import { QuoteIqEmbed } from "@/components/quoteiq/QuoteIqEmbed";
import { landingOutlineCtaClassName } from "@/components/ui/landingOutlineCta";
import { resolveDesignComparisonUrls } from "@/lib/designImageUrls";

const DESIGN_SMS_BODY =
  "Hi YardCraft, I just viewed the before & after concept for my property and wanted to explore possibilities for my outdoor space.";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const design = await getDesignBySlug(slug);
  if (!design) return { title: "Design not found" };
  return {
    title: "YardCraft • Property Preview",
    description: `${BRAND.tagline}. Luxury outdoor living preview with before/after comparison and a fast estimate.`,
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const design = await getDesignBySlug(slug);
  if (!design) notFound();

  const { beforeUrl, afterUrl } = resolveDesignComparisonUrls(
    design.before_image,
    design.after_image,
  );
  const isAdmin = await isAdminRequest();
  const pageUrl = `${getSiteUrl()}/design/${slug}`;

  return (
    <div className="design-landing pb-32 text-[15px] font-normal leading-[1.68] text-foreground sm:pb-40 sm:text-base sm:leading-[1.66] lg:text-[1.125rem] lg:leading-[1.72] xl:text-[1.14rem] xl:leading-[1.73]">
      {/* Architectural outdoor backdrop — single sharp plate + depth (no heavy duplicate blur) */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="yc-lux-photo absolute inset-0 scale-[1.03]"
          style={{
            backgroundImage: "url(/images/luxury-patio.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
          }}
        />
        <div className="yc-lux-photo-warmth" aria-hidden="true" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.52),rgba(0,0,0,0.42)_44%,rgba(0,0,0,0.56))]" />
        <div className="absolute inset-0 bg-[radial-gradient(880px_500px_at_50%_-120px,rgba(214,178,94,0.07),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(820px_480px_at_50%_92%,rgba(31,122,58,0.05),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_42%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      <DesignQrHeader />

      <section className="touch-pan-y-safe relative z-20 -mt-2 pt-0 max-md:-mt-3 md:-mt-1 lg:-mt-3">
        <PremiumBeforeAfter
          beforeUrl={beforeUrl}
          afterUrl={afterUrl}
          className="relative z-20 w-full max-w-full overflow-hidden md:h-[78dvh] md:min-h-[70dvh] lg:h-[85vh] lg:min-h-[80vh]"
        />

        {/* Tailored Property Preview — subtle eyebrow below the comparison */}
        <div className="relative z-20 px-4 pt-2.5 pb-2 text-center sm:pt-3 sm:pb-2.5">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
            Tailored Property Preview
          </p>
        </div>

        {/* CTA — What's your vision? */}
        <Container className="relative z-20 max-w-[560px] px-4 pb-6 pt-1 sm:px-6 sm:pb-8 sm:pt-2 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-black/35 px-6 py-7 text-center shadow-[0_20px_56px_-44px_rgba(0,0,0,0.78)] sm:rounded-[22px] sm:px-8 sm:py-9">
            <h2 className="font-serif text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.025em] text-foreground sm:text-[1.75rem]">
              What&apos;s your vision? Let&apos;s talk.
            </h2>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:mt-7">
              <a href={`tel:${BRAND.phoneTel}`} className={landingOutlineCtaClassName}>
                Call Us
              </a>
              <a
                href={`sms:${BRAND.phoneTel}?body=${encodeURIComponent(DESIGN_SMS_BODY)}`}
                className={landingOutlineCtaClassName}
              >
                Text Us
              </a>
            </div>
          </div>
        </Container>

        <div id="quote" className="touch-pan-y-safe scroll-mt-20">
          <Container className="relative z-20 mx-auto max-w-6xl px-4 pb-20 pt-2 sm:px-6 sm:pb-24 sm:pt-3 lg:px-8">
            <div className="relative overflow-x-clip overflow-y-visible rounded-none border border-white/[0.07] bg-black/22 shadow-[0_28px_80px_-48px_rgba(0,0,0,0.82)] sm:rounded-[28px]">
              <div className="pointer-events-none absolute inset-0 sm:rounded-[28px]">
                <div className="absolute -right-20 -top-20 h-[220px] w-[220px] rounded-full bg-green/8 blur-3xl sm:-right-24 sm:-top-24 sm:h-[260px] sm:w-[260px]" />
                <div className="absolute -bottom-16 -left-16 h-[240px] w-[240px] rounded-full bg-gold/6 blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.1),transparent_55%)] sm:rounded-[28px]" />
              </div>
              <div className="relative px-4 pb-4 pt-10 text-center sm:px-10 sm:pb-6 sm:pt-12 lg:px-12 lg:pt-14">
                <h2 className="mx-auto max-w-[26ch] font-serif text-[1.625rem] font-semibold leading-[1.18] tracking-[-0.03em] text-foreground sm:text-3xl sm:leading-[1.12]">
                  Your dream outdoor space starts here.
                </h2>
                <p className="mx-auto mt-3 max-w-[34ch] text-[13px] font-medium leading-relaxed text-muted sm:mt-4 sm:text-sm">
                  Tell us what you have in mind.
                </p>
              </div>
              <div className="relative border-t border-white/[0.06] px-4 pb-6 pt-2 sm:px-8 sm:pb-8 sm:pt-4 lg:px-10 lg:pb-10">
                <QuoteIqEmbed slug={slug} pageUrl={pageUrl} />
              </div>
            </div>
          </Container>
        </div>
      </section>

      <TrustSection />

      <ServicesSection />

      <SiteFooter />
      {isAdmin ? <AdminQuickEditFab slug={design.slug} /> : null}
    </div>
  );
}
