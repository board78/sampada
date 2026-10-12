"use client";

interface Totals {
  subtotal: number;
  discountAmount: number;
  hasDiscount: boolean;
  gst: number;
  grandTotal: number;
  totalTickets: number;
}

interface CartCheckoutSidebarProps {
  totals: Totals;
  referralCode: string;
  setReferralCode: (val: string) => void;
  error: string;
  cartReady: boolean;
  cartLength: number;
  loadingCheckout: boolean;
  startCheckout: () => void;
}

function formatMoney(amount: number) {
  return amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function CartCheckoutSidebar({
  totals,
  referralCode,
  setReferralCode,
  error,
  cartReady,
  cartLength,
  loadingCheckout,
  startCheckout,
}: CartCheckoutSidebarProps) {
  return (
    <aside className="sl-cart-aside mt-6 rounded-3xl border border-emerald-500/20 bg-[#080808] p-5 lg:mt-0 lg:self-start lg:sticky lg:top-24">
      <p className="sl-cart-summary-title text-xs font-bold uppercase tracking-[0.18em] text-zinc-300">
        Order summary
      </p>

      <div className="mt-4 space-y-2 text-sm">
        <div className="sl-cart-row flex justify-between text-zinc-400">
          <span>Tickets</span>
          <span className="sl-cart-value text-zinc-200">{totals.totalTickets}</span>
        </div>
        <div className="sl-cart-row flex justify-between text-zinc-400">
          <span>Subtotal</span>
          <span className="sl-cart-value text-zinc-200">₹{formatMoney(totals.subtotal)}</span>
        </div>
        {totals.hasDiscount && (
          <div className="sl-cart-row flex justify-between text-emerald-400">
            <span>Referral Discount (10%)</span>
            <span className="sl-cart-value">-₹{formatMoney(totals.discountAmount)}</span>
          </div>
        )}
        <div className="sl-cart-row flex justify-between text-zinc-400">
          <span>GST (18%)</span>
          <span className="sl-cart-value text-zinc-200">₹{formatMoney(totals.gst)}</span>
        </div>
        
        <div className="mt-4 border-t border-zinc-800 pt-4">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Referral Code (Optional)
          </label>
          <input
            type="text"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
            placeholder="Enter code"
            className="sl-input w-full"
          />
        </div>

        <div className="sl-cart-total flex justify-between border-t border-zinc-800 pt-3 text-base font-bold text-emerald-400 mt-4">
          <span>Total</span>
          <span>₹{formatMoney(totals.grandTotal)}</span>
        </div>
      </div>

      {error && (
        <p className="sl-cart-error mt-4 rounded-2xl bg-red-950/30 px-4 py-3 text-sm leading-snug text-red-300">
          {error}
        </p>
      )}

      <button
        type="button"
        disabled={!cartReady || cartLength === 0 || loadingCheckout}
        onClick={startCheckout}
        className="mt-5 w-full rounded-full sl-cta-gradient py-3 text-sm font-bold sl-force-light-text disabled:opacity-50"
      >
        {loadingCheckout ? "Redirecting to payment…" : "Buy & Pay Securely"}
      </button>

      <div className="mt-3 flex items-center justify-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500" aria-hidden>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span className="text-[11px] font-semibold text-zinc-500">Secured by QPC · UPI · IMPS</span>
      </div>

      <p className="mt-2 text-[11px] leading-5 text-zinc-600">
        After payment, tickets appear in your profile instantly.
      </p>
    </aside>
  );
}
