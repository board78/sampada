import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartTicketItem = {
  drawId: string;
  drawName: string;
  drawDate: string;
  drawTime: string;
  pricePerTicket: number;
  ticketNumbers: string[];
};

export type CartState = {
  items: CartTicketItem[];
  updatedAt: string;
};

// Initial state reads from localStorage if available (hydration on client)
const getInitialState = (): CartState => {
  if (typeof window === "undefined") return { items: [], updatedAt: new Date(0).toISOString() };
  try {
    const raw = window.localStorage.getItem("subhlaxmi_cart_v1");
    if (raw) {
      const parsed = JSON.parse(raw) as CartState;
      if (Array.isArray(parsed.items)) return parsed;
    }
  } catch (e) {
    console.error("Failed to parse cart from localStorage", e);
  }
  return { items: [], updatedAt: new Date(0).toISOString() };
};

const initialState: CartState = getInitialState();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(state, action: PayloadAction<CartState>) {
      state.items = action.payload.items;
      state.updatedAt = action.payload.updatedAt || new Date().toISOString();
      if (typeof window !== "undefined") {
        window.localStorage.setItem("subhlaxmi_cart_v1", JSON.stringify(state));
      }
    },
    clearCart(state) {
      state.items = [];
      state.updatedAt = new Date().toISOString();
      if (typeof window !== "undefined") {
        window.localStorage.setItem("subhlaxmi_cart_v1", JSON.stringify(state));
      }
    },
    addToCart(state, action: PayloadAction<Omit<CartTicketItem, "ticketNumbers"> & { ticketNumbers: string[] }>) {
      const payload = action.payload;
      const deduped = [...new Set(payload.ticketNumbers)].filter(Boolean);
      if (!deduped.length) return;

      const idx = state.items.findIndex((i) => i.drawId === payload.drawId);
      
      if (idx >= 0) {
        const existing = state.items[idx];
        const merged = [...new Set([...existing.ticketNumbers, ...deduped])];
        state.items[idx] = { ...existing, ...payload, ticketNumbers: merged };
      } else {
        state.items.push({ ...payload, ticketNumbers: deduped });
      }
      
      state.updatedAt = new Date().toISOString();
      if (typeof window !== "undefined") {
        window.localStorage.setItem("subhlaxmi_cart_v1", JSON.stringify(state));
      }
    },
    removeTickets(state, action: PayloadAction<{ drawId: string; ticketNumbers: string[] }>) {
      const { drawId, ticketNumbers } = action.payload;
      const removeSet = new Set(ticketNumbers);
      
      state.items = state.items
        .map((item) =>
          item.drawId !== drawId
            ? item
            : { ...item, ticketNumbers: item.ticketNumbers.filter((n) => !removeSet.has(n)) },
        )
        .filter((item) => item.ticketNumbers.length > 0);
        
      state.updatedAt = new Date().toISOString();
      if (typeof window !== "undefined") {
        window.localStorage.setItem("subhlaxmi_cart_v1", JSON.stringify(state));
      }
    },
    removeDraw(state, action: PayloadAction<string>) {
      const drawId = action.payload;
      state.items = state.items.filter((item) => item.drawId !== drawId);
      state.updatedAt = new Date().toISOString();
      if (typeof window !== "undefined") {
        window.localStorage.setItem("subhlaxmi_cart_v1", JSON.stringify(state));
      }
    }
  },
});

export const mergeCartsHelper = (primary: CartState, secondary: CartState): CartState => {
  const map = new Map<string, CartTicketItem>();

  const upsert = (item: CartTicketItem) => {
    const key = item.drawId;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, { ...item, ticketNumbers: [...new Set(item.ticketNumbers)] });
      return;
    }
    map.set(key, {
      ...existing,
      ...item,
      ticketNumbers: [...new Set([...existing.ticketNumbers, ...item.ticketNumbers])],
    });
  };

  primary.items.forEach(upsert);
  secondary.items.forEach(upsert);

  return { items: [...map.values()], updatedAt: new Date().toISOString() };
};

export const cartUpdatedAtMsHelper = (cart: CartState | null | undefined): number => {
  if (!cart?.updatedAt) return 0;
  return new Date(cart.updatedAt).getTime();
};

export const { setCart, clearCart, addToCart, removeTickets, removeDraw } = cartSlice.actions;
export default cartSlice.reducer;
