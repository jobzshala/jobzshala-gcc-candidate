/**
 * Inline SVG flags for the six GCC countries.
 *
 * Not emoji: Windows ships no flag glyphs, so 🇦🇪 falls back to rendering the
 * bare region letters ("AE"), which is what the footer was showing. Inline SVG
 * renders identically on every platform and needs no external request.
 *
 * Drawn at footer size (~16px wide), so the Saudi and Omani emblems are
 * simplified to the marks that stay legible at that scale rather than full
 * heraldic detail.
 */

export type GccCountryCode = "AE" | "SA" | "QA" | "OM" | "KW" | "BH";

const FLAGS: Record<GccCountryCode, React.ReactNode> = {
  // Red hoist bar, then green / white / black horizontal bands.
  AE: (
    <>
      <rect width="24" height="5.33" y="0" fill="#00732f" />
      <rect width="24" height="5.34" y="5.33" fill="#fff" />
      <rect width="24" height="5.33" y="10.67" fill="#000" />
      <rect width="6" height="16" fill="#ff0000" />
    </>
  ),
  // Green field with the shahada suggested above a white sword.
  SA: (
    <>
      <rect width="24" height="16" fill="#006c35" />
      <g fill="#fff">
        <rect x="5" y="5" width="14" height="0.9" rx="0.45" />
        <rect x="6.5" y="6.8" width="11" height="0.7" rx="0.35" />
        <rect x="5" y="10" width="13" height="0.9" rx="0.45" />
        <path d="M18 10.45 L20 9.4 v2.1 z" />
      </g>
    </>
  ),
  // White hoist, maroon field, nine-point serrated divide.
  QA: (
    <>
      <rect width="24" height="16" fill="#fff" />
      <path
        d="M24 0 H9 l3 0.89 -3 0.89 3 0.89 -3 0.89 3 0.89 -3 0.89 3 0.89 -3 0.89 3 0.89 -3 0.89 3 0.89 -3 0.89 3 0.89 -3 0.89 3 0.89 -3 0.89 H24 Z"
        fill="#8d1b3d"
      />
    </>
  ),
  // Red hoist bar; white / red / green bands; khanjar suggested in the canton.
  OM: (
    <>
      <rect width="24" height="5.33" y="0" fill="#fff" />
      <rect width="24" height="5.34" y="5.33" fill="#db161b" />
      <rect width="24" height="5.33" y="10.67" fill="#008000" />
      <rect width="7" height="16" fill="#db161b" />
      <g fill="#fff" opacity="0.95">
        <rect x="2.4" y="1.6" width="2.2" height="0.7" rx="0.35" />
        <rect x="3.15" y="2.1" width="0.7" height="2.4" rx="0.35" />
      </g>
    </>
  ),
  // Green / white / red bands with the black hoist trapezoid.
  KW: (
    <>
      <rect width="24" height="5.33" y="0" fill="#007a3d" />
      <rect width="24" height="5.34" y="5.33" fill="#fff" />
      <rect width="24" height="5.33" y="10.67" fill="#ce1126" />
      <path d="M0 0 H7 L5 5.33 v5.34 L7 16 H0 Z" fill="#000" />
    </>
  ),
  // White hoist, red field, five-point serrated divide.
  BH: (
    <>
      <rect width="24" height="16" fill="#fff" />
      <path d="M24 0 H8 l3.2 1.6 -3.2 1.6 3.2 1.6 -3.2 1.6 3.2 1.6 -3.2 1.6 3.2 1.6 -3.2 1.6 3.2 1.6 -3.2 1.6 H24 Z" fill="#ce1126" />
    </>
  ),
};

export default function FlagIcon({
  code,
  className = "",
  title,
}: {
  code: GccCountryCode;
  className?: string;
  /** Omit when an adjacent label already names the country. */
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 16"
      className={`h-3 w-[1.125rem] shrink-0 rounded-[2px] ring-1 ring-black/10 ${className}`}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      {FLAGS[code]}
    </svg>
  );
}
