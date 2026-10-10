import { useState, useCallback, useEffect } from "react";
import type { TicketInfo } from "../types";
import type { SafeUser } from "@/lib/auth";

export function useTickets(user: SafeUser | null, authLoading: boolean) {
  const [tickets, setTickets] = useState<TicketInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      setLoading(false);
    }
  }, [authLoading, user]);

  const fetchTickets = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const r = await fetch("/api/tickets");
      if (r.ok) {
        const data = await r.json() as { tickets: TicketInfo[] };
        setTickets(data.tickets ?? []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchTickets();
  }, [user, fetchTickets]);

  return { tickets, loading, refreshing, fetchTickets };
}
