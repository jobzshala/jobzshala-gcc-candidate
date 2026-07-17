type RoleToggleProps = {
  candidateLabel: string;
  employerLabel: string;
  employerHref: string;
};

export default function RoleToggle({ candidateLabel, employerLabel, employerHref }: RoleToggleProps) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-xl border border-jz-border bg-jz-blue-900 p-1">
      <span className="rounded-lg bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-3 py-2 text-center text-sm font-semibold text-jz-blue-800">
        {candidateLabel}
      </span>
      <a
        href={employerHref}
        className="rounded-lg px-3 py-2 text-center text-sm text-jz-white-200 transition-colors hover:bg-jz-blue-800 hover:text-jz-white-50"
      >
        {employerLabel}
      </a>
    </div>
  );
}
