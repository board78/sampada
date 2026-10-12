import { motion } from "framer-motion";
import type { TicketInfo } from "../types";

interface TicketCardProps {
  ticket: TicketInfo;
  index: number;
}

export function getStatusInfo(status: TicketInfo["status"]) {
  switch (status) {
    case "won":
      return { label: "Won 🏆", colorClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]" };
    case "lost":
      return { label: "Lost", colorClass: "border-zinc-500/30 bg-zinc-500/5 text-zinc-400" };
    case "booked":
      return { label: "Confirmed", colorClass: "border-blue-500/30 bg-blue-500/10 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]" };
    case "draw_pending":
    default:
      return { label: "Draw Pending", colorClass: "border-amber-500/30 bg-amber-500/10 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]" };
  }
}

export function TicketCard({ ticket, index }: TicketCardProps) {
  const { label: statusLabel, colorClass: statusColorClass } = getStatusInfo(ticket.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.23, 1, 0.32, 1],
        delay: index * 0.1 
      }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative overflow-hidden rounded-3xl p-px"
    >
      {/* Animated Gradient Border Layer */}
      <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-white/5 opacity-50 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute -inset-full animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#f59e0b_100%)] opacity-0 transition-opacity duration-500 group-hover:opacity-30" />
      
      {/* Inner Card */}
      <div className="royal-panel relative h-full rounded-3xl border border-blue-200/50 bg-white p-6 shadow-sm">
        
        {/* Shimmer Effect */}
        <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-blue-500/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

        {/* Ticket notch decorators */}
        <div className="absolute -left-2.5 top-[50%] h-5 w-5 -translate-y-1/2 rounded-full border-r border-blue-200 bg-[#f0f6ff] shadow-inner" />
        <div className="absolute -right-2.5 top-[50%] h-5 w-5 -translate-y-1/2 rounded-full border-l border-blue-200 bg-[#f0f6ff] shadow-inner" />

        {/* Top section: draw info */}
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-slate-900 transition-colors group-hover:text-blue-700">{ticket.drawName}</h3>
            <p className="mt-0.5 text-xs font-medium text-slate-500">{ticket.drawTime}</p>
          </div>
          <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 group-hover:scale-105 ${statusColorClass}`}>
            {statusLabel}
          </span>
        </div>

        {/* Mid section: ticket number */}
        <div className="my-5 border-t border-dashed border-blue-200/60 pt-5 text-center relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">Ticket Number</p>
          <div className="mt-2 inline-block rounded-xl bg-blue-50 px-6 py-2 shadow-xs border border-blue-200/60">
            <p className="font-mono text-2xl font-extrabold tracking-[0.2em] text-blue-700">
              {ticket.ticketNumber}
            </p>
          </div>
        </div>

        {/* Bottom section: prize and booked date */}
        <div className="flex items-end justify-between border-t border-slate-100 pt-4 text-xs relative z-10">
          <div>
            <p className="font-medium text-slate-500">Prize Pool</p>
            <p className="mt-1 font-bold text-slate-900">{ticket.prize}</p>
          </div>
          <div className="text-right">
            <p className="font-medium text-slate-500">Booked On</p>
            <p className="mt-1 font-semibold text-slate-700">
              {new Date(ticket.bookedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
