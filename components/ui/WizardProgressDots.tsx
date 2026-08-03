interface WizardProgressDotsProps {
  total: number;
  // 0-indexed — the step currently on screen.
  currentIndex: number;
  // Steps strictly before currentIndex that are actually complete (not just
  // "passed through") render green instead of the neutral track color, same
  // "done" signal profileCompletion.ts already tracks per step.
  doneIndexes: Set<number>;
  className?: string;
}

// Mirrors CompletionRing.tsx's color tokens (#8FD13F done, jz-yellow-400
// active) so the wizard's per-step dots and the top-bar completion ring
// read as the same progress language.
export default function WizardProgressDots({ total, currentIndex, doneIndexes, className = "" }: WizardProgressDotsProps) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`} role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={currentIndex + 1}>
      {Array.from({ length: total }, (_, i) => {
        const isCurrent = i === currentIndex;
        const isDone = doneIndexes.has(i);
        return (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              isCurrent ? "bg-jz-yellow-400" : isDone ? "bg-[#8FD13F]" : "bg-jz-white-600/30"
            }`}
          />
        );
      })}
    </div>
  );
}
