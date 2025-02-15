"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function useThemeMode() {
  const [mounted, setMounted] = useState(false);
  const themeContext = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return {
      mounted: false,
      currentTheme: undefined,
      setTheme: () => {},
      isDark: false,
      isLight: false,
    };
  }

  return {
    mounted: true,
    currentTheme: themeContext.resolvedTheme,
    setTheme: themeContext.setTheme,
    isDark: themeContext.resolvedTheme === "dark",
    isLight: themeContext.resolvedTheme === "light",
  };
} 