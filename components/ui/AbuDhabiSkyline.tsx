// Ported from the approved static reference (jobzshala-redesign_4.html's
// `.skyline-art` SVG) — distant/mid building layers, gold-outlined signature
// towers drawn as paths (pointed + domed rooflines), window-light dots, and
// a bottom fade so the buildings sink into the section background.
export default function AbuDhabiSkyline({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 340"
      preserveAspectRatio="xMidYMax slice"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="skyFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0B1420" stopOpacity="0" />
          <stop offset="100%" stopColor="#0B1420" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* distant buildings */}
      <g opacity="0.35" fill="#1A2A3D">
        <rect x="40" y="200" width="50" height="140" />
        <rect x="110" y="170" width="34" height="170" />
        <rect x="700" y="190" width="46" height="150" />
        <rect x="1250" y="180" width="40" height="160" />
        <rect x="1330" y="210" width="60" height="130" />
      </g>

      {/* mid buildings */}
      <g opacity="0.6" fill="#22364D">
        <rect x="180" y="140" width="56" height="200" />
        <rect x="250" y="180" width="40" height="160" />
        <rect x="820" y="150" width="50" height="190" />
        <rect x="1000" y="130" width="44" height="210" />
        <rect x="1080" y="170" width="60" height="170" />
      </g>

      {/* foreground / signature towers (gold outline, distinctive) */}
      <g stroke="#C9A15A" strokeWidth="1.4" opacity="0.9">
        <path d="M380 340V120l30-30 30 30v220" fill="#0E1A2A" />
        <path d="M470 340V90l18-22 18 22v250" fill="#0E1A2A" />
        <path d="M600 340V60c0-14 12-26 26-26s26 12 26 26v280" fill="#0E1A2A" />
        <path d="M900 340V100l24-26 24 26v240" fill="#0E1A2A" />
        <path d="M960 340V150l16-18 16 18v190" fill="#0E1A2A" />
      </g>

      {/* tiny window lights */}
      <g fill="#FECC00" opacity="0.5">
        <circle cx="395" cy="160" r="1.6" />
        <circle cx="410" cy="190" r="1.6" />
        <circle cx="395" cy="220" r="1.6" />
        <circle cx="612" cy="90" r="1.6" />
        <circle cx="626" cy="120" r="1.6" />
        <circle cx="612" cy="160" r="1.6" />
        <circle cx="626" cy="200" r="1.6" />
        <circle cx="912" cy="140" r="1.6" />
        <circle cx="924" cy="180" r="1.6" />
      </g>

      <rect x="0" y="0" width="1440" height="340" fill="url(#skyFade)" />
    </svg>
  );
}
