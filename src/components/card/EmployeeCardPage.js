import { Logo } from "@/components/site/Logo";
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

function getInitials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
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

      <header className="relative z-10 pt-6 sm:pt-8">
        <Container className="flex flex-col items-center px-4 text-center">
          <Logo variant="mark" className="[&_img]:!h-12 [&_img]:!w-12 sm:[&_img]:!h-14 sm:[&_img]:!w-14" />
          <p className="mt-3 font-serif text-[1.125rem] font-semibold tracking-[-0.02em] text-foreground sm:text-xl">
            {BRAND.name}
          </p>
          <p className="mt-1 text-[11px] font-medium tracking-[0.22em] uppercase text-gold/85">
            {BRAND.tagline}
          </p>
        </Container>
      </header>

      <main className="relative z-10 mt-6 sm:mt-8">
        <Container className="max-w-md px-4">
          <article
            className={cx(
              "overflow-hidden rounded-[24px] border border-white/10",
              "bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))]",
              "shadow-[0_28px_80px_-54px_rgba(0,0,0,0.9)]",
            )}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none h-24 bg-[radial-gradient(520px_120px_at_50%_0%,rgba(214,178,94,0.16),transparent_70%)]"
            />

            <div className="-mt-14 flex flex-col items-center px-5 pb-6 pt-0 text-center sm:px-6 sm:pb-7">
              <div className="relative">
                {photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoUrl}
                    alt=""
                    className="h-28 w-28 rounded-full border-4 border-background object-cover shadow-[0_18px_40px_-20px_rgba(0,0,0,0.9)] sm:h-32 sm:w-32"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="grid h-28 w-28 place-items-center rounded-full border-4 border-background bg-[linear-gradient(145deg,rgba(214,178,94,0.22),rgba(31,122,58,0.18))] text-2xl font-semibold tracking-tight text-foreground shadow-[0_18px_40px_-20px_rgba(0,0,0,0.9)] sm:h-32 sm:w-32 sm:text-3xl"
                  >
                    {getInitials(employee?.display_name)}
                  </div>
                )}
              </div>

              <h1 className="mt-4 font-serif text-[1.65rem] font-semibold leading-[1.1] tracking-[-0.025em] text-foreground sm:text-[1.85rem]">
                {employee?.display_name || "Team member"}
              </h1>
              {employee?.job_title ? (
                <p className="mt-1.5 text-[13px] font-semibold tracking-[0.14em] uppercase text-gold/90 sm:text-sm">
                  {employee.job_title}
                </p>
              ) : null}
              {location ? (
                <p className="mt-2 text-[13px] text-muted sm:text-sm">{location}</p>
              ) : null}
            </div>

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
