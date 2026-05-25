import Link from "next/link";

const base =
  "relative inline-flex items-center justify-center overflow-hidden rounded-full px-6 py-3.5 text-[13px] font-medium tracking-[0.04em] transition active:translate-y-[0.5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

const variants = {
  primary:
    "bg-[linear-gradient(180deg,color-mix(in_oklab,var(--green-bright)_30%,var(--green))_0%,var(--green)_55%,color-mix(in_oklab,var(--green)_60%,black)_100%)] text-white shadow-[0_0_0_1px_color-mix(in_oklab,var(--green)_35%,transparent),0_18px_42px_-18px_rgba(0,0,0,0.85)] hover:brightness-[1.06] hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--gold)_32%,transparent),0_28px_70px_-30px_rgba(214,178,94,0.35)] before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-[55%] before:-translate-x-[140%] before:skew-x-[-18deg] before:bg-[linear-gradient(90deg,transparent,rgba(214,178,94,0.26),transparent)] before:opacity-0 before:transition before:duration-700 hover:before:translate-x-[240%] hover:before:opacity-100",
  secondary:
    "border border-card-border bg-card text-foreground hover:border-[color-mix(in_oklab,var(--gold)_40%,var(--card-border))] hover:bg-white/5",
  ghost:
    "text-foreground/90 hover:bg-white/5 hover:text-foreground",
};

export function Button({
  variant = "primary",
  className = "",
  href,
  ...props
}) {
  const classes = [base, variants[variant] ?? variants.primary, className].join(
    " ",
  );

  if (href) {
    return <Link className={classes} href={href} {...props} />;
  }

  return <button className={classes} {...props} />;
}

