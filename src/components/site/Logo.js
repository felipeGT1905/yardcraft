import Link from "next/link";
import Image from "next/image";

import { BRAND } from "@/lib/brand";

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

/**
 * @param {"nav" | "header" | "footer" | "horizontal" | "icon" | "mark" | "auth"} [variant="nav"]
 * — horizontal: homepage nav/footer lockup image;
 *   header/footer: logomark + wordmark; nav: mark + wordmark; icon/mark/auth: as labeled.
 */
export function Logo({ variant = "nav", className }) {
  const mark = (imgClass, src = "/images/YardCraftLogo.png") => (
    <Image
      src={src}
      alt=""
      width={160}
      height={160}
      className={cx("object-contain", imgClass)}
      priority
    />
  );

  if (variant === "horizontal") {
    return (
      <Link
        href="/"
        className={cx("inline-flex shrink-0", className)}
        aria-label={`${BRAND.name} home`}
      >
        <Image
          src="/images/horizontal-logo.png"
          alt={BRAND.name}
          width={300}
          height={72}
          className="h-9 w-auto origin-left scale-[2.5] object-contain object-left sm:h-10"
          priority
        />
      </Link>
    );
  }

  if (variant === "header" || variant === "footer") {
    const isHeader = variant === "header";
    return (
      <Link
        href="/"
        className={cx(
          "inline-flex min-w-0 items-center",
          isHeader && "ml-3 md:ml-0",
          className,
        )}
        aria-label={`${BRAND.name} home`}
      >
        <span className="relative shrink-0">
          {mark(
            "h-11 w-11 scale-150 sm:h-12 sm:w-12 md:h-[3.25rem] md:w-[3.25rem] md:scale-[1.3]",
            "/images/YardCraftLogo-main.png",
          )}
        </span>
        <span
          className={cx(
            "min-w-0 flex-col items-start justify-center border-l border-white/10 pl-3 sm:pl-4",
            isHeader ? "hidden md:flex" : "flex",
          )}
        >
          <span
            className="font-serif text-[40px] font-semibold leading-none tracking-[-0.02em]"
            aria-hidden="true"
          >
            <span className="yc-header-wordmark-yard">Yard</span>
            <span className="yc-header-wordmark">Craft</span>
          </span>
          <span className="yc-header-tagline mt-0 font-serif text-[10px] font-normal leading-tight sm:text-[11px] md:ml-[6px] md:text-xs">
            {BRAND.tagline}
          </span>
        </span>
      </Link>
    );
  }

  if (variant === "icon") {
    return (
      <Link
        href="/"
        className={cx("inline-flex h-9 w-9 items-center justify-center", className)}
        aria-label={`${BRAND.name} home`}
      >
        {mark("h-full w-full object-contain")}
      </Link>
    );
  }

  if (variant === "mark") {
    return (
      <Link href="/" className={cx("inline-flex shrink-0", className)} aria-label={`${BRAND.name} home`}>
        {mark("h-14 w-14 sm:h-[4.5rem] sm:w-[4.5rem]")}
      </Link>
    );
  }

  if (variant === "auth") {
    return (
      <Link
        href="/"
        className={cx("inline-flex flex-col items-center gap-3 text-center", className)}
        aria-label={`${BRAND.name} home`}
      >
        {mark("h-[88px] w-[88px] sm:h-[100px] sm:w-[100px]")}
        <span className="flex flex-col items-center gap-1.5">
          <span className="font-serif text-[1.85rem] font-semibold leading-none tracking-[-0.03em] text-foreground sm:text-[2.1rem]">
            {BRAND.name}
          </span>
          <span className="max-w-[22ch] text-[13px] font-medium leading-snug tracking-[0.02em] text-muted sm:text-sm">
            {BRAND.tagline}
          </span>
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={cx(
        "inline-flex min-w-0 items-center gap-2.5 sm:gap-3.5",
        className,
      )}
      aria-label={`${BRAND.name} home`}
    >
      {mark("h-12 w-12 shrink-0 sm:h-14 sm:w-14 md:h-16 md:w-16")}
      <span className="flex min-w-0 flex-col justify-center leading-[1.05]">
        <span className="font-serif text-[1.35rem] font-semibold tracking-[-0.03em] text-foreground sm:text-2xl md:text-[1.75rem]">
          {BRAND.name}
        </span>
        <span className="mt-1 hidden max-w-[18rem] text-pretty text-[11px] font-medium leading-snug tracking-[0.02em] text-muted sm:block sm:text-xs md:max-w-88">
          {BRAND.tagline}
        </span>
      </span>
    </Link>
  );
}
