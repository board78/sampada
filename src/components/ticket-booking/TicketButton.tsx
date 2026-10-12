"use client";

import { motion } from "framer-motion";
import type { TicketPublic } from "@/lib/draws";

export function TicketButton({
  ticket,
  isSelected,
  onToggle,
}: {
  ticket: TicketPublic;
  isSelected: boolean;
  onToggle: (t: TicketPublic) => void;
}) {
  const isSold = ticket.status === "sold";
  const displayNum = (ticket.number || "—").trim().toLowerCase();

  let base =
    "relative w-full min-h-[2.5rem] rounded-lg border px-1 py-2 text-center font-mono text-[10px] font-semibold tabular-nums leading-tight transition select-none sm:min-h-[2.75rem] sm:text-[11px]";

  if (isSold) {
    base += " border-zinc-800 bg-zinc-900/60 text-zinc-600 cursor-not-allowed line-through";
  } else if (isSelected) {
    base +=
      " sl-ticket-selected border-emerald-500 bg-linear-to-b from-emerald-500 to-emerald-700 text-white shadow-md shadow-emerald-500/25";
  } else if (ticket.category === "lp_special") {
    base +=
      " sl-ticket-lp border-emerald-500/40 bg-emerald-950/40 text-emerald-300 hover:border-emerald-400 hover:bg-emerald-900/50 cursor-pointer";
  } else if (ticket.category === "special") {
    base +=
      " border-purple-400/40 bg-purple-950/40 text-purple-300 hover:border-purple-400 hover:bg-purple-900/50 cursor-pointer";
  } else {
    base +=
      " border-zinc-800 bg-[#0d0d0d] text-zinc-200 hover:border-emerald-500 hover:bg-emerald-950/30 hover:text-emerald-300 cursor-pointer shadow-2xs";
  }

  return (
    <motion.button
      type="button"
      className={base}
      onClick={() => onToggle(ticket)}
      whileTap={!isSold ? { scale: 0.94 } : {}}
      transition={{ duration: 0.08 }}
    >
      <span className="block max-w-full truncate" title={displayNum}>
        {displayNum}
      </span>
      {ticket.category === "lp_special" && (
        <span className="sl-ticket-lp-badge absolute right-0.5 top-0.5 rounded-sm bg-cyan-400/30 px-0.5 text-[8px] text-cyan-300">
          LP
        </span>
      )}
      {ticket.category === "special" && (
        <span className="absolute right-0.5 top-0.5 rounded-sm bg-purple-400/30 px-0.5 text-[8px] text-purple-300">
          SP
        </span>
      )}
    </motion.button>
  );
}
