type IconProps = {
  className?: string;
};

export function SparkleIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M8 1.5c.3 2.1 1 3.6 2.1 4.6 1 1 2.5 1.7 4.4 2-1.9.3-3.4 1-4.4 2-1 1-1.8 2.5-2.1 4.6-.3-2.1-1-3.6-2.1-4.6-1-1-2.5-1.7-4.4-2 1.9-.3 3.4-1 4.4-2 1-1 1.8-2.5 2.1-4.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TickIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" stroke="var(--jz-green-500, #00af00)" strokeWidth="1.5" />
      <path
        d="M7.5 12.5l2.8 2.8 6.2-6.6"
        stroke="var(--jz-green-500, #00af00)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CrossIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" stroke="var(--jz-red-600, #d90000)" strokeWidth="1.5" />
      <path
        d="M9 9l6 6M15 9l-6 6"
        stroke="var(--jz-red-600, #d90000)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ChevronDownIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowRightIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ShieldCheckIcon({ className = "size-10" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path
        d="M24 4l16 6v11c0 10.5-6.8 18.8-16 23-9.2-4.2-16-12.5-16-23V10l16-6Z"
        stroke="var(--jz-green-500, #00af00)"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="rgba(0,175,0,0.08)"
      />
      <path
        d="M16.5 24l5 5 10-11"
        stroke="var(--jz-green-500, #00af00)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MenuIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
