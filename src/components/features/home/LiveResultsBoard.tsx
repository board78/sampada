import { motion } from "framer-motion";
import { formatDrawNumber } from "@/lib/utils";
import type { LiveResult } from "@/lib/types";

interface LiveResultsBoardProps {
  liveResults: LiveResult[];
  title: string;
}

export function LiveResultsBoard({ liveResults, title }: LiveResultsBoardProps) {
  return (
    <section className="sl-live-results-board royal-panel min-w-0 rounded-3xl border border-blue-200/40 bg-white p-4 sm:rounded-[28px] sm:p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold sm:text-xl text-slate-900">{title}</h2>
        {liveResults.length > 0 && (
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        )}
      </div>
      <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
        {liveResults.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-blue-200/50 bg-blue-50/40 px-4 py-8 text-center">
            <p className="text-sm font-semibold text-slate-700">No results declared yet</p>
            <p className="mt-1 text-xs text-slate-500">Results will appear here after each draw.</p>
          </div>
        ) : liveResults.map((result) => (
          <motion.div key={result.id} whileHover={{ x: 3 }} transition={{ duration: 0.16 }}
            className="sl-live-result-row flex items-center justify-between gap-3 rounded-2xl border border-blue-200/40 bg-blue-50/30 px-4 py-2.5 sm:py-3 transition hover:bg-blue-50/70">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {result.drawNumber != null && (
                  <span className="bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider">
                    {formatDrawNumber(result.drawNumber)}
                  </span>
                )}
                <span className="sl-live-result-label block truncate text-sm font-semibold text-slate-900 capitalize">{result.drawName.replace(/\b\w/g, c => c.toUpperCase())}</span>
              </div>
              {result.winnerName && <span className="block truncate text-[10px] text-slate-500">Winner: {result.winnerName}</span>}
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="sl-ticket-pill rounded-full px-3 py-1 font-mono text-xs font-semibold tabular-nums shadow-sm">{result.winningTicket}</span>
              <span className="text-[10px] font-bold text-emerald-700">{result.prize}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
