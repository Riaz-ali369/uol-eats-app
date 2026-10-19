import { useColorScheme } from "react-native";
import { useThemeMode } from "../context/ThemeContext";
import { darkColors, lightColors, type AppColors } from "./colors";

/**
 * Returns the active colour palette for the app.
 * Falls back safely if the theme context is not yet available.
 */
export function useAppColors(): AppColors {
  // Always have a fallback based on the system theme
  const systemScheme = useColorScheme() ?? "light";

  // Default to the system scheme in case the context isnt ready
  let scheme: "light" | "dark" = systemScheme;

  try {
    const t = useThemeMode();
    scheme = (t.resolvedScheme ?? systemScheme) as "light" | "dark";
  } catch {
    // If the hook is used outside the provider or before it mounts,
    // fall back to the system theme instead of crashing.
    scheme = systemScheme as "light" | "dark";
  }

  return scheme === "dark" ? darkColors : lightColors;
}
