"use client";

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

function StarIcon({ filled }) {
  return (
    <span
      aria-hidden="true"
      className={filled ? "text-[#fbbc04]" : "text-white/15"}
    >
      ★
    </span>
  );
}

function Stars({ count = 5 }) {
  const n = Math.max(0, Math.min(5, Number(count) || 0));
  return (
    <div className="flex items-center gap-0.5 text-[14px]" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} filled={i < n} />
      ))}
    </div>
  );
}

export function GoogleReviewCard({
  name,
  meta,
  stars = 5,
  timeAgo,
  badge,
  body,
  avatarUrl,
  photos = [],
  photoLayout,
  href,
}) {
  const list = Array.isArray(photos) ? photos.filter(Boolean) : [];
  const isCollage = photoLayout === "collage" && list.length >= 4;
  const collage = isCollage ? list.slice(0, 4) : [];
  const firstPhoto = !isCollage ? (list[0] || null) : null;

  const cardHref = href || firstPhoto || collage[0] || "";

  const CardLink = ({ children }) =>
    cardHref ? (
      <a
        href={cardHref}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/55 rounded-[22px]"
        aria-label={`View ${name || "review"} on Google`}
      >
        {children}
      </a>
    ) : (
      <div className="h-full">{children}</div>
    );

  return (
    <article
      className={cx(
        "group relative h-full overflow-hidden rounded-[22px]",
        "border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))]",
        "shadow-[0_26px_80px_-54px_rgba(0,0,0,0.85)]",
        "transition-transform duration-500 ease-out hover:-translate-y-1",
      )}
    >
      <CardLink>
        <div className="relative flex h-full flex-col">
      {/* Ambient edge glow + inner highlight */}
      <div
        aria-hidden="true"
        className={cx(
          "pointer-events-none absolute inset-0",
          "bg-[radial-gradient(600px_220px_at_18%_0%,rgba(214,178,94,0.14),transparent_60%)]",
        )}
      />
      <div
        aria-hidden="true"
        className={cx(
          "pointer-events-none absolute inset-0",
          "bg-[radial-gradient(520px_260px_at_92%_18%,rgba(31,122,58,0.12),transparent_58%)]",
        )}
      />
      <div
        aria-hidden="true"
        className={cx(
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
          "bg-[radial-gradient(560px_240px_at_50%_0%,rgba(255,255,255,0.07),transparent_60%)]",
        )}
      />

      <div className="relative flex-1 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt=""
                className="h-11 w-11 rounded-full border border-white/12 object-cover shadow-[0_10px_24px_-16px_rgba(0,0,0,0.9)]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="grid h-11 w-11 place-items-center rounded-full border border-white/12 bg-white/6 text-xs font-semibold text-muted shadow-[0_10px_24px_-16px_rgba(0,0,0,0.9)]">
                {(name || "?").trim().slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-[15px] font-semibold tracking-[-0.01em] text-foreground">
                  {name || "Anonymous"}
                </div>
                {meta ? (
                  <div className="mt-0.5 truncate text-[12px] text-muted/90">{meta}</div>
                ) : null}
              </div>

              {href ? (
                <span
                  className={cx(
                    "shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1",
                    "text-[11px] font-semibold tracking-[0.06em] text-foreground/75 uppercase",
                    "transition hover:border-white/16 hover:bg-white/8 hover:text-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/55",
                  )}
                >
                  Google
                </span>
              ) : null}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <Stars count={stars} />
              {timeAgo ? <span className="text-[12px] text-muted/85">{timeAgo}</span> : null}
              {badge ? (
                <span className={cx(
                  "rounded-md border px-2 py-0.5 text-[11px] font-semibold tracking-[0.06em] uppercase",
                  badge === "New"
                    ? "border-[color-mix(in_oklab,var(--gold)_40%,transparent)] bg-[color-mix(in_oklab,var(--gold)_14%,transparent)] text-foreground"
                    : "border-white/10 bg-white/5 text-foreground/80",
                )}>
                  {badge}
                </span>
              ) : null}
            </div>

            {body ? (
              <p className="mt-3 text-[14px] leading-[1.85] text-foreground/70">
                {body}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {isCollage ? (
        <div className="block border-t border-white/10 bg-black/20 leading-0">
          <div className="grid grid-cols-2 gap-0.5 bg-black/40">
            {collage.map((url, i) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={`${url}-${i}`}
                className="overflow-hidden bg-black/20 leading-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt=""
                  className={cx(
                    "block h-auto w-full object-contain object-center",
                    "brightness-[1.04] contrast-[1.06] saturate-[1.05]",
                    "transition-transform duration-700 ease-out group-hover:scale-[1.02]",
                  )}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {firstPhoto ? (
        <div className="block border-t border-white/10 bg-black/20 leading-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={firstPhoto}
            alt=""
            className={cx(
              "block h-auto w-full object-contain object-center",
              "brightness-[1.05] contrast-[1.08] saturate-[1.06]",
              "transition-transform duration-700 ease-out group-hover:scale-[1.01]",
            )}
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}
        </div>
      </CardLink>
    </article>
  );
}

