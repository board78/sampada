"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";

import { useFireworks } from "./hooks/useFireworks";
import { usePaymentStatus } from "./hooks/usePaymentStatus";
import { CheckingState } from "./components/CheckingState";
import { SuccessState } from "./components/SuccessState";
import { FailedState } from "./components/FailedState";
import { TimeoutState } from "./components/TimeoutState";

function PaymentStatusContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const { status, draws, amount, polls, MAX_POLLS, handleCheckAgain } = usePaymentStatus(orderId);
  const canvasRef = useFireworks(status === "success");

  return (
    <div className="royal-surface royal-grid relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-8">
      {status === "success" && (
        <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden />
      )}

      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-32 -top-24 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute -right-40 top-32 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute -bottom-40 left-[25%] h-80 w-80 rounded-full bg-amber-300/8 blur-3xl" />
      </div>

      <AnimatePresence mode="wait">
        {status === "checking" && <CheckingState polls={polls} maxPolls={MAX_POLLS} />}
        {status === "success" && <SuccessState amount={amount} draws={draws} />}
        {status === "failed" && <FailedState />}
        {status === "timeout" && <TimeoutState onCheckAgain={handleCheckAgain} />}
      </AnimatePresence>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-400/30 border-t-amber-400" />
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentStatusContent />
    </Suspense>
  );
}
