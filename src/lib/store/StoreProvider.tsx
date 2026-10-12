"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./store";
import { setUser } from "./features/authSlice";
import type { SafeUser } from "@/lib/auth";

export default function StoreProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: SafeUser | null;
}) {
  const [store] = useState(() => {
    const s = makeStore();
    // Initialize the store with the SSR fetched user to prevent flickering
    s.dispatch(setUser(initialUser));
    return s;
  });

  return <Provider store={store}>{children}</Provider>;
}
