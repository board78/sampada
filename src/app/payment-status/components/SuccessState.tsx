import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CheckIcon } from "./Icons";
import type { DrawInfo } from "../types";

interface SuccessStateProps {
  amount: number | null;
  draws: DrawInfo[];
}

export function SuccessState({ amount, draws }: SuccessStateProps) {
  const router = useRouter();
  const totalTickets = draws.reduce((sum, d) => sum + d.tickets, 0);

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 w-full max-w-md"
    >
      <div className="royal-panel rounded-4xl border border-emerald-400/20 bg-[#0b1a10]/90 p-8 shadow-[0_0_80px_rgba(34,197,94,0.12)] backdrop-blur-xl">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.15, 1] }}
            transition={{ duration: 0.5, times: [0, 0.7, 1], ease: "easeOut" }}
          >
            <CheckIcon />
          </motion.div>

          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-400/80">
            Payment Confirmed
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
            🎉 Tickets Booked!
          </h1>
          {amount != null && (
            <p className="mt-1 text-sm font-semibold text-emerald-300">
              ₹{amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })} paid
            </p>
          )}
        </div>

        {draws.length > 0 && (
          <div className="mt-6 space-y-3">
            {draws.map((d, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.12 }}
                className="rounded-2xl border border-white/8 bg-white/4 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-white">{d.name}</p>
                  <span className="shrink-0 rounded-full bg-amber-400/15 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                    {d.tickets} ticket{d.tickets !== 1 ? "s" : ""}
                  </span>
                </div>
                {d.numbers.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {d.numbers.map((n) => (
                      <span
                        key={n}
                        className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] font-semibold text-zinc-200"
                      >
                        {n}
                      </span>
                    ))}
                    {d.tickets > d.numbers.length && (
                      <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-zinc-500">
                        +{d.tickets - d.numbers.length} more
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        <p className="mt-5 text-center text-xs text-zinc-500">
          {totalTickets} ticket{totalTickets !== 1 ? "s" : ""} confirmed · check your profile for full history
        </p>

        <div className="mt-5 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => router.push("/my-tickets")}
            className="w-full rounded-full sl-cta-gradient py-3 text-sm font-bold sl-force-light-text"
          >
            View My Tickets
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
