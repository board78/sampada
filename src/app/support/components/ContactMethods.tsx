import { Clock3, Mail } from "lucide-react";

export function ContactMethods() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <a href="mailto:subhlaxmilottery@gmail.com" className="royal-panel group flex items-start gap-4 rounded-[22px] border border-white/10 bg-[#14070f]/85 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-amber-400/35 hover:bg-[#1c0912]">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300 transition group-hover:bg-amber-400/20">
          <Mail size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Email support</p>
          <p className="mt-1 text-xs leading-5 text-zinc-400">For account, payment and booking queries.</p>
          <p className="mt-2 text-sm font-semibold text-amber-300">subhlaxmilottery@gmail.com</p>
        </div>
      </a>
      <div className="royal-panel flex items-start gap-4 rounded-[22px] border border-white/10 bg-[#14070f]/85 p-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-fuchsia-400/10 text-fuchsia-200">
          <Clock3 size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Quick response</p>
          <p className="mt-1 text-xs leading-5 text-zinc-400">Our customer support team reviews every request carefully.</p>
          <p className="mt-2 text-sm font-semibold text-amber-300">Usually within 24 hours</p>
        </div>
      </div>
    </div>
  );
}
