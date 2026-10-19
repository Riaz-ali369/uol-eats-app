import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { useColorScheme } from "react-native";

type ThemeOverride = "system" | "light" | "dark";

type ThemeContextValue = {
  override: ThemeOverride;
  resolvedScheme: "light" | "dark";
  setOverride: (v: ThemeOverride) => void;
  ready: boolean;
};

// Stored separately so the users theme choice persists across restarts.
const STORAGE_KEY = "uol-eats:themeOverride";

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Theme provider:
 * - supports system theme by default
 * - allows the user to force light/dark in settings
 * - persists the choice using AsyncStorage
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always have a safe fallback in case the device doesnt report a scheme.
  const system = useColorScheme() ?? "light";

  const [override, setOverrideState] = useState<ThemeOverride>("system");
  const [ready, setReady] = useState(false);

  /**
   * Load the saved theme override once on mount.
   * ready=true is used so screens can avoid theme flicker on first load.
   */
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === "system" || saved === "light" || saved === "dark") {
          setOverrideState(saved);
        }
      } finally {
        setReady(true);
      }
    })();
  }, []);

  /**
   * Persist theme override.
   * Even if storage fails, we still apply it for the current session.
   */
  const setOverride = async (v: ThemeOverride) => {
    setOverrideState(v);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, v);
    } catch {
      // Ignore storage failure (app still works, just wont persist).
    }
  };

  /**
   * resolvedScheme is what the UI should actually use.
   * If override is system, we follow the device setting.
   */
  const resolvedScheme: "light" | "dark" = useMemo(() => {
    if (override === "system") return system as "light" | "dark";
    return override;
  }, [override, system]);

  // Memoise context value to reduce unnecessary re renders in consumers.
  const value = useMemo(
    () => ({ override, resolvedScheme, setOverride, ready }),
    [override, resolvedScheme, ready]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Convenience hook for reading/updating theme mode.
 * Throws early if the provider is missing (helps catch wiring mistakes).
 */
export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeMode must be used within ThemeProvider");
  return ctx;
}
