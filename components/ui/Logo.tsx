import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/images/Jobshala-logo.png"
      alt="Jobzshala"
      width={183}
      height={37}
      className={`h-8 w-auto ${className}`}
    />
  );
}
