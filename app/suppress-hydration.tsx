"use client";

import { useEffect } from "react";

export function SuppressHydrationWarning() {
  useEffect(() => {
    // Suppress hydration warnings in development
    if (process.env.NODE_ENV === "development") {
      const originalError = console.error;
      console.error = (...args) => {
        if (
          typeof args[0] === "string" &&
          (args[0].includes("Hydration failed") ||
            args[0].includes("There was an error while hydrating") ||
            args[0].includes("Text content does not match") ||
            args[0].includes("bis_skin_checked"))
        ) {
          return;
        }
        originalError.apply(console, args);
      };
    }
  }, []);

  return null;
}
