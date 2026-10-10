import { BadgeCheck, Sparkles } from "lucide-react";

export function HelpCenterHeader() {
  return (
    <section className="royal-panel relative mb-7 overflow-hidden rounded-[28px] border border-amber-300/20 bg-linear-to-br from-[#250b18]/95 via-[#17060f]/95 to-[#32120d]/95 px-5 py-7 shadow-2xl shadow-black/20 sm:mb-9 sm:px-8 sm:py-9">
      <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-amber-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-amber-200">
            <Sparkles size={14} /> Help centre
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">How can we help you today?</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-300">
            Get quick answers, find payment guidance, or send our support team a message. We are here to make your experience smooth and secure.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
            <BadgeCheck size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Always here to help</p>
            <p className="mt-0.5 text-[11px] text-zinc-400">Response within 24 hours</p>
          </div>
        </div>
      </div>
    </section>
  );
}
