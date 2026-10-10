import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hooks";
import { clearCart } from "@/lib/store/features/cartSlice";
import type { Status, DrawInfo, QpcStatusResponse, LoopKey } from "../types";

export function usePaymentStatus(orderId: string | null) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const [status, setStatus] = useState<Status>("checking");
  const [draws, setDraws] = useState<DrawInfo[]>([]);
  const [amount, setAmount] = useState<number | null>(null);
  const [polls, setPolls] = useState(0);
  const [loopKey, setLoopKey] = useState<LoopKey>(0);

  const FIRST_DELAY_MS = 2000;
  const POLL_INTERVAL_MS = 3000;
  const MAX_POLLS = 30;

  const checkStatus = useCallback(async (): Promise<boolean> => {
    if (!orderId) return false;
    try {
      const res = await fetch(`/api/payments/qpc/status?orderId=${orderId}`);
      if (res.status === 401) {
        router.push(`/?auth=signin&next=${encodeURIComponent(`/payment-status?orderId=${orderId}`)}`);
        return true;
      }
      if (!res.ok && res.status !== 404) return false;

      const data = (await res.json()) as QpcStatusResponse;

      if (data.status === "SUCCESS") {
        dispatch(clearCart());
        setDraws(data.draws ?? []);
        setAmount(data.amount ?? null);
        setStatus("success");
        import("react-facebook-pixel")
          .then((x) => x.default)
          .then((ReactPixel) => {
            ReactPixel.track("Purchase", {
              value: data.amount ?? 0,
              currency: "INR",
              content_type: "product",
              contents: (data.draws ?? []).map((d) => ({
                id: d.name,
                quantity: d.tickets,
              })),
            });
          })
          .catch(() => {});
        return true;
      }
      if (data.status === "FAILED") {
        setStatus("failed");
        return true;
      }
    } catch {
      // network error
    }
    return false;
  }, [orderId, router, dispatch]);

  useEffect(() => {
    if (!orderId) { setStatus("failed"); return; }

    let cancelled = false;
    let count = 0;

    const tick = async () => {
      if (cancelled) return;
      count++;
      setPolls(count);
      const done = await checkStatus();
      if (done || cancelled) return;
      if (count >= MAX_POLLS) { setStatus("timeout"); return; }
      setTimeout(tick, POLL_INTERVAL_MS);
    };

    const init = setTimeout(tick, FIRST_DELAY_MS);
    return () => { cancelled = true; clearTimeout(init); };
  }, [orderId, checkStatus, loopKey]);

  useEffect(() => {
    if (status === "success") {
      const redirectTimer = setTimeout(() => {
        router.push("/my-tickets");
      }, 4000);
      return () => clearTimeout(redirectTimer);
    }
  }, [status, router]);

  const handleCheckAgain = () => {
    setPolls(0);
    setStatus("checking");
    setLoopKey((k) => k + 1);
  };

  return { status, draws, amount, polls, MAX_POLLS, handleCheckAgain };
}
