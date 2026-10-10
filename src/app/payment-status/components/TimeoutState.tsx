import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface TimeoutStateProps {
  onCheckAgain: () => void;
}

export function TimeoutState({ onCheckAgain }: TimeoutStateProps) {
  const router = useRouter();
  
  return (
    <motion.div
      key="timeout"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 w-full max-w-sm text-center"
    >
      <div className="royal-panel rounded-[28px] border border-amber-400/20 bg-[#1a1408]/90 p-8 backdrop-blur-xl">
        <div className="flex justify-center text-5xl">⏳</div>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-400/80">
          Payment Pending
        </p>
        <h1 className="mt-1 text-xl font-bold text-white">Still Processing</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Your payment is being processed by the bank. If amount was deducted, your tickets will appear in your profile within a few minutes.
        </p>
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onCheckAgain}
            className="w-full rounded-full sl-cta-gradient py-3 text-sm font-bold sl-force-light-text"
          >
            Check Again
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full rounded-full border border-white/10 bg-white/5 py-3 text-sm font-semibold text-zinc-300 hover:bg-white/10"
          >
            Back to Home
          </button>
        </div>
      </div>
    </motion.div>
  );
}
