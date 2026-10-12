import { motion } from "framer-motion";
import type { SafeUser } from "@/lib/auth";

interface UpiPromoProps {
  title: string;
  description: string;
  buttonText: string;
  authUser: SafeUser | null;
  onOpenAuth: () => void;
}

export function UpiPromo({ title, description, buttonText, authUser, onOpenAuth }: UpiPromoProps) {
  return (
    <motion.section whileHover={{ y: -3 }} transition={{ duration: 0.18 }}
      className="royal-panel sl-upi-promo rounded-3xl border border-blue-400/30 bg-linear-to-r from-blue-700 via-blue-600 to-indigo-700 p-4 sm:rounded-[28px] sm:p-5 text-white shadow-md">
      <p className="sl-upi-kicker text-[11px] uppercase tracking-[0.18em] text-blue-100 font-bold sm:text-xs">UPI • Instant results</p>
      <h2 className="sl-upi-title mt-2 max-w-lg text-xl font-bold leading-snug text-white sm:mt-3 sm:text-2xl">{title}</h2>
      {description && (
        <p className="sl-upi-body mt-2 max-w-xl text-xs leading-6 text-blue-50/90 sm:text-sm sm:leading-7">{description}</p>
      )}
      {!authUser && (
        <button type="button" onClick={onOpenAuth}
          className="mt-4 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-blue-700 shadow-md transition hover:bg-blue-50 hover:scale-[1.03] cursor-pointer sm:mt-5">
          {buttonText}
        </button>
      )}
    </motion.section>
  );
}
