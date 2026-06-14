import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { landingOutlineCtaClassName } from "@/components/ui/landingOutlineCta";
import { BRAND } from "@/lib/brand";

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

function formatPhoneDisplay(phone) {
  if (!phone || typeof phone !== "string") return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone.trim();
}

function EmployeeCardHero({ employee, photoUrl, location }) {
  return (
    <section className="relative overflow-hidden px-5 pb-8 pt-7 sm:px-7 sm:pb-10 sm:pt-9">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(168deg,rgba(6,6,8,0.98)_0%,rgba(14,18,14,0.94)_48%,rgba(8,10,8,0.98)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(620px_280px_at_50%_-20%,rgba(214,178,94,0.2),transparent_68%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(480px_220px_at_100%_100%,rgba(31,122,58,0.14),transparent_62%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(214,178,94,0.32),transparent)]"
      />

      <p className="relative text-center text-[10px] font-semibold tracking-[0.32em] uppercase text-gold/60">
        {BRAND.name}
      </p>

      <div className="relative mx-auto mt-7 flex justify-center sm:mt-8">
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute -inset-[5px] rounded-full bg-[conic-gradient(from_210deg,rgba(214,178,94,0.45),rgba(31,122,58,0.28),rgba(214,178,94,0.2),rgba(214,178,94,0.45))] opacity-90 blur-[1px]"
          />
          <div className="relative rounded-full bg-[linear-gradient(145deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))] p-[3px] shadow-[0_28px_70px_-22px_rgba(0,0,0,0.92),inset_0_1px_0_rgba(255,255,255,0.12)]">
            <div className="overflow-hidden rounded-full bg-black/50 ring-1 ring-white/10">
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoUrl}
                  alt=""
                  className="block h-[8.75rem] w-[8.75rem] object-cover object-center sm:h-[9.75rem] sm:w-[9.75rem]"
                />
              ) : (
                <div className="grid h-[8.75rem] w-[8.75rem] place-items-center overflow-hidden bg-[radial-gradient(circle_at_30%_20%,rgba(214,178,94,0.14),rgba(0,0,0,0.88)_68%)] sm:h-[9.75rem] sm:w-[9.75rem]">
                  <Image
                    src="/images/YardCraftLogo.png"
                    alt={BRAND.name}
                    width={320}
                    height={320}
                    className="h-[7.25rem] w-[7.25rem] scale-[1.3] object-contain opacity-95 sm:h-[8rem] sm:w-[8rem]"
                    priority
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-8 text-center sm:mt-9">
        <h1 className="font-serif text-[1.85rem] font-semibold leading-[1.08] tracking-tight text-foreground sm:text-[2.1rem]">
          {employee?.display_name || "Team member"}
        </h1>
        {employee?.job_title ? (
          <p className="mt-2.5 text-[12px] font-semibold tracking-[0.18em] uppercase text-gold/90 sm:text-[13px]">
            {employee.job_title}
          </p>
        ) : null}
        {location ? (
          <p className="mt-2 text-[13px] font-medium text-foreground/55 sm:text-sm">{location}</p>
        ) : null}
        <p className="mt-3 text-[11px] font-medium tracking-[0.14em] text-muted/80">{BRAND.tagline}</p>
      </div>
    </section>
  );
}

function ContactRow({ label, value, href, external = false }) {
  if (!value) return null;

  const content = (
    <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
      <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted">{label}</span>
      <span className="truncate text-[14px] font-medium text-foreground">{value}</span>
    </div>
  );

  if (!href) {
    return <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-3">{content}</div>;
  }

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-3 transition hover:border-white/14 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/55"
    >
      {content}
    </a>
  );
}

function ActionButton({ href, children, external = false, primary = false }) {
  if (!href) return null;

  const className = cx(landingOutlineCtaClassName, "w-full text-center");

  if (primary) {
    return (
      <Button
        href={href}
        className="w-full justify-center"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </Button>
    );
  }

  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

export function EmployeeCardPage({ employee }) {
  const social = employee?.social_links && typeof employee.social_links === "object" ? employee.social_links : {};
  const website = typeof social.website === "string" ? social.website.trim() : "";
  const instagram = typeof social.instagram === "string" ? social.instagram.trim() : "";
  const googleReviews = typeof social.google_reviews === "string" ? social.google_reviews.trim() : "";

  const officeTel = employee?.office_phone?.trim() || "";
  const directTel = employee?.direct_phone?.trim() || "";
  const email = employee?.email?.trim() || "";
  const location = employee?.location?.trim() || "";
  const photoUrl = employee?.photo_url?.trim() || "";

  return (
    <div className="relative min-h-dvh overflow-hidden pb-10 text-foreground">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-180px] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-gold/10 blur-[90px]" />
        <div className="absolute bottom-[-160px] left-[-120px] h-[380px] w-[380px] rounded-full bg-green/10 blur-[90px]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_480px_at_50%_0%,rgba(255,255,255,0.05),transparent_62%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.35),transparent_28%,rgba(0,0,0,0.45))]" />
      </div>

      <main className="relative z-10 pt-4 sm:pt-6">
        <Container className="max-w-md px-4">
          <article
            className={cx(
              "overflow-hidden rounded-[26px] border border-white/10",
              "bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]",
              "shadow-[0_32px_90px_-48px_rgba(0,0,0,0.95)]",
            )}
          >
            <EmployeeCardHero employee={employee} photoUrl={photoUrl} location={location} />

            {employee?.slug ? (
              <div className="border-t border-white/8 px-4 py-5 sm:px-5">
                <Button
                  href={`/api/card/${employee.slug}/vcf`}
                  download={`${employee.slug}.vcf`}
                  className="w-full justify-center py-4 text-[14px] sm:text-[13px]"
                >
                  Save Contact
                </Button>
              </div>
            ) : null}

            <div className="space-y-2.5 border-t border-white/8 px-4 py-5 sm:px-5">
              <ContactRow
                label="Office"
                value={formatPhoneDisplay(officeTel)}
                href={officeTel ? `tel:${officeTel}` : null}
              />
              <ContactRow
                label="Direct"
                value={formatPhoneDisplay(directTel)}
                href={directTel ? `tel:${directTel}` : null}
              />
              <ContactRow label="Email" value={email} href={email ? `mailto:${email}` : null} />
              {!officeTel && !directTel && !email && location ? (
                <ContactRow label="Location" value={location} />
              ) : null}
            </div>

            <div className="grid gap-2.5 border-t border-white/8 px-4 py-5 sm:grid-cols-2 sm:px-5">
              <ActionButton href={officeTel ? `tel:${officeTel}` : null} primary>
                Call Office
              </ActionButton>
              <ActionButton href={directTel ? `tel:${directTel}` : null}>
                Call Direct
              </ActionButton>
              <ActionButton href={email ? `mailto:${email}` : null}>
                Send Email
              </ActionButton>
              <ActionButton href={website || null} external>
                Visit Website
              </ActionButton>
              <ActionButton href={instagram || null} external>
                Instagram
              </ActionButton>
              <ActionButton href={googleReviews || null} external>
                Google Reviews
              </ActionButton>
            </div>
          </article>

          <p className="mt-6 text-center text-[11px] leading-relaxed text-muted/85">
            {BRAND.legalEntity}
          </p>
        </Container>
      </main>
    </div>
  );
}
