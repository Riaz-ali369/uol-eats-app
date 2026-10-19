import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import { useFavourites } from "../../src/context/FavouritesContext";
import { useThemeMode } from "../../src/context/ThemeContext";
import { cardShadow, radius, spacing } from "../../src/theme/ui";
import { useAppColors } from "../../src/theme/useAppColors";

/**
 * Reusable section wrapper for the settings screen.
 * Keeps spacing/typography consistent and avoids repeating card styles.
 */
function SectionCard({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const c = useAppColors();

  return (
    <View
      style={{
        marginTop: spacing.lg,
        padding: spacing.lg,
        borderRadius: radius.xl,
        backgroundColor: c.card,
        borderWidth: 1,
        borderColor: c.border,
        ...cardShadow,
        gap: 10
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "900", color: c.text }}>
        {title}
      </Text>

      {subtitle ? <Text style={{ color: c.textMuted }}>{subtitle}</Text> : null}

      {children}
    </View>
  );
}

/**
 * Large button used for primary actions in Settings.
 * Intentionally chunky so its easy to hit on mobile.
 */
function BigButton({
  label,
  tone = "primary",
  onPress
}: {
  label: string;
  tone?: "primary" | "danger";
  onPress: () => void;
}) {
  const c = useAppColors();

  // Theme-consistent colours: danger actions use the closed token so it reads clearly.
  const bg = tone === "danger" ? c.statusClosedBorder : c.accent;
  const textColor = "#FFFFFF";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      hitSlop={10}
      style={{
        height: 62,
        borderRadius: radius.lg,
        backgroundColor: bg,
        // Keep the button edge consistent across light/dark mode.
        borderWidth: 1,
        borderColor: "transparent",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingHorizontal: spacing.lg,
        ...cardShadow
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "900", color: textColor }}>
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * Settings screen:
 * - theme override (system/light/dark)
 * - offline data controls (clear favourites / clear all storage)
 */
export default function SettingsScreen() {
  const c = useAppColors();
  const { override, resolvedScheme, setOverride } = useThemeMode();
  const { clearAllFavourites } = useFavourites();
  const router = useRouter();

  // Useful little debug style subtitle.
  const themeSubtitle = `Current theme: ${resolvedScheme} (override: ${override})`;

  /**
   * Confirm before clearing saved venues so it cant be done by accident.
   * (This is destructive and the user cant undo it).
   */
  const confirmClearSaved = () => {
    Alert.alert(
      "Clear Saved Venues",
      "This will remove all saved venues from your device.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => clearAllFavourites()
        }
      ]
    );
  };

  /**
   * Clears AsyncStorage and resets the app back to a fresh install state.
   * Keeping this behind a confirm dialog because it wipes everything.
   */
  const confirmClearAllStorage = () => {
    Alert.alert(
      "Clear All App Data",
      "This will clear saved venues and any stored app data.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            // Clear storage first then reset theme + favourites to keep state consistent.
            await AsyncStorage.clear();
            await setOverride("system");
            await clearAllFavourites();
          }
        }
      ]
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: c.background }}
      contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.sm }}
    >
      <SectionCard title="Theme" subtitle={themeSubtitle}>
        <View style={{ gap: spacing.md, marginTop: spacing.sm }}>
          <BigButton
            label="Use System Default"
            onPress={() => setOverride("system")}
          />
          <BigButton
            label="Force Light Mode"
            onPress={() => setOverride("light")}
          />
          <BigButton
            label="Force Dark Mode"
            onPress={() => setOverride("dark")}
          />
        </View>
      </SectionCard>

      <SectionCard
        title="Data"
        subtitle="Clear offline saved venues and stored app data."
      >
        <View style={{ gap: spacing.md, marginTop: spacing.sm }}>
          <BigButton
            tone="danger"
            label="Clear Saved Venues"
            onPress={confirmClearSaved}
          />
          <BigButton
            tone="danger"
            label="Clear All App Data"
            onPress={confirmClearAllStorage}
          />
          <BigButton
            label="About this app"
            onPress={() => router.push("/about")}
          />
        </View>
      </SectionCard>
    </ScrollView>
  );
}
