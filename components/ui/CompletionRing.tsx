type CompletionRingProps = {
  percent: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  trackColor?: string;
  ringColor?: string;
};

export default function CompletionRing({
  percent,
  size = 64,
  strokeWidth = 6,
  className = "",
  trackColor = "rgba(255,255,255,0.12)",
  ringColor = "#8FD13F",
}: CompletionRingProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
    </div>
  );
}
