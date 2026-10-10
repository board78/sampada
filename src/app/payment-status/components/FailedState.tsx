import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FailIcon } from "./Icons";

export function FailedState() {
  const router = useRouter();
  return (
    <motion.div
      key="failed"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 w-full max-w-sm text-center"
    >
      <div className="royal-panel rounded-[28px] border border-red-400/20 bg-[#1a0c0c]/90 p-8 backdrop-blur-xl">
        <div className="flex justify-center">
          <FailIcon />
        </div>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-red-400/80">
          Payment Failed
        </p>
        <h1 className="mt-1 text-xl font-bold text-white">Transaction Declined</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Your payment could not be processed. No amount has been deducted.
        </p>
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => router.push("/cart")}
            className="w-full rounded-full sl-cta-gradient py-3 text-sm font-bold sl-force-light-text"
          >
            Try Again
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
