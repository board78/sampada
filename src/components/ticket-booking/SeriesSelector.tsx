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
      <div className="shrink-0 border-b border-slate-200 bg-slate-50/70">
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
                activeTab === tab ? "text-blue-700" : "text-slate-500 hover:text-slate-700"
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
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
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

      <div className="shrink-0 border-b border-slate-200 bg-slate-50/70 px-4 py-3 sm:px-5">
        {ticketData?.stats && (
          <div className="mb-3 text-[10px] leading-relaxed text-slate-600 sm:text-xs">
            Series: <span className="font-bold text-blue-700">{activeSeries}</span>
            {" · "}Range:{" "}
            <span className="font-semibold text-slate-800">
              {draw.ticketPrefix}-{activeSeries}-{activeSeriesRange.start} to{" "}
              {draw.ticketPrefix}-{activeSeries}-{activeSeriesRange.end}
            </span>
            {" · "}Total:{" "}
            <span className="font-semibold text-slate-800">{ticketData.stats.total.toLocaleString("en-IN")}</span>
            {" · "}Available:{" "}
            <span className="font-bold text-emerald-700">
              {ticketData.stats.available.toLocaleString("en-IN")}
            </span>
            {" · "}Sold:{" "}
            <span className="font-bold text-red-700">
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
                  ? "border-blue-600 bg-blue-50 text-blue-700 shadow-2xs"
                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-slate-900"
              }`}
            >
              {s} Series
            </button>
          ))}
          <div className="ml-auto hidden items-center gap-4 text-[10px] font-semibold text-slate-600 sm:flex">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm border border-emerald-500 bg-emerald-100" />
              Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm border border-red-400 bg-red-100" />
              Sold
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm border border-blue-400 bg-blue-100" />
              LP Special
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
