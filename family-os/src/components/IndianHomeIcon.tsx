// A home glyph with a domed "chhatri" roofline and an arched jharokha-style
// doorway — a warmer, more distinctly Indian take on the plain house icon,
// used for the browser/PWA icons and the login & setup welcome screens.
// Plain host SVG elements only (no CSS custom properties) so it renders
// correctly both in normal React DOM and inside next/og's ImageResponse.
export default function IndianHomeIcon({
  size = 24,
  color = "#E8A33D",
  bgColor = "#1e1b2e",
}: {
  size?: number;
  color?: string;
  bgColor?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 12 C4 7.5 7.5 4 12 4 C16.5 4 20 7.5 20 12 L20 21 L4 21 Z" fill={color} />
      <path d="M12 4 L12 1.4" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="12" cy="1" r="1" fill={color} />
      <path d="M10 21 L10 15.5 C10 13.5 10.8 12.5 12 12.5 C13.2 12.5 14 13.5 14 15.5 L14 21 Z" fill={bgColor} />
    </svg>
  );
}
