"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import type { SafeUser } from "@/lib/auth";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setUser as setReduxUser, setLoading } from "@/lib/store/features/authSlice";
import {
  setCart,
} from "@/lib/store/features/cartSlice";
import { mergeCartsHelper, cartUpdatedAtMsHelper, CartState } from "@/lib/store/features/cartSlice";

interface AuthContextType {
  user: SafeUser | null;
  authUser: SafeUser | null; // For backwards compatibility with old hook
  loading: boolean;
  setUser: (user: SafeUser | null) => void;
  setAuthUser: (user: SafeUser | null) => void; // For backwards compatibility with old hook
  updateAuthedUser: (user: SafeUser | null) => void; // For backwards compatibility with old hook
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  authUser: null,
  loading: true,
  setUser: () => {},
  setAuthUser: () => {},
  updateAuthedUser: () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ 
  children,
  initialUser,
}: { 
  children: React.ReactNode;
  initialUser: SafeUser | null;
}) {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);
  
  // Track if we've initialized from server
  const initialized = useRef(false);

  const fetchUser = async () => {
    dispatch(setLoading(true));
    try {
      const res = await fetch("/api/profile", { cache: "no-store", headers: { "Cache-Control": "no-cache" } });
      if (res.ok) {
        const data = await res.json();
        dispatch(setReduxUser(data?.user || null));
      } else {
        dispatch(setReduxUser(null));
      }
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      dispatch(setReduxUser(null));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      if (initialUser !== undefined) {
        dispatch(setReduxUser(initialUser));
      } else {
        fetchUser();
      }
    }
  }, [initialUser, dispatch]);

  const cart = useAppSelector((state) => state.cart);
  
  // Hydrate / merge cart after login
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    void fetch("/api/cart", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) return { ok: false, data: {} as { cart?: unknown } };
        try {
          return { ok: true, data: (await r.json()) as { cart?: unknown } };
        } catch {
          return { ok: false, data: {} as { cart?: unknown } };
        }
      })
      .then(({ ok, data }) => {
        if (cancelled || !ok || !data.cart) return;
        const remote = data.cart as CartState;
        const local  = cart;
        const localTs  = cartUpdatedAtMsHelper(local);
        const remoteTs = cartUpdatedAtMsHelper(remote);

        if (localTs > remoteTs) {
          void fetch("/api/cart", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cart: local }) });
          return;
        }
        if (remoteTs > localTs) { dispatch(setCart(remote)); return; }

        const merged = mergeCartsHelper(local, remote);
        dispatch(setCart(merged));
        void fetch("/api/cart", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cart: merged }) });
      })
      .catch(() => {});

    return () => { cancelled = true; };
    // We intentionally don't add `cart` as a dependency here to avoid infinite loops on login
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, dispatch]);

  // Persist cart on every update (debounced, 120 ms)
  useEffect(() => {
    if (!user) return;
    const timer = window.setTimeout(() => {
      void fetch("/api/cart", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cart }) });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [user, cart]);

  const updateAuthedUser = (newUser: SafeUser | null) => {
    dispatch(setReduxUser(newUser));
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        authUser: user, 
        loading, 
        setUser: updateAuthedUser, 
        setAuthUser: updateAuthedUser, 
        updateAuthedUser, 
        refreshUser: fetchUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
