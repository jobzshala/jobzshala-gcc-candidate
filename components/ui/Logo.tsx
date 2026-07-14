export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center font-serif text-xl font-bold text-jz-white-50 ${className}`}>
      jobz
      <span className="ml-0.5 rounded-md bg-jz-yellow-400 px-1.5 py-0.5 text-jz-blue-900">shala</span>
    </span>
  );
}
