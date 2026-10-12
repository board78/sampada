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
    base += " border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed line-through";
  } else if (isSelected) {
    base +=
      " sl-ticket-selected border-blue-600 bg-linear-to-b from-blue-600 to-blue-800 text-white shadow-md";
  } else if (ticket.category === "lp_special") {
    base +=
      " sl-ticket-lp border-blue-400/40 bg-blue-50 text-blue-700 hover:border-blue-500 hover:bg-blue-100 cursor-pointer";
  } else if (ticket.category === "special") {
    base +=
      " border-purple-400/40 bg-purple-50 text-purple-700 hover:border-purple-500 hover:bg-purple-100 cursor-pointer";
  } else {
    base +=
      " border-slate-200 bg-white text-slate-800 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-900 cursor-pointer shadow-2xs";
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
