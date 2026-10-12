"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";

interface VisitorCounterProps {
  language?: "en" | "hi";
}

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function VisitorCounter({ language = "en" }: VisitorCounterProps) {
  // Call POST on mount to record view, then let SWR handle the GET polling
  useEffect(() => {
    fetch("/api/visitors", { method: "POST" }).catch(() => {});
  }, []);

  // SWR automatically handles polling, caching, and stops polling when tab is hidden!
  const { data } = useSWR("/api/visitors", fetcher, {
    refreshInterval: 15000,
    revalidateOnFocus: true,
  });

  const count = data?.count || 0;

  // Format count to standard 5-digit string, e.g. "01439"
  const digits = String(count).padStart(5, "0").split("");

  const tickerHi = "प्लेटफॉर्म लाइव ट्रैफिक";
  const tickerEn = "PLATFORM LIVE TRAFFIC";
  
  const titleHi = "सक्रिय विजिट्स ट्रैकर";
  const titleEn = "Subhlaxmi Traffic Pulse";

  const descHi = "रीअल-टाइम में कुल संचयी पेज व्यूज का लाइव ट्रैकिंग इंडेक्स।";
  const descEn = "Live indexing of cumulative platform views refreshed in real-time.";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-blue-200/50 bg-white p-6 shadow-sm md:p-8 transition-all duration-300">
      
      {/* Background abstract gradient blobs for depth */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/8 blur-[100px]" />
      <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-blue-300/8 blur-[100px]" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        
        {/* Left Side: Professional Stats Identity */}
        <div className="flex flex-col items-start gap-2.5 max-w-xl">
          <div className="flex items-center gap-2">
            {/* Glowing heartbeat LIVE dot */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-emerald-700">
              {language === "hi" ? tickerHi : tickerEn}
            </span>
          </div>

          <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl font-sans">
            {language === "hi" ? titleHi : titleEn}
          </h3>
          
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {language === "hi" ? descHi : descEn}
          </p>
        </div>

        {/* Right Side: Ultra-Modern SaaS Odometer Display */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          
          {/* Decorative Sparkline Chart */}
          <div className="hidden sm:flex flex-col items-end gap-1 px-2">
            <svg className="w-24 h-8 text-emerald-600" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M0 25 C10 25, 15 5, 25 15 C35 25, 40 10, 50 5 C60 0, 70 20, 80 12 C90 5, 95 18, 100 2" strokeDasharray="400" strokeDashoffset="0" className="animate-[dash_3s_ease-out_infinite]" />
              <defs>
                <style>{`
                  @keyframes dash {
                    to { stroke-dashoffset: 0; }
                  }
                `}</style>
              </defs>
            </svg>
            <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase">
              Active Index
              </span>
          </div>

          {/* Odometer Glass Panel */}
          <div className="flex items-center gap-4 bg-blue-50/60 border border-blue-200/60 rounded-2xl p-3 px-4 shadow-2xs backdrop-blur-md mx-auto">
            
            {/* Odometer Number Roll */}
            <div className="flex items-center gap-0.5">
              
              {/* Eye Icon */}
              <div className="mr-2 text-slate-500">
                <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.864 7.575 7.48 5 12 5c4.52 0 8.136 2.575 9.964 6.678.019.04.019.088 0 .128C20.136 16.425 16.52 19 12 19c-4.52 0-8.136-2.575-9.964-6.678z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>

              {digits.map((digit, idx) => {
                const isLast = idx === digits.length - 1;
                return (
                  <div
                    key={idx}
                    className={`relative w-6 h-10 overflow-hidden flex items-center justify-center text-2xl font-black font-mono tracking-tighter ${
                      isLast 
                        ? "text-blue-600" 
                        : "text-slate-900"
                    }`}
                  >
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={digit}
                        initial={{ y: 28, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -28, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 180, damping: 16 }}
                        className="absolute select-none font-sans"
                      >
                        {digit}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Growth Rate / Upward Trend Badge */}
            <div className="flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 text-[10px] font-bold text-emerald-400 shadow-sm">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
              </svg>
              <span>+32.6%</span>
            </div>

          </div>
          
        </div>

      </div>

    </div>
  );
}
