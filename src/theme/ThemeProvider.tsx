import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import {
  ThemeContext,
  type ThemeMode,
} from "./ThemeContext";
import { darkThemeHref, lightThemeHref } from "./themeHrefs";

const THEME_STORAGE_KEY = "lachlan-theme-mode";
const getSystemTheme = (): ThemeMode =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const applyTheme = (theme: ThemeMode) => {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("app-dark", theme === "dark");
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) {
    themeColorMeta.setAttribute(
      "content",
      theme === "dark" ? "#182536" : "#f8fbff"
    );
  }

  const themeLink = document.getElementById("app-theme");
  if (themeLink) {
    themeLink.setAttribute(
      "href",
      theme === "dark" ? darkThemeHref : lightThemeHref
    );
  }
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "light";
    const savedMode = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedMode === "light" || savedMode === "dark") {
      return savedMode;
    }
    return getSystemTheme();
  });

  const resolvedTheme = useMemo(() => mode, [mode]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }, [mode]);

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  const toggleTheme = () => {
    setModeState((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <PrimeReactProvider>
      <ThemeContext.Provider
        value={{ mode, resolvedTheme, setMode, toggleTheme }}
      >
        {children}
      </ThemeContext.Provider>
    </PrimeReactProvider>
  );
};
