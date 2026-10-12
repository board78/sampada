import { motion } from "framer-motion";
import { formatDrawNumber } from "@/lib/utils";
import type { LiveResult } from "@/lib/types";

interface LiveResultsBoardProps {
  liveResults: LiveResult[];
  title: string;
}

export function LiveResultsBoard({ liveResults, title }: LiveResultsBoardProps) {
  return (
    <section className="sl-live-results-board royal-panel min-w-0 rounded-3xl border border-emerald-500/25 bg-[#070707] p-4 sm:rounded-[28px] sm:p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold sm:text-xl text-white">{title}</h2>
        {liveResults.length > 0 && (
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        )}
      </div>
      <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
        {liveResults.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-emerald-500/20 bg-black/50 px-4 py-8 text-center">
            <p className="text-sm font-semibold text-zinc-300">No results declared yet</p>
            <p className="mt-1 text-xs text-zinc-500">Results will appear here after each draw.</p>
          </div>
        ) : liveResults.map((result) => (
          <motion.div key={result.id} whileHover={{ x: 3 }} transition={{ duration: 0.16 }}
            className="sl-live-result-row flex items-center justify-between gap-3 rounded-2xl border border-emerald-500/20 bg-[#0d0d0d] px-4 py-2.5 sm:py-3 transition hover:bg-[#141414]">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {result.drawNumber != null && (
                  <span className="bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider">
                    {formatDrawNumber(result.drawNumber)}
                  </span>
                )}
                <span className="sl-live-result-label block truncate text-sm font-semibold text-white capitalize">{result.drawName.replace(/\b\w/g, c => c.toUpperCase())}</span>
              </div>
              {result.winnerName && <span className="block truncate text-[10px] text-zinc-400">Winner: {result.winnerName}</span>}
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="sl-ticket-pill rounded-full px-3 py-1 font-mono text-xs font-semibold tabular-nums shadow-sm">{result.winningTicket}</span>
              <span className="text-[10px] font-bold text-emerald-400">{result.prize}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
