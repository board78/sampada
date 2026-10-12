"use client";

import { toast } from "sonner";
import { type CartTicketItem, removeDraw, removeTickets } from "@/lib/store/features/cartSlice";
import { useAppDispatch } from "@/lib/store/hooks";

interface CartItemCardProps {
  item: CartTicketItem;
  expandedItem: CartTicketItem | null;
  setExpandedItem: (item: CartTicketItem | null) => void;
  ticketPreviewCount: number;
}

export function CartItemCard({ item, expandedItem, setExpandedItem, ticketPreviewCount }: CartItemCardProps) {
  const dispatch = useAppDispatch();
  return (
    <article className="sl-cart-item rounded-3xl border border-emerald-500/30 bg-[#0a0a0a] p-4 sm:p-5 shadow-xs">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="sl-cart-draw-title text-sm font-bold text-white">{item.drawName}</p>
          <p className="sl-cart-meta mt-1 text-xs text-zinc-400">
            {new Date(item.drawDate).toLocaleDateString("en-IN")} • {item.drawTime}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-950/70 border border-emerald-500/40 px-3 py-1 text-xs font-semibold text-emerald-300">
            {item.ticketNumbers.length} tickets
          </span>
          <button
            type="button"
            onClick={() => {
              dispatch(removeDraw(item.drawId));
              if (expandedItem?.drawId === item.drawId) setExpandedItem(null);
              toast.success("Draw removed from cart", { description: item.drawName });
            }}
            className="rounded-full border border-red-500/30 bg-red-950/40 px-3 py-1 text-xs font-medium text-red-300 transition hover:bg-red-900/50"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {item.ticketNumbers.slice(0, ticketPreviewCount).map((num) => (
          <div
            key={num}
            className="flex items-center justify-between gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/30 py-1.5 pl-3 pr-1.5"
          >
            <span className="min-w-0 flex-1 truncate text-center font-mono text-xs font-bold text-emerald-300">
              {num}
            </span>
            <button
              type="button"
              onClick={() => {
                dispatch(removeTickets({ drawId: item.drawId, ticketNumbers: [num] }));
                toast.success("Ticket removed", { description: num });
              }}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-850 text-sm font-bold text-zinc-400 transition hover:border-red-400 hover:bg-red-950/40 hover:text-red-300"
              aria-label={`Remove ticket ${num}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {item.ticketNumbers.length > ticketPreviewCount && (
        <button
          type="button"
          className="sl-cart-more-btn mt-3 text-left text-xs font-semibold text-emerald-400 underline decoration-emerald-400/50 underline-offset-2 hover:text-emerald-300"
          onClick={() => setExpandedItem(item)}
        >
          +{item.ticketNumbers.length - ticketPreviewCount} more selected — view all
        </button>
      )}

      <div className="sl-cart-price-row mt-4 flex items-center justify-between text-xs text-zinc-400">
        <span>Price per ticket</span>
        <span className="sl-cart-price-val font-bold text-white">₹{item.pricePerTicket}</span>
      </div>
    </article>
  );
}
