"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  type CartTicketItem,
  type CartState,
} from "@/lib/store/features/cartSlice";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { clearCart } from "@/lib/store/features/cartSlice";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/components/AuthProvider";
import { useSearchParams } from "next/navigation";

const TICKET_PREVIEW = 12;
const EMPTY_CART: CartState = { items: [], updatedAt: new Date(0).toISOString() };

function formatMoney(amount: number) {
  return amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

import { Suspense } from "react";
import { CartItemCard } from "./components/CartItemCard";
import { ExpandedCartItemModal } from "./components/ExpandedCartItemModal";
import { CartCheckoutSidebar } from "./components/CartCheckoutSidebar";
import { useCheckout } from "./hooks/useCheckout";

function CartContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const [cartReady, setCartReady] = useState(false);
  const { user } = useAuth();
  const [expandedItem, setExpandedItem] = useState<CartTicketItem | null>(null);
  const [referralCode, setReferralCode] = useState("");
  const searchParams = useSearchParams();
  const { startCheckout, loadingCheckout, error, setError } = useCheckout(cart, referralCode);

  // Auto-fill referral code from URL or sessionStorage
  useEffect(() => {
    const urlRef = searchParams.get("ref");
    if (urlRef) {
      setReferralCode(urlRef);
      sessionStorage.setItem("subhlaxmi_ref", urlRef);
    } else {
      const storedRef = sessionStorage.getItem("subhlaxmi_ref");
      if (storedRef) setReferralCode(storedRef);
    }
  }, [searchParams]);

  useEffect(() => {
    setCartReady(true);
  }, []);

  useEffect(() => {
    if (cartReady && cart.items.length > 0) {
      import("react-facebook-pixel")
        .then((x) => x.default)
        .then((ReactPixel) => {
          ReactPixel.track("InitiateCheckout", {
            num_items: cart.items.reduce((sum, item) => sum + item.ticketNumbers.length, 0),
            value: cart.items.reduce((sum, item) => sum + item.ticketNumbers.length * item.pricePerTicket, 0),
            currency: "INR",
          });
        })
        .catch(() => {});
    }
  }, [cartReady, cart.items]);



  useEffect(() => {
    if (!expandedItem) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setExpandedItem(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expandedItem]);

  useEffect(() => {
    if (!expandedItem) return;
    if (!cart.items.some((i) => i.drawId === expandedItem.drawId)) {
      setTimeout(() => setExpandedItem(null), 0);
    }
  }, [cart.items, expandedItem]);

  const totals = useMemo(() => {
    const subtotal = cart.items.reduce((sum, item) => sum + item.ticketNumbers.length * item.pricePerTicket, 0);
    const hasDiscount = Boolean(user && user.availableDiscounts && user.availableDiscounts > 0);
    const discountAmount = hasDiscount ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
    const discountedSubtotal = subtotal - discountAmount;
    
    const gst = Math.round(discountedSubtotal * 0.18 * 100) / 100;
    const grandTotal = Math.round((discountedSubtotal + gst) * 100) / 100;
    const totalTickets = cart.items.reduce((sum, item) => sum + item.ticketNumbers.length, 0);
    return { subtotal, discountAmount, gst, grandTotal, totalTickets, hasDiscount };
  }, [cart.items, user]);
  return (
    <div className="royal-surface royal-grid min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="sl-cart-page mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="sl-cart-page-eyebrow text-xs uppercase tracking-[0.18em] text-amber-200/70">Cart</p>
            <h1 className="mt-2 text-2xl font-semibold">Your selected tickets</h1>
            <p className="sl-cart-subtitle mt-1 text-sm text-zinc-400">
              Review ticket numbers, then pay securely to confirm.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              dispatch(clearCart());
              setExpandedItem(null);
              setError("");
              toast.success("Cart cleared");
            }}
            className="sl-cart-clear-btn rounded-full border border-white/12 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-200 hover:border-white/25"
          >
            Clear cart
          </button>
        </div>

        <div className="mt-6 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-6">
          <section className="sl-cart-scroll space-y-4 lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto lg:overflow-x-hidden lg:pr-2">
            {!cartReady ? (
              <div className="rounded-3xl border border-white/10 bg-black/20 p-8 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-amber-400/30 border-t-amber-400" />
                <p className="mt-3 text-sm text-zinc-500">Loading cart…</p>
              </div>
            ) : cart.items.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-black/20 p-8 text-center">
                <p className="text-lg font-semibold text-zinc-100">Cart is empty</p>
                <p className="mt-2 text-sm text-zinc-500">Select ticket numbers from a draw and add them to cart.</p>
              </div>
            ) : (
              cart.items.map((item) => (
                <CartItemCard
                  key={item.drawId}
                  item={item}
                  expandedItem={expandedItem}
                  setExpandedItem={setExpandedItem}
                  ticketPreviewCount={TICKET_PREVIEW}
                />
              ))
            )}
          </section>

          <CartCheckoutSidebar
            totals={totals}
            referralCode={referralCode}
            setReferralCode={setReferralCode}
            error={error}
            cartReady={cartReady}
            cartLength={cart.items.length}
            loadingCheckout={loadingCheckout}
            startCheckout={startCheckout}
          />
        </div>
      </div>

      {expandedItem && (
        <ExpandedCartItemModal
          expandedItem={expandedItem}
          setExpandedItem={setExpandedItem}
        />
      )}
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400/30 border-t-amber-400" />
      </div>
    }>
      <CartContent />
    </Suspense>
  );
}
