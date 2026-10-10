import { useState } from "react";
import { MessageCircleQuestion, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "How do I buy a lottery ticket?",
    a: "Go to the homepage, choose any of the active draws under 'Popular Draws Today', select your desired ticket numbers, add them to your cart, and complete the checkout using UPI or net banking.",
  },
  {
    q: "When are the draw results declared?",
    a: "Each draw has its scheduled draw time mentioned on the ticket card. Once the countdown ends, the winning ticket is processed and declared live on the 'Live Result Board'.",
  },
  {
    q: "How will I get my prize money if I win?",
    a: "Winnings are credited directly to your registered wallet balance or paid out directly via UPI/bank transfer. You can manage your payout details in the profile panel.",
  },
  {
    q: "Is it safe to make payments with UPI?",
    a: "Yes, all transactions are processed through highly secure payment gateways with support for UPI apps like PhonePe, Google Pay, Paytm, and BHIM, ensuring instant confirmation.",
  },
];

function FAQItem({ q, a, index, isOpen, onToggle }: { q: string; a: string; index: number; isOpen: boolean; onToggle: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, ease: "easeOut" }}
      className={`group relative overflow-hidden rounded-2xl border border-transparent p-px transition-all duration-300 ${isOpen ? "shadow-[0_0_20px_rgba(245,158,11,0.15)]" : ""}`}
    >
      <div className={`absolute inset-0 bg-linear-to-br from-amber-400/20 via-transparent to-white/5 opacity-0 transition-opacity duration-500 ${isOpen ? "opacity-100" : "group-hover:opacity-100"}`} />
      
      <div className={`royal-panel relative h-full w-full rounded-2xl border border-white/10 bg-[#14070f]/80 backdrop-blur-xl transition-all duration-300 ${isOpen ? "bg-[#1b0911]/90 border-amber-500/30" : "group-hover:border-amber-400/20"}`}>
        <button
          onClick={onToggle}
          className="flex w-full cursor-pointer items-center justify-between p-5 font-medium text-zinc-200 outline-none transition-colors hover:text-white select-none text-left"
        >
          <span className={`text-base transition-colors ${isOpen ? "text-amber-300 font-semibold" : ""}`}>{q}</span>
          <div className={`ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${isOpen ? "border-amber-300/30 bg-amber-300/10 text-amber-300 rotate-180" : "border-white/10 text-zinc-500 group-hover:border-amber-300/20 group-hover:text-amber-300 rotate-0"}`}>
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.div key="minus" initial={{ opacity: 0, scale: 0.5, rotate: -90 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.5, rotate: 90 }} transition={{ duration: 0.2 }}>
                  <Minus size={14} strokeWidth={2.5} />
                </motion.div>
              ) : (
                <motion.div key="plus" initial={{ opacity: 0, scale: 0.5, rotate: -90 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.5, rotate: 90 }} transition={{ duration: 0.2 }}>
                  <Plus size={14} strokeWidth={2.5} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="border-t border-white/5 px-5 pb-5 pt-3 text-sm leading-relaxed text-zinc-400">
                {a}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function FAQSection() {
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
          <MessageCircleQuestion size={18} />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Frequently asked questions</h2>
          <p className="text-xs text-zinc-500">Quick answers to common questions</p>
        </div>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <FAQItem 
            key={idx} 
            q={faq.q} 
            a={faq.a} 
            index={idx} 
            isOpen={openFAQIndex === idx}
            onToggle={() => setOpenFAQIndex(openFAQIndex === idx ? null : idx)}
          />
        ))}
      </div>
    </section>
  );
}
