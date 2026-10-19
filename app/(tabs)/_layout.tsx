import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { useThemeMode } from "../../src/context/ThemeContext";
import { BRAND } from "../../src/theme/colors";
import { useAppColors } from "../../src/theme/useAppColors";

/**
 * Bottom tab layout for the main sections of the app.
 * Handles all header and tab bar styling in one place to keep things consistent.
 */
export default function TabsLayout() {
  const colours = useAppColors();
  const { resolvedScheme } = useThemeMode();

  const isDark = resolvedScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        /* ---------- HEADER ---------- */
        headerShown: true,
        headerTitleStyle: { fontWeight: "900" },
        headerStyle: { backgroundColor: BRAND.uolBlue },
        headerTintColor: "#FFFFFF",
        headerShadowVisible: false,

        /* ---------- TAB BAR ---------- */
        tabBarStyle: {
          backgroundColor: colours.card,
          borderTopColor: colours.border,
          borderTopWidth: 1,
          paddingTop: 6,
          ...(Platform.OS === "android" ? { paddingBottom: 10 } : {})
        },

        tabBarShowLabel: false,

        // Use theme tokens instead of hard coded colours
        tabBarActiveTintColor: colours.accent,
        tabBarInactiveTintColor: colours.textMuted
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "UoL Eats",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          )
        }}
      />

      <Tabs.Screen
        name="nearby"
        options={{
          title: "Nearby",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" size={size} color={color} />
          )
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          )
        }}
      />

      <Tabs.Screen
        name="favourites"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          )
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          )
        }}
      />
    </Tabs>
  );
}
