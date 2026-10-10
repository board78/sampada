"use client";

import { toast } from "sonner";
import { type CartTicketItem, removeTickets } from "@/lib/store/features/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

interface ExpandedCartItemModalProps {
  expandedItem: CartTicketItem;
  setExpandedItem: (item: CartTicketItem | null) => void;
}

export function ExpandedCartItemModal({ expandedItem, setExpandedItem }: ExpandedCartItemModalProps) {
  const dispatch = useAppDispatch();
  const currentItem = useAppSelector((state) => state.cart.items.find(i => i.drawId === expandedItem.drawId));
  const displayItem = currentItem || expandedItem;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-tickets-dialog-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        aria-label="Close dialog"
        onClick={() => setExpandedItem(null)}
      />
      <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-t-3xl border border-white/10 bg-[#14070f] shadow-2xl sm:rounded-3xl">
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div className="min-w-0">
            <h2 id="cart-tickets-dialog-title" className="text-base font-semibold text-white">
              All tickets
            </h2>
            <p className="mt-1 text-xs text-zinc-400">{displayItem.drawName}</p>
            <p className="mt-0.5 text-[11px] text-zinc-500">
              {displayItem.ticketNumbers.length} numbers · ₹{displayItem.pricePerTicket} each
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-full border border-white/15 px-3 py-1.5 text-sm text-zinc-300 hover:bg-white/5"
            onClick={() => setExpandedItem(null)}
          >
            Close
          </button>
        </div>
        <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {displayItem.ticketNumbers.map((num) => (
              <div
                key={num}
                className="flex items-center justify-between gap-2 rounded-xl border border-white/12 bg-white/5 px-3 py-2"
              >
                <span className="min-w-0 truncate font-mono text-xs font-semibold text-zinc-100">{num}</span>
                <button
                  type="button"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-sm text-zinc-400 hover:border-red-400/40 hover:text-red-300"
                  onClick={() => {
                    dispatch(removeTickets({ drawId: displayItem.drawId, ticketNumbers: [num] }));
                    toast.success("Ticket removed", { description: num });
                  }}
                  aria-label={`Remove ${num}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
