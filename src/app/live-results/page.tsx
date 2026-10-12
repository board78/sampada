"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import type { LiveResult } from "@/lib/types";

type ImageResult = {
  id: string;
  imageUrl: string;
  resultDate: string;
  resultTime: string;
  createdAt: string;
};

export default function LiveResultsPage() {
  const [activeTab, setActiveTab] = useState<"declarations" | "charts">("declarations");

  // Declarations State
  const [results, setResults] = useState<LiveResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Charts State
  const [imageResults, setImageResults] = useState<ImageResult[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [dateFilter, setDateFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);


  // Fetch live results
  useEffect(() => {
    let cancelled = false;
    fetch("/api/results")
      .then(async (r) => (r.ok ? (await r.json() as { results: LiveResult[] }) : null))
      .then((d) => {
        if (!cancelled) {
          if (d?.results) {
            setResults(d.results);
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch image results
  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) setLoadingImages(true);
    });

    const query = new URLSearchParams();
    if (dateFilter) query.append("date", dateFilter);
    if (timeFilter) query.append("time", timeFilter);

    fetch(`/api/image-results?${query.toString()}`)
      .then(async (r) => (r.ok ? (await r.json() as { results: ImageResult[] }) : null))
      .then((d) => {
        if (!cancelled) {
          if (d?.results) {
            setImageResults(d.results);
          }
          setLoadingImages(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadingImages(false);
      });

    return () => {
      cancelled = true;
    };
  }, [dateFilter, timeFilter]);

  // Filtered results based on search query
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return results;
    const query = searchQuery.toLowerCase();
    return results.filter(
      (r) =>
        r.drawName.toLowerCase().includes(query) ||
        (r.winnerName && r.winnerName.toLowerCase().includes(query)) ||
        r.winningTicket.toLowerCase().includes(query)
    );
  }, [results, searchQuery]);

  return (
   <div className="royal-surface royal-grid relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-24 h-80 w-80 rounded-full bg-fuchsia-500/16 blur-3xl" />
        <div className="absolute -right-40 top-32 h-96 w-96 rounded-full bg-orange-500/16 blur-3xl" />
        <div className="absolute -bottom-48 left-[20%] h-104 w-104 rounded-full bg-amber-300/12 blur-3xl" />
      </div>

      <Navbar />

      <main className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/70">draw outcomes</span>
              {results.length > 0 && (
                <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Updates
                </span>
              )}
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Live Result Board</h1>
            <p className="mt-1 text-sm text-zinc-400">Track real-time draw declarations and verified lottery winners.</p>
          </div>

          {activeTab === "declarations" && (
            <div className="relative w-full max-w-xs shrink-0 mt-4 md:mt-0">
              <span className="absolute inset-y-0 left-3 flex items-center text-zinc-500">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search draw name or ticket..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="sl-input rounded-full pl-9! shadow-2xs"
              />
            </div>
          )}

          {activeTab === "charts" && (
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 md:mt-0 w-full md:w-auto">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="sl-input w-full sm:w-auto rounded-full shadow-2xs"
              />
              <input
                type="time"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="sl-input w-full sm:w-auto rounded-full shadow-2xs"
              />
              {(dateFilter || timeFilter) && (
                <button
                  onClick={() => { setDateFilter(""); setTimeFilter(""); }}
                  className="text-xs font-semibold text-slate-500 hover:text-blue-700 transition whitespace-nowrap"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-4 border-b border-slate-200 pb-px overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab("declarations")}
            className={`whitespace-nowrap border-b-2 py-3 px-1 text-sm font-semibold transition ${
              activeTab === "declarations"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Live Declarations
          </button>
          <button
            onClick={() => setActiveTab("charts")}
            className={`whitespace-nowrap border-b-2 py-3 px-1 text-sm font-semibold transition ${
              activeTab === "charts"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Result Charts
          </button>
        </div>

        {/* Content area */}
        {activeTab === "declarations" ? (
          <>
            {loading ? (
            /* Loading state */
          <div className="royal-panel mt-8 flex flex-col items-center justify-center rounded-3xl border border-blue-200/50 bg-white p-8 py-16 text-center shadow-sm">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-300 border-t-blue-600" />
            <p className="mt-3 text-sm text-slate-600">Fetching latest draw results...</p>
          </div>
        ) : filteredResults.length === 0 ? (
          /* Empty state */
          <div className="royal-panel mt-8 flex flex-col items-center justify-center rounded-3xl border border-blue-200/50 bg-white p-8 py-16 text-center shadow-sm">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900">No results found</h2>
            <p className="mt-2 max-w-sm text-sm text-slate-600">
              {searchQuery ? "We couldn't find any results matching your search query. Try typing something else." : "No draw results have been declared yet. Please check back later."}
            </p>
          </div>
        ) : (
          /* Results Table / Cards */
          <div className="mt-8 space-y-4">
            {filteredResults.map((result) => (
              <div
                key={result.id}
                className="royal-panel flex flex-col justify-between gap-4 rounded-3xl border border-blue-200/40 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6"
              >
                <div className="flex items-start gap-4">
                  {/* Icon badge */}
                  <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500/15 to-indigo-500/15 text-blue-700 sm:flex border border-blue-200/50">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                      <path d="M4 22h16" />
                      <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
                      <path d="M12 2a4 4 0 0 1 4 4v7a4 4 0 0 1-4 4 4 4 0 0 1-4-4V6a4 4 0 0 1 4-4Z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{result.drawName}</h2>
                    {result.winnerName ? (
                      <div className="mt-1 flex items-center gap-2">
                        {result.winnerImage && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={result.winnerImage}
                            alt={result.winnerName}
                            className="h-5 w-5 rounded-full object-cover border border-blue-200"
                          />
                        )}
                        <span className="text-xs text-slate-600">
                          Winner: <strong className="text-slate-900">{result.winnerName}</strong>
                        </span>
                      </div>
                    ) : (
                      <p className="mt-1 text-xs text-slate-500">Verified Draw Result</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4 sm:border-0 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Winning Ticket</p>
                    <div className="mt-1 inline-block rounded-lg bg-blue-50 px-3 py-1 font-mono text-sm font-bold tracking-wider text-blue-700 border border-blue-200">
                      {result.winningTicket}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Prize Amount</p>
                    <p className="mt-1 text-base font-bold text-emerald-700">{result.prize}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
            )}
          </>
        ) : (
          <>
            {loadingImages ? (
            <div className="royal-panel mt-8 flex flex-col items-center justify-center rounded-3xl border border-blue-200/50 bg-white p-8 py-16 text-center shadow-sm">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-300 border-t-blue-600" />
              <p className="mt-3 text-sm text-slate-600">Fetching result charts...</p>
            </div>
          ) : imageResults.length === 0 ? (
            <div className="royal-panel mt-8 flex flex-col items-center justify-center rounded-3xl border border-blue-200/50 bg-white p-8 py-16 text-center shadow-sm">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900">No result charts found</h2>
              <p className="mt-2 max-w-sm text-sm text-slate-600">
                {(dateFilter || timeFilter) ? "We couldn't find any charts matching your selected date and time. Try adjusting the filters." : "No result charts have been uploaded yet."}
              </p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {imageResults.map((result) => (
                <div key={result.id} className="royal-panel overflow-hidden rounded-3xl border border-blue-200/50 bg-white shadow-sm flex flex-col">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-2 text-slate-700">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span className="text-sm font-semibold">{result.resultDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span className="text-xs font-bold">{result.resultTime}</span>
                    </div>
                  </div>
                  <div 
                    className="relative aspect-3/4 w-full bg-slate-100 p-2 cursor-pointer group"
                    onClick={() => setSelectedImage(result.imageUrl)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={result.imageUrl}
                      alt={`Result chart for ${result.resultDate} ${result.resultTime}`}
                      className="w-full h-full object-contain rounded-xl transition duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-blue-900/30 opacity-0 transition group-hover:opacity-100 rounded-b-3xl">
                      <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="15 3 21 3 21 9" />
                          <polyline points="9 21 3 21 3 15" />
                          <line x1="21" y1="3" x2="14" y2="10" />
                          <line x1="3" y1="21" x2="10" y2="14" />
                        </svg>
                        View Fullscreen
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </>
        )}
      </main>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-md cursor-zoom-out"
          >
            <motion.img
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={selectedImage}
              alt="Fullscreen result chart"
              className="max-h-full max-w-full object-contain rounded-lg shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
            
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 hover:scale-110"
              aria-label="Close fullscreen view"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
