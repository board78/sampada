import { motion } from "framer-motion";

export function CheckIcon() {
  return (
    <svg viewBox="0 0 52 52" fill="none" className="h-16 w-16">
      <motion.circle
        cx="26" cy="26" r="24"
        stroke="#22c55e" strokeWidth="2.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <motion.path
        d="M15 26l8 9 14-16"
        stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.45, ease: "easeOut" }}
      />
    </svg>
  );
}

export function FailIcon() {
  return (
    <svg viewBox="0 0 52 52" fill="none" className="h-16 w-16">
      <motion.circle
        cx="26" cy="26" r="24"
        stroke="#ef4444" strokeWidth="2.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <motion.path
        d="M17 17l18 18M35 17L17 35"
        stroke="#ef4444" strokeWidth="3" strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
      />
    </svg>
  );
}

export function Spinner() {
  return (
    <div className="relative h-16 w-16">
      <div className="absolute inset-0 rounded-full border-4 border-amber-400/20" />
      <motion.div
        className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-400"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0 flex items-center justify-center text-2xl">🎫</div>
    </div>
  );
}
