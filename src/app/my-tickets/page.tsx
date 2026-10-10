"use client";

import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/components/AuthProvider";
import { useTickets } from "./hooks/useTickets";
import { TicketCard } from "./components/TicketCard";
import { SignInRequiredState, LoadingTicketsState, NoTicketsState } from "./components/EmptyStates";
import { ReactLenis } from "lenis/react";
import { motion } from "framer-motion";

export default function MyTicketsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { tickets, loading, refreshing, fetchTickets } = useTickets(user, authLoading);

  const handleSignInClick = () => {
    router.push(`/?auth=signin&next=${encodeURIComponent("/my-tickets")}`);
  };

  return (
    <div className="royal-surface royal-grid relative flex h-screen flex-col overflow-hidden bg-background text-foreground">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-24 h-80 w-80 rounded-full bg-fuchsia-500/16 blur-3xl" />
        <div className="absolute -right-40 top-32 h-96 w-96 rounded-full bg-orange-500/16 blur-3xl" />
        <div className="absolute -bottom-48 left-[20%] h-104 w-104 rounded-full bg-amber-300/12 blur-3xl" />
      </div>

      <Navbar />

      <div className="min-h-0 flex-1">
        <ReactLenis options={{ duration: 1.2, smoothWheel: true }} className="hide-scrollbar h-full overflow-y-auto">
          <main className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/70">Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">My Tickets</h1>
            <p className="mt-1 text-sm text-zinc-400">View and track all your booked lottery tickets.</p>
          </div>
          {user && !loading && (
            <button
              type="button"
              onClick={() => fetchTickets(true)}
              disabled={refreshing}
              className="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/10 disabled:opacity-50"
            >
              <svg
                className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          )}
        </div>

        {/* Content area */}
        {!user ? (
          <SignInRequiredState onSignIn={handleSignInClick} />
        ) : loading ? (
          <LoadingTicketsState />
        ) : tickets.length === 0 ? (
          <NoTicketsState />
        ) : (
          <>
            <p className="mb-6 text-sm text-zinc-400">
              You have <span className="font-semibold text-amber-300">{tickets.length}</span> ticket{tickets.length !== 1 ? "s" : ""} booked.
            </p>
            <motion.div 
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {tickets.map((ticket, index) => (
                <TicketCard key={ticket.id} ticket={ticket} index={index} />
              ))}
            </motion.div>
          </>
        )}
      </main>
        </ReactLenis>
      </div>
    </div>
  );
}
