"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Stat } from "@/app/siteCopy";

// ─── Counter ──────────────────────────────────────────────────────────────────
// Animates a number from 0 to `value` with an ease-out cubic curve.

export function Counter({ label, value, suffix, compact }: Stat & { compact?: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const DURATION = 1400;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  if (compact) {
    return (
      <motion.article
        whileHover={{ y: -2, boxShadow: "0 0 18px rgba(16,185,129,0.25)" }}
        className="rounded-xl border border-emerald-500/25 bg-[#0a0a0a] px-3 py-2 shadow-xs"
      >
        <p className="text-base font-bold tabular-nums leading-none text-emerald-400 sm:text-lg">
          {display.toLocaleString("en-IN")}{suffix}
        </p>
        <p className="mt-1 text-[10px] leading-snug text-zinc-400 sm:text-[11px]">{label}</p>
      </motion.article>
    );
  }

  return (
    <motion.article
      whileHover={{ y: -4, boxShadow: "0 0 28px rgba(16,185,129,0.3)" }}
      className="rounded-2xl border border-emerald-500/25 bg-[#0a0a0a] p-4 transition shadow-xs"
    >
      <p className="text-2xl font-bold text-emerald-400">
        {display.toLocaleString("en-IN")}{suffix}
      </p>
      <p className="mt-1 text-xs text-zinc-400">{label}</p>
    </motion.article>
  );
}

// ─── TimeBox ──────────────────────────────────────────────────────────────────
// One cell in the countdown timer (hours / minutes / seconds).

export function TimeBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="sl-time-box flex min-w-0 flex-1 flex-col items-center rounded-xl border border-emerald-500/30 bg-[#0d0d0d] px-2 py-2 shadow-xs sm:px-3">
      <span className="sl-time-value text-lg font-bold tabular-nums text-emerald-400 sm:text-xl">{value}</span>
      <span className="sl-time-label mt-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-400 sm:text-[10px]">{label}</span>
    </div>
  );
}
