export function Badge({ className = "", ...props }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border border-card-border bg-card px-3 py-1 text-xs font-semibold tracking-wide text-muted",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

