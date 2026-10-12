"use client";

import { useEffect } from "react";

/** Applies saved theme to <html> on the client — no inline scripts in layout (Next.js 16). */
export function ThemeSync() {
  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } catch {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  return null;
}
