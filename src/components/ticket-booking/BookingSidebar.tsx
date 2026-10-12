"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { HiTicket } from "react-icons/hi2";
import type { TicketPublic } from "@/lib/draws";

type Props = {
  selected: Map<string, TicketPublic>;
  selectedCount: number;
  clearSelection: () => void;
  toggleTicket: (t: TicketPublic) => void;
  pricePerTicket: number;
  gstAmount: number;
  grandTotal: number;
  bookingState: string;
  bookingError: string;
  handleAddToCart: () => void;
  handleBuyNow: () => void;
  drawStatus: string;
};

export function BookingSidebar({
  selected,
  selectedCount,
  clearSelection,
  toggleTicket,
  pricePerTicket,
  gstAmount,
  grandTotal,
  bookingState,
  bookingError,
  handleAddToCart,
  handleBuyNow,
  drawStatus,
}: Props) {
  return (
    <>
      <aside className="hidden min-h-0 w-72 shrink-0 flex-col overflow-hidden border-l border-slate-200 bg-slate-50/70 lg:flex xl:w-80">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-800">
            Selected Tickets
            <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-blue-800 font-bold">
              {selectedCount}
            </span>
          </p>
          {selectedCount > 0 && (
            <button
              type="button"
              onClick={clearSelection}
              className="text-[10px] text-slate-500 transition hover:text-slate-800 cursor-pointer"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-3">
          {selectedCount === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center text-slate-500">
              <span className="text-blue-600 bg-blue-50 p-3 rounded-full border border-blue-200 inline-flex items-center justify-center">
                <HiTicket className="w-6 h-6 rotate-15" />
              </span>
              <p className="text-xs font-bold text-slate-700 mt-1">No tickets selected yet</p>
              <p className="text-[11px] leading-5 text-slate-500">
                Click a ticket number from the grid or use Quick Pick to auto-select.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {[...selected.values()].map((t) => (
                <div
                  key={t.number}
                  className="flex items-center justify-between rounded-xl border border-blue-200 bg-white px-3 py-2 shadow-2xs"
                >
                  <span className="font-mono text-xs font-bold text-blue-900">{t.number}</span>
                  <button
                    type="button"
                    onClick={() => toggleTicket(t)}
                    className="text-slate-400 transition hover:text-red-600 cursor-pointer text-base leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-slate-200 p-4 bg-white">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Tickets selected</span>
              <span className="font-semibold text-slate-900">{selectedCount}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Price per ticket</span>
              <span className="font-semibold text-slate-900">₹{pricePerTicket}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST (18%)</span>
              <span className="font-semibold text-slate-900">
                ₹{selectedCount > 0 ? (gstAmount * selectedCount).toFixed(2) : 0}
              </span>
            </div>
            <div className="sl-sidebar-total-row flex justify-between border-t border-slate-100 pt-2 text-sm font-bold text-blue-700">
              <span>Total</span>
              <span>₹{grandTotal > 0 ? grandTotal.toFixed(2) : 0}</span>
            </div>
          </div>

          {bookingState === "error" && (
            <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-700">
              {bookingError}
            </p>
          )}

          {bookingState === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-[11px]"
            >
              <p className="font-bold text-emerald-800 flex items-center gap-1.5">
                <FaCheckCircle className="w-3.5 h-3.5" />
                Added to cart
              </p>
              <p className="mt-1 text-emerald-700 ml-5">Go to cart to pay and confirm.</p>
            </motion.div>
          ) : null}

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!selectedCount}
              className="sl-modal-secondary-btn rounded-full border border-blue-200 bg-white px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40 shadow-2xs"
            >
              Add to Cart
            </button>
            <motion.button
              type="button"
              onClick={handleBuyNow}
              disabled={
                !selectedCount || bookingState === "booking" || bookingState === "success" || drawStatus === "closed"
              }
              whileHover={selectedCount > 0 && drawStatus !== "closed" ? { scale: 1.02 } : {}}
              transition={{ duration: 0.14 }}
              className="w-full rounded-full sl-cta-gradient sl-force-light-text px-3 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              {drawStatus === "closed"
                ? "Closed"
                : bookingState === "booking"
                  ? "Loading…"
                  : bookingState === "success"
                    ? "Added"
                    : selectedCount > 0
                      ? "Buy Now"
                      : "Select Tickets"}
            </motion.button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 lg:hidden shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-xs text-slate-500">
                  {selectedCount} ticket{selectedCount !== 1 ? "s" : ""} selected
                </p>
                <p className="mt-0.5 text-sm font-bold text-blue-700">Total: ₹{grandTotal.toFixed(2)}</p>
              </div>
              <button
                type="button"
                onClick={clearSelection}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={bookingState === "booking"}
                className="sl-modal-secondary-btn rounded-full border border-blue-200 bg-white px-3 py-2 text-sm font-bold text-blue-700 transition disabled:opacity-50"
              >
                {bookingState === "booking" ? "Loading…" : "Add"}
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={bookingState === "booking"}
                className="rounded-full sl-cta-gradient sl-force-light-text px-3 py-2 text-sm font-bold transition disabled:opacity-50"
              >
                {bookingState === "booking" ? "Loading…" : "Buy Now"}
              </button>
            </div>
            {bookingState === "error" && (
              <p className="mt-2 text-[11px] text-red-600 font-medium">{bookingError}</p>
            )}
            {bookingState === "success" ? (
              <p className="mt-2 text-[11px] text-emerald-700 font-semibold flex items-center justify-center gap-1">
                <FaCheckCircle className="w-3 h-3" />
                Added to cart
              </p>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
