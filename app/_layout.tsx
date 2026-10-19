import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { FavouritesProvider } from "../src/context/FavouritesContext";
import { ThemeProvider, useThemeMode } from "../src/context/ThemeContext";
import { BRAND, darkColors, lightColors } from "../src/theme/colors";

/**
 * Keeps the router layout separate from the providers so we can safely use the theme hook.
 * (Theme context needs to exist before useThemeMode() can run.)
 */
function InnerLayout() {
  const { resolvedScheme } = useThemeMode();

  // Handy booleans/aliases so the JSX stays readable.
  const isDark = resolvedScheme === "dark";
  const colours = isDark ? darkColors : lightColors;

  return (
    <>
      {/* Status bar styling is kept in sync with the active theme. */}
      <StatusBar
        style={isDark ? "light" : "dark"}
        backgroundColor={Platform.OS === "android" ? BRAND.uolBlue : undefined}
      />

      <Stack
        screenOptions={{
          // App wide header styling.
          headerStyle: { backgroundColor: BRAND.uolBlue },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontWeight: "900" },
          headerShadowVisible: false,

          // Use theme colours rather than hard coded values so light/dark mode stays coherent.
          contentStyle: {
            backgroundColor: colours.background,
          },
        }}
      >
        {/* Tabs handle their own headers so we hide the parent header here. */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

/**
 * Root layout: provider shell for the whole app.
 * Order matters a bit here theme wraps favourites so any UI inside can theme properly.
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <FavouritesProvider>
          <InnerLayout />
        </FavouritesProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
