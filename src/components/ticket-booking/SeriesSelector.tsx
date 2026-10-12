"use client";

import { motion } from "framer-motion";
import type { DrawPublic } from "@/lib/draws";
import type { TicketPage } from "../TicketBookingView";

type Tab = "available" | "lp_special" | "search";

type Props = {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  draw: DrawPublic;
  ticketData: TicketPage | null;
  activeSeries: string;
  setActiveSeries: (series: string) => void;
  setPage: (page: number) => void;
};

export function SeriesSelector({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  draw,
  ticketData,
  activeSeries,
  setActiveSeries,
  setPage,
}: Props) {
  
  const activeSeriesRange = {
    start: draw.ticketRangeStart.toString().padStart(5, "0"),
    end: draw.ticketRangeEnd.toString().padStart(5, "0"),
  };

  return (
    <>
      <div className="shrink-0 border-b border-zinc-800 bg-[#0a0a0a]">
        <div className="flex overflow-x-auto px-4 text-xs font-bold uppercase tracking-[0.12em] sm:px-5">
          {(["available", "lp_special", "search"] as Tab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                if (tab !== "search") setSearchQuery("");
              }}
              className={`relative shrink-0 cursor-pointer px-4 py-3 transition sm:px-5 ${
                activeTab === tab ? "text-emerald-400" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab === "available"
                ? "Available"
                : tab === "lp_special"
                  ? "LP Series"
                  : "Search Number"}
              {activeTab === tab && (
                <motion.div
                  layoutId="book-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"
                />
              )}
            </button>
          ))}
        </div>

        {activeTab === "search" && (
          <div className="px-4 pb-3 pt-1 sm:px-5">
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ticket number e.g. 10025"
              className="sl-input shadow-2xs"
              inputMode="numeric"
            />
          </div>
        )}
      </div>

      <div className="shrink-0 border-b border-zinc-800 bg-[#0a0a0a] px-4 py-3 sm:px-5">
        {ticketData?.stats && (
          <div className="mb-3 text-[10px] leading-relaxed text-zinc-400 sm:text-xs">
            Series: <span className="font-bold text-emerald-400">{activeSeries}</span>
            {" · "}Range:{" "}
            <span className="font-semibold text-zinc-200">
              {draw.ticketPrefix}-{activeSeries}-{activeSeriesRange.start} to{" "}
              {draw.ticketPrefix}-{activeSeries}-{activeSeriesRange.end}
            </span>
            {" · "}Total:{" "}
            <span className="font-semibold text-zinc-200">{ticketData.stats.total.toLocaleString("en-IN")}</span>
            {" · "}Available:{" "}
            <span className="font-bold text-emerald-400">
              {ticketData.stats.available.toLocaleString("en-IN")}
            </span>
            {" · "}Sold:{" "}
            <span className="font-bold text-red-400">
              {ticketData.stats.sold.toLocaleString("en-IN")}
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {draw.series.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setActiveSeries(s);
                setPage(1);
              }}
              className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition ${
                activeSeries === s
                  ? "border-emerald-500 bg-emerald-950/70 text-emerald-300 shadow-2xs"
                  : "border-zinc-800 bg-[#111111] text-zinc-400 hover:border-emerald-500/50 hover:text-white"
              }`}
            >
              {s} Series
            </button>
          ))}
          <div className="ml-auto hidden items-center gap-4 text-[10px] font-semibold text-zinc-400 sm:flex">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm border border-emerald-500 bg-emerald-950" />
              Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm border border-red-500 bg-red-950" />
              Sold
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm border border-teal-500 bg-teal-950" />
              LP Special
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
