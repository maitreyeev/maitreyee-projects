import clsx from "clsx";

export default function CompanyBadge({
  name,
  color,
  size = 44,
  className,
}: {
  name: string;
  color: string;
  size?: number;
  className?: string;
}) {
  const initial = name.charAt(0);
  return (
    <div
      className={clsx(
        "company-badge flex items-center justify-center rounded-2xl font-semibold shrink-0",
        className
      )}
      style={
        {
          width: size,
          height: size,
          fontSize: size * 0.42,
          "--badge-brand": color,
        } as React.CSSProperties
      }
    >
      {initial}
    </div>
  );
}
