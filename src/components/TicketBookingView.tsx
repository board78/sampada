"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FaShareAlt } from "react-icons/fa";

import type { DrawPublic, SeriesStats, TicketPublic } from "@/lib/draws";
import { useAppDispatch } from "@/lib/store/hooks";
import { addToCart } from "@/lib/store/features/cartSlice";
import { ReferralModal } from "./ticket-booking/ReferralModal";

import { SeriesSelector } from "./ticket-booking/SeriesSelector";
import { NumberGrid } from "./ticket-booking/NumberGrid";
import { BookingSidebar } from "./ticket-booking/BookingSidebar";

type Tab = "available" | "lp_special" | "search";

export type TicketPage = {
  tickets: TicketPublic[];
  total: number;
  hasMore: boolean;
  page: number;
  stats: SeriesStats;
  drawTotal: number;
  drawAvailable: number;
};

export type TicketBookingViewProps = {
  draw: DrawPublic;
  user: { id: string } | null;
  onNeedAuth: () => void;
};

const QUICK_AMOUNTS = [1, 5, 10, 50, 100] as const;

export function TicketBookingView({ draw, user, onNeedAuth }: TicketBookingViewProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [activeSeries, setActiveSeries] = useState(draw.series[0] ?? "A");
  const [activeTab, setActiveTab] = useState<Tab>("available");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [ticketData, setTicketData] = useState<TicketPage | null>(null);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selected, setSelected] = useState<Map<string, TicketPublic>>(new Map());
  const [bookingState, setBookingState] = useState<"idle" | "booking" | "success" | "error">("idle");
  const [bookingError, setBookingError] = useState("");
  const [referralOpen, setReferralOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const gstRate = 0.18;
  const pricePerTicket = draw.pricePerTicket;
  const gstAmount = Math.round(pricePerTicket * gstRate * 100) / 100;
  const totalPerTicket = pricePerTicket + gstAmount;
  const selectedCount = selected.size;
  const grandTotal = Math.round(selectedCount * totalPerTicket * 100) / 100;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const fetchTickets = useCallback(
    async (pageNum: number, append = false) => {
      await Promise.resolve(); // Defer to microtask to prevent synchronous setState inside useEffect

      const params = new URLSearchParams({
        series: activeSeries,
        tab: activeTab === "search" ? "all" : activeTab,
        page: String(pageNum),
        limit: "200",
      });
      if (debouncedSearch) params.set("q", debouncedSearch);

      if (!append) setLoadingTickets(true);
      else setLoadingMore(true);

      try {
        const res = await fetch(`/api/draws/${draw.id}/tickets?${params}`);
        if (!res.ok) return;
        const data = (await res.json()) as TicketPage;

        setTicketData((prev) =>
          append && prev
            ? {
                ...data,
                tickets: [...prev.tickets, ...data.tickets],
              }
            : data,
        );
        setPage(pageNum);
      } finally {
        setLoadingTickets(false);
        setLoadingMore(false);
      }
    },
    [draw, activeSeries, activeTab, debouncedSearch],
  );

  useEffect(() => {
    const t = setTimeout(() => {
      void fetchTickets(1);
    }, 0);
    return () => clearTimeout(t);
  }, [draw.id, activeSeries, activeTab, debouncedSearch, fetchTickets]);

  useEffect(() => {
    gridRef.current?.scrollTo({ top: 0 });
  }, [activeSeries, activeTab]);

  const toggleTicket = (ticket: TicketPublic) => {
    if (ticket.status === "sold" || draw.status === "closed") return;
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(ticket.number)) {
        next.delete(ticket.number);
      } else {
        if (next.size >= 100) return prev;
        next.set(ticket.number, ticket);
      }
      return next;
    });
  };

  const clearSelection = () => setSelected(new Map());

  const quickPick = (amount: number) => {
    const available =
      ticketData?.tickets.filter((t) => t.status === "available" && !selected.has(t.number)) ?? [];
    
    if (draw.status === "closed") return;
    const toAdd = available.slice(0, amount - selectedCount);

    if (!toAdd.length) return;

    setSelected((prev) => {
      const next = new Map(prev);
      for (const t of toAdd) {
        if (next.size >= 100) break;
        next.set(t.number, t);
      }
      return next;
    });
  };

  const selectedNumbers = useMemo(() => [...selected.keys()], [selected]);

  const trackAddToCart = (count: number) => {
    import("react-facebook-pixel")
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.track("AddToCart", {
          content_name: draw.name,
          content_ids: [draw.id],
          content_type: "product",
          value: draw.pricePerTicket * count,
          currency: "INR",
          num_items: count,
        });
      })
      .catch(() => {});
  };

  const handleAddToCart = () => {
    if (!user) {
      onNeedAuth();
      return;
    }
    if (!selectedCount) return;
    dispatch(addToCart({
      drawId: draw.id,
      drawName: draw.name,
      drawDate: draw.drawDate,
      drawTime: draw.drawTime,
      pricePerTicket: draw.pricePerTicket,
      ticketNumbers: selectedNumbers,
    }));
    trackAddToCart(selectedNumbers.length);
    toast.success("Added to cart", {
      description: `${selectedNumbers.length} ticket(s) @ ${draw.name}`,
    });
    setBookingState("success");
    setBookingError("");
    router.push("/");
  };

  const handleBuyNow = () => {
    if (!user) {
      onNeedAuth();
      return;
    }
    if (!selectedCount) return;
    dispatch(addToCart({
      drawId: draw.id,
      drawName: draw.name,
      drawDate: draw.drawDate,
      drawTime: draw.drawTime,
      pricePerTicket: draw.pricePerTicket,
      ticketNumbers: selectedNumbers,
    }));
    trackAddToCart(selectedNumbers.length);
    toast.success("Added to cart", {
      description: `${selectedNumbers.length} ticket(s) — opening checkout`,
    });
    router.push("/cart");
  };

  const remaining = ticketData?.drawAvailable ?? 0;
  const totalTickets = ticketData?.drawTotal ?? 0;

  return (
    <div className="ticket-booking-modal flex min-h-0 flex-1 flex-col overflow-hidden bg-white rounded-2xl border border-blue-200/50 shadow-sm">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-blue-200/40 bg-slate-50/70 px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex min-w-0 flex-col">
          <h1 className="text-base font-bold text-slate-900 sm:text-lg">{draw.name}</h1>
          {totalTickets > 0 ? (
            <div className="mt-1.5">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[10px] font-semibold text-slate-500">
                <span>
                  Only <span className="text-blue-700 font-bold">{remaining.toLocaleString("en-IN")}</span>{" "}
                  tickets left
                </span>
                <span className="text-slate-500">{totalTickets.toLocaleString("en-IN")} total</span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end text-right text-xs text-slate-600">
            <span>
              Draw Date:{" "}
              <span className="text-slate-900 font-semibold">
                {new Date(draw.drawDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </span>
            <span>
              Draw Time: <span className="text-slate-900 font-semibold">{draw.drawTime}</span>
            </span>
            <button
              onClick={() => {
                if (!user) onNeedAuth();
                else setReferralOpen(true);
              }}
              className="mt-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 transition hover:text-blue-800"
            >
              <FaShareAlt className="w-3 h-3" />
              Refer & Earn 10% Off
            </button>
          </div>
          <div className="sl-price-chip flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2">
            <span className="text-xs font-semibold text-blue-700">₹</span>
            <span className="text-lg font-bold text-blue-700">{draw.pricePerTicket}</span>
          </div>
        </div>
      </div>

      <SeriesSelector
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        draw={draw}
        ticketData={ticketData}
        activeSeries={activeSeries}
        setActiveSeries={setActiveSeries}
        setPage={setPage}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <NumberGrid
            gridRef={gridRef}
            drawStatus={draw.status}
            loadingTickets={loadingTickets}
            ticketData={ticketData}
            selected={selected}
            toggleTicket={toggleTicket}
            loadingMore={loadingMore}
            onLoadMore={(p) => fetchTickets(p, true)}
            currentPage={page}
          />

          <div className="shrink-0 border-t border-slate-100 bg-slate-50/70 px-4 py-3 sm:px-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Quick Pick:
              </span>
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  disabled={selectedCount >= 100}
                  onClick={() => quickPick(amt)}
                  className="sl-quick-pick rounded-lg border border-blue-200/60 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {amt}
                </button>
              ))}
              <span className="ml-auto text-xs text-slate-500">Random Ticket</span>
            </div>
          </div>
        </div>

        <BookingSidebar
          selected={selected}
          selectedCount={selectedCount}
          clearSelection={clearSelection}
          toggleTicket={toggleTicket}
          pricePerTicket={pricePerTicket}
          gstAmount={gstAmount}
          grandTotal={grandTotal}
          bookingState={bookingState}
          bookingError={bookingError}
          handleAddToCart={handleAddToCart}
          handleBuyNow={handleBuyNow}
          drawStatus={draw.status}
        />
      </div>

      <AnimatePresence>
        {referralOpen && user && (
          <ReferralModal
            drawId={draw.id}
            drawName={draw.name}
            onClose={() => setReferralOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
