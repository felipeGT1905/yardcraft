export function Container({ className = "", as: As = "div", ...props }) {
  return (
    <As
      className={[
        "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

