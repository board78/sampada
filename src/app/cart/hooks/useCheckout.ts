import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { type CartState } from "@/lib/store/features/cartSlice";

export function useCheckout(cart: CartState, referralCode: string) {
  const router = useRouter();
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [error, setError] = useState("");

  const startCheckout = async () => {
    setError("");
    if (!cart.items.length) return;
    setLoadingCheckout(true);

    try {
      let res: Response;
      try {
        res = await fetch("/api/payments/qpc/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart, referralCode }),
          signal: AbortSignal.timeout(60_000),
        });
      } catch {
        throw new Error(
          "Could not reach the payment server. Keep the dev server running, refresh the page, and try again.",
        );
      }

      if (res.status === 401) {
        window.location.href = `/?auth=signin&next=${encodeURIComponent("/cart")}`;
        return;
      }

      const text = await res.text();
      let data: {
        paymentLink?: string | null;
        paymentPageUrl?: string | null;
        deepLink?: { upi_intent?: string; upi_phonepe?: string; upi_gpay?: string; upi_paytm?: string };
        merchantOrderNo?: string;
        error?: string;
      };
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid response from payment server.");
      }

      if (!res.ok) {
        throw new Error(data.error ?? "Unable to create payment order.");
      }

      const webPayUrl = data.paymentLink ?? data.paymentPageUrl;
      const hasUpi = Boolean(
        data.deepLink?.upi_intent || data.deepLink?.upi_phonepe || data.deepLink?.upi_paytm,
      );

      if (webPayUrl) {
        window.location.href = webPayUrl;
        return;
      }

      if (hasUpi && data.merchantOrderNo) {
        sessionStorage.setItem("qpc_checkout", JSON.stringify(data));
        router.push(`/payment/checkout?orderId=${data.merchantOrderNo}`);
        return;
      }

      throw new Error("QPC did not return a payment page or UPI link.");
    } catch (caught) {
      const msg = caught instanceof Error ? caught.message : "Checkout failed.";
      setError(msg);
      toast.error("Checkout failed", { description: msg });
    } finally {
      setLoadingCheckout(false);
    }
  };

  return { startCheckout, loadingCheckout, error, setError };
}
