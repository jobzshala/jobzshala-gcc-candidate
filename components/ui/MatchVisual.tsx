type CandidateNode = {
  label: string;
  top?: boolean;
  className: string;
};

const CANDIDATES: CandidateNode[] = [
  { label: "62% match", className: "left-3 top-[18%]" },
  { label: "71% match", className: "right-3 top-[15%]" },
  { label: "58% match", className: "left-2 bottom-[18%]" },
  { label: "96% · Verified", top: true, className: "right-2 bottom-[15%]" },
];

// Endpoints (in the 400x300 viewBox) each dashed/solid connector points to,
// index-matched to CANDIDATES — used only to draw the lines from the
// requirement card at the center out to each node.
const LINE_ENDPOINTS: [number, number][] = [
  [80, 70],
  [340, 60],
  [70, 220],
  [330, 235],
];

/**
 * Visualizes the actual AI-matching mechanic — a requirement scored against
 * candidates — instead of a stock photo. Built the same way CorridorVisual.tsx
 * is: inline SVG + CSS, no client-side state.
 */
export default function MatchVisual({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-jz-grey-400 bg-jz-bg-primary ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(circle at 30% 20%, rgba(0,178,255,0.10), transparent 55%), radial-gradient(circle at 75% 75%, rgba(249,185,0,0.08), transparent 50%)",
      }}
    >
      <svg viewBox="0 0 400 300" className="size-full" aria-hidden="true">
        {LINE_ENDPOINTS.map(([x, y], i) => {
          const isTop = CANDIDATES[i].top;
          return (
            <line
              key={i}
              x1="200"
              y1="150"
              x2={x}
              y2={y}
              stroke={isTop ? "#00af00" : "#2c3b52"}
              strokeWidth={isTop ? 2 : 1.5}
              strokeDasharray={isTop ? undefined : "3 5"}
            />
          );
        })}
        <circle cx="330" cy="235" r="3" fill="none" stroke="#00af00" strokeWidth="1.5" opacity="0.4">
          <animate attributeName="r" values="3;9;9" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0;0" dur="2.4s" repeatCount="indefinite" />
        </circle>
      </svg>

      <div className="absolute top-1/2 left-1/2 min-w-[132px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-jz-blue-400 bg-jz-blue-900 px-3.5 py-2.5 text-center shadow-[0_0_0_6px_rgba(0,178,255,0.08)]">
        <p className="text-[12.5px] font-semibold text-jz-white-50">Warehouse Supervisor</p>
        <p className="mt-0.5 font-mono text-[10.5px] tracking-wide text-jz-blue-400 uppercase">Dubai, UAE</p>
      </div>

      {CANDIDATES.map((c) => (
        <div
          key={c.label}
          className={`absolute flex items-center gap-1.5 rounded-full border py-1 pr-2.5 pl-1 text-[11px] whitespace-nowrap ${c.className} ${
            c.top
              ? "border-jz-green-500 bg-jz-blue-950 text-jz-white-200 shadow-[0_0_0_3px_rgba(0,175,0,0.12)]"
              : "border-jz-grey-400 bg-jz-blue-950 text-jz-white-200"
          }`}
        >
          <span
            className={`size-5 shrink-0 rounded-full ${
              c.top ? "bg-gradient-to-br from-jz-yellow-400 to-jz-yellow-500" : "bg-gradient-to-br from-jz-blue-400 to-jz-blue-800"
            }`}
          />
          <span className={`font-mono ${c.top ? "font-bold text-jz-green-500" : "text-jz-white-600"}`}>{c.label}</span>
        </div>
      ))}
    </div>
  );
}
