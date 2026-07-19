import Logo from "./Logo";

// Shown only once, while redux-persist rehydrates the auth state on first
// app boot (see lib/store/StoreProvider.tsx) — not on every navigation.
export default function AppLoader() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-jz-blue-950">
      <div className="flex flex-col items-center gap-7">
        <div className="relative flex items-center justify-center">
          <span className="absolute size-28 animate-pulse rounded-full bg-jz-yellow-400/25 blur-2xl" />
          <span className="absolute size-16 animate-ping rounded-full bg-jz-yellow-400/10" />
          <Logo className="relative h-9 w-auto" />
        </div>
        <div className="flex items-center gap-2">
          <span className="size-1.5 animate-bounce rounded-full bg-jz-yellow-400 [animation-delay:-0.3s]" />
          <span className="size-1.5 animate-bounce rounded-full bg-jz-yellow-400 [animation-delay:-0.15s]" />
          <span className="size-1.5 animate-bounce rounded-full bg-jz-yellow-400" />
        </div>
      </div>
    </div>
  );
}
