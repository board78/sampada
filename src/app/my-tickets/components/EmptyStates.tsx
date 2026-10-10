import { useRouter } from "next/navigation";

export function SignInRequiredState({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="royal-panel flex flex-col items-center justify-center rounded-[28px] border border-white/10 bg-[#14070f]/90 p-8 py-16 text-center backdrop-blur-xl">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-300">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold">Sign in to view your tickets</h2>
      <p className="mt-2 max-w-sm text-sm text-zinc-400">
        Please sign in with your Subhlaxmi account to access your ticket booking history and results.
      </p>
      <button
        type="button"
        onClick={onSignIn}
        className="sl-cta-gradient mt-6 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02] active:scale-[0.98]"
      >
        Sign In Now
      </button>
    </div>
  );
}

export function LoadingTicketsState() {
  return (
    <div className="royal-panel flex flex-col items-center justify-center rounded-[28px] border border-white/10 bg-[#14070f]/90 p-8 py-16 text-center backdrop-blur-xl">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400/30 border-t-amber-400" />
      <p className="mt-3 text-sm text-zinc-400">Loading your tickets...</p>
    </div>
  );
}

export function NoTicketsState() {
  const router = useRouter();
  
  return (
    <div className="royal-panel flex flex-col items-center justify-center rounded-[28px] border border-white/10 bg-[#14070f]/90 p-8 py-16 text-center backdrop-blur-xl">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-zinc-500/20 bg-zinc-500/5 text-zinc-400">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <path d="M10 9H8" />
          <path d="M16 13H8" />
          <path d="M16 17H8" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold">No tickets booked yet</h2>
      <p className="mt-2 max-w-sm text-sm text-zinc-400">
        You haven&apos;t booked any lottery tickets yet. Join one of our active draws to win big rewards!
      </p>
      <button
        type="button"
        onClick={() => router.push("/")}
        className="sl-cta-gradient mt-6 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02] active:scale-[0.98]"
      >
        Explore Active Draws
      </button>
    </div>
  );
}
