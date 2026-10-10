import { motion } from "framer-motion";
import { Spinner } from "./Icons";

interface CheckingStateProps {
  polls: number;
  maxPolls: number;
}

export function CheckingState({ polls, maxPolls }: CheckingStateProps) {
  return (
    <motion.div
      key="checking"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="relative z-10 w-full max-w-sm text-center"
    >
      <div className="royal-panel rounded-[28px] border border-white/10 bg-[#17060d]/90 p-8 backdrop-blur-xl">
        <div className="flex justify-center">
          <Spinner />
        </div>
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300/70">
          QPC Secure Pay
        </p>
        <h1 className="mt-2 text-xl font-bold text-white">Confirming payment…</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Please wait while we verify your transaction.
        </p>
        <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-white/8">
          <motion.div
            className="h-full rounded-full bg-linear-to-r from-amber-500 to-orange-500"
            initial={{ width: "4%" }}
            animate={{ width: `${Math.min(98, (polls / maxPolls) * 100 + 4)}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
        <p className="mt-2 text-[10px] text-zinc-600">
          {polls}/{maxPolls} checks · up to ~90 s
        </p>
      </div>
    </motion.div>
  );
}
