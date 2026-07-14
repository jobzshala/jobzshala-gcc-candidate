export default function MapPanel({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden rounded-2xl border border-jz-grey-400 bg-jz-bg-primary ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(circle, var(--jz-blue-400) 1px, transparent 1.5px)",
        backgroundSize: "18px 18px",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-jz-bg-primary via-transparent to-jz-bg-primary opacity-80" />
    </div>
  );
}
