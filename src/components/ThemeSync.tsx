"use client";

import { useEffect } from "react";

/** Applies saved theme to <html> on the client — no inline scripts in layout (Next.js 16). */
export function ThemeSync() {
  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    } catch {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  return null;
}
