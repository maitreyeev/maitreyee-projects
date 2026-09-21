"use client";

export default function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className="relative h-6 w-11 rounded-full shrink-0 cursor-pointer"
      style={{
        backgroundColor: checked ? "var(--accent)" : "var(--border)",
        transition: "background-color 150ms ease",
      }}
    >
      <span
        className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
        style={{
          transform: checked ? "translateX(22px)" : "translateX(2px)",
          transition: "transform 150ms ease",
        }}
      />
    </button>
  );
}
