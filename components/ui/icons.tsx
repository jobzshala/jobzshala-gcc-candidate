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

export function BriefcaseIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="7.5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3 13h18" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function UserIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="3.75" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.5 20c1.2-3.8 4.3-6 7.5-6s6.3 2.2 7.5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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

export function CheckIcon({ className = "size-3" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function UploadIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7 9.5l5-5 5 5M12 4.5V15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4.5 15v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CameraIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.2a1 1 0 0 0 .82-.43l.96-1.39A1 1 0 0 1 9.3 4.7h5.4a1 1 0 0 1 .82.48l.96 1.39a1 1 0 0 0 .82.43h2.2A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function TrashIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 7h16M9.5 7V5.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V7M6.5 7l.7 11a1.5 1.5 0 0 0 1.5 1.4h6.6a1.5 1.5 0 0 0 1.5-1.4l.7-11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SpinnerIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`animate-spin ${className}`} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.2" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function DownloadIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7 10l5 5 5-5M12 4.5V15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4.5 15v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function VideoIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="6" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M15 10.5l5.5-3v9l-5.5-3v-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function RecordIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" fill="currentColor" />
    </svg>
  );
}

export function DocumentIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7 3.5h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M14 3.5V8h4" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 13h6M9 16.5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function GoogleIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.65Z"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.24 0 5.95-1.08 7.93-2.92l-3.87-3.01c-1.08.72-2.46 1.15-4.06 1.15-3.12 0-5.77-2.11-6.72-4.94H1.28v3.11C3.26 21.3 7.31 24 12 24Z"
        fill="#34A853"
      />
      <path d="M5.28 14.28A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.38-2.28V6.61H1.28A11.98 11.98 0 0 0 0 12c0 1.94.46 3.77 1.28 5.39l4-3.11Z" fill="#FBBC05" />
      <path
        d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.23 0 12 0 7.31 0 3.26 2.7 1.28 6.61l4 3.11C6.23 6.88 8.88 4.77 12 4.77Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function WhatsAppIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12.02 2C6.5 2 2.03 6.48 2.03 12c0 1.77.46 3.45 1.28 4.94L2 22l5.2-1.27a9.96 9.96 0 0 0 4.82 1.23h.01c5.52 0 9.99-4.48 9.99-10S17.54 2 12.02 2Z"
        fill="#25D366"
      />
      <path
        d="M17.24 14.7c-.24.68-1.18 1.24-1.94 1.4-.52.11-1.2.2-3.48-.75-2.92-1.21-4.8-4.18-4.95-4.38-.14-.2-1.18-1.57-1.18-3 0-1.42.74-2.12 1-2.41.24-.27.53-.34.7-.34s.35 0 .5.01c.17.01.38-.06.6.45.24.56.8 1.94.87 2.08.07.14.11.3.02.49-.09.19-.14.3-.28.46-.14.16-.28.36-.4.48-.14.14-.28.29-.12.56.16.27.71 1.16 1.52 1.88 1.05.93 1.92 1.22 2.19 1.36.27.14.43.11.59-.07.16-.18.68-.79.86-1.06.18-.27.35-.22.59-.13.24.09 1.52.72 1.78.85.27.14.44.2.5.32.07.11.07.65-.17 1.31Z"
        fill="#fff"
      />
    </svg>
  );
}

export function SunIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2.5v2.5M12 19v2.5M21.5 12H19M5 12H2.5M18.36 5.64l-1.77 1.77M7.41 16.59l-1.77 1.77M18.36 18.36l-1.77-1.77M7.41 7.41 5.64 5.64"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MoonIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.08"
      />
    </svg>
  );
}

export function EyeIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function TargetIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

export function GraduationCapIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M2 9.5 12 5l10 4.5-10 4.5-10-4.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M6.5 11.6v4c0 1.4 2.5 2.9 5.5 2.9s5.5-1.5 5.5-2.9v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M21 9.5v5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function GlobeIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function FolderIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M3.5 6.5a1.5 1.5 0 0 1 1.5-1.5h4.4l2 2.2H19a1.5 1.5 0 0 1 1.5 1.5v8.8a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5v-11Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronRightIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SearchIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function MailIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M3.75 6.75h16.5v10.5a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V6.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function EyeOffIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.24 4.24M9.36 5.55A10.6 10.6 0 0 1 12 5.25c6.4 0 10 6.75 10 6.75a13.3 13.3 0 0 1-3.13 3.9M6.5 6.6C4 8.2 2 12 2 12s3.6 6.75 10 6.75c1.35 0 2.56-.3 3.62-.78"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GridIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function LockIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3.5" y="11" width="17" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function QuestionIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M9.3 9.3a2.7 2.7 0 1 1 3.9 2.4c-.7.4-1.2.9-1.2 1.8v.3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

export function CompassIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M15.5 8.5 13 13l-4.5 2.5L11 11l4.5-2.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function ClipboardIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="5" y="4.5" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 4.5V3.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 11h6M9 15h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ClockIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7v5.5l3.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChatIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M21 11.5a8 8 0 0 1-8 8h-.5L8 21.5l.6-2.9A8 8 0 1 1 21 11.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SendIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M21 3 3 10.5l7 2.5M21 3l-2.5 18-7-8L21 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StarIcon({ className = "size-5", filled = true }: IconProps & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} className={className} aria-hidden="true">
      <path
        d="M12 2.5l2.9 6.06 6.6.87-4.83 4.6 1.24 6.6L12 17.6l-5.91 3.03 1.24-6.6-4.83-4.6 6.6-.87L12 2.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PhoneIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M6.5 3.5h2.7l1.3 3.9-2 1.6a12.2 12.2 0 0 0 6.5 6.5l1.6-2 3.9 1.3v2.7a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 5 5.1a1.5 1.5 0 0 1 1.5-1.6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CalendarIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function PlayIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

export function IdCardIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="8" cy="10" r="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15 8h4M15 12h4M6 16h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function AwardIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="6" stroke="currentColor" strokeWidth="1.8" />
      <path d="m9 13.7-1 6.3 4-2 4 2-1-6.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PaperclipIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M21.4 11.5 12.3 20.6a4.5 4.5 0 0 1-6.4-6.4l9.5-9.5a3 3 0 0 1 4.2 4.2L10 18.5a1.5 1.5 0 0 1-2.1-2.1L16.4 8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeartIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.6z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckCircleIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M22 11.1V12a10 10 0 1 1-5.9-9.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function AlertIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PinIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function BellIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CreditCardIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="2.5" y="5" width="19" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M2.5 10h19" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function LogoutIcon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
