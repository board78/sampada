"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { IoSparkles } from "react-icons/io5";

// ─── WinnerCard ───────────────────────────────────────────────────────────────
// Shows one winner's name, avatar and prize with a confetti burst on hover.

type Props = {
  winnerName: string;
  imageUrl: string | null;
  amount: string;
  gradientClass: string;
  burstKey: number;   // increment this to trigger a new confetti burst
  onBurst: () => void;
};

export function WinnerCard({ winnerName, imageUrl, amount, gradientClass, burstKey, onBurst }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || burstKey === 0) {
      canvas?.getContext("2d")?.clearRect(0, 0, canvas?.width ?? 0, canvas?.height ?? 0);
      return;
    }

    let cancelled = false;
    const colors = ["#fffbeb","#fef3c7","#fde68a","#fcd34d","#fbbf24","#f59e0b","#d97706","#b45309"];

    void import("canvas-confetti").then(({ default: confetti }) => {
      if (cancelled) return;
      const fire = confetti.create(canvas, { resize: true, useWorker: false });
      fire({ particleCount: 32, spread: 42, startVelocity: 26, ticks: 90,  gravity: 1.05, scalar: 0.6,  origin: { x: 0.5, y: 0.35 }, colors });
      fire({ particleCount: 18, spread: 70, startVelocity: 32, ticks: 110, gravity: 0.9,  scalar: 0.45, origin: { x: 0.5, y: 0.3  }, colors, shapes: ["circle"] });
    });

    return () => { cancelled = true; };
  }, [burstKey]);

  return (
    <motion.article whileHover={{ y: -6 }} transition={{ duration: 0.18 }} onPointerEnter={onBurst}>
      <div className={`group relative overflow-hidden rounded-3xl bg-linear-to-br ${gradientClass} p-px shadow-md shadow-blue-500/10`}>
        <div className="sl-winner-card-face relative overflow-hidden rounded-3xl border border-blue-200/40 bg-white p-5 shadow-xs">
          <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-2 h-full w-full" aria-hidden />

          <div className="pointer-events-none absolute inset-0 opacity-60">
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-300/10 blur-2xl" />
            <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-blue-100/30 blur-2xl" />
          </div>

          <div className="relative z-4 flex flex-col items-center text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Winner</p>
            <span className="mt-2 inline-flex items-center justify-center rounded-full border border-blue-200/60 bg-blue-50 px-3 py-1 text-[11px] font-bold leading-none text-blue-700 sm:text-xs">
              Won {amount}
            </span>
            <p className="mt-3 max-w-60 text-base font-bold leading-snug text-slate-900 sm:max-w-none">{winnerName}</p>

            <div className="mt-5 flex w-full items-center justify-center">
              <div className="relative h-28 w-28 overflow-hidden rounded-full border border-blue-200/40 bg-slate-50 shadow-[0_0_0_6px_rgba(37,99,235,0.06)]">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl} alt={`${winnerName} winner image`} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-blue-600 to-indigo-700 text-3xl font-bold text-white shadow-inner">
                    {winnerName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.4),transparent_55%)]" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-600">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <IoSparkles className="w-3 h-3" />
              </span>
              <span className="font-semibold text-slate-700">Congratulations!</span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
