"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "./store";
import { setUser } from "./features/authSlice";
import type { SafeUser } from "@/lib/auth";

export default function StoreProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: SafeUser | null;
}) {
  const storeRef = useRef<AppStore | null>(null);
  
  if (!storeRef.current) {
    storeRef.current = makeStore();
    // Initialize the store with the SSR fetched user to prevent flickering
    storeRef.current.dispatch(setUser(initialUser));
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
