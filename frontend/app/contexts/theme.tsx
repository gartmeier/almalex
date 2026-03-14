import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContext {
  theme: Theme;
  resolved: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

let ThemeCtx = createContext<ThemeContext | null>(null);

function getStoredTheme(): Theme {
  if (typeof document === "undefined") return "system";
  let match = document.cookie.match(/(?:^|; )theme=(light|dark|system)/);
  return (match?.[1] as Theme) ?? "system";
}

function resolve(theme: Theme): "light" | "dark" {
  if (theme !== "system") return theme;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(resolved: "light" | "dark") {
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.style.colorScheme = resolved;
}

interface ThemeProviderProps {
  ssrTheme?: Theme;
  children: React.ReactNode;
}

export function ThemeProvider({ ssrTheme = "system", children }: ThemeProviderProps) {
  let [theme, setThemeState] = useState<Theme>(
    typeof document === "undefined" ? ssrTheme : getStoredTheme,
  );
  let resolved = resolve(theme);

  let setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    document.cookie = `theme=${next};path=/;max-age=31536000;SameSite=Strict`;
    applyTheme(resolve(next));
  }, []);

  useEffect(() => {
    applyTheme(resolved);
  }, [resolved]);

  // Listen for system preference changes when in "system" mode
  useEffect(() => {
    if (theme !== "system") return;
    let mq = window.matchMedia("(prefers-color-scheme: dark)");
    function onChange() {
      let r = resolve("system");
      setThemeState("system"); // trigger re-render
      applyTheme(r);
    }
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  let value = useMemo(
    () => ({ theme, resolved, setTheme }),
    [theme, resolved, setTheme],
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  let ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
