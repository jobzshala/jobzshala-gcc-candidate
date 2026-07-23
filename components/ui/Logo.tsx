import Image from "next/image";

// Pass `priority` on pages where this is the largest above-the-fold
// element (the standalone auth pages — login/register/forgot-password/
// reset-password/change-password all render just this logo above a form,
// with no competing Header component) so Next.js preloads it instead of
// flagging it as an unoptimized LCP image.
export default function Logo({ className = "", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/images/Jobshala-logo.png"
      alt="Jobzshala"
      width={183}
      height={37}
      className={`h-8 w-auto ${className}`}
      priority={priority}
    />
  );
}
