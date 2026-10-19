import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Pressable, RefreshControl, ScrollView, Text, View } from "react-native";

import { useThemeMode } from "../../src/context/ThemeContext";
import { places } from "../../src/data/places";
import { useCurrentLocation } from "../../src/hooks/useCurrentLocation";
import { listRecentReviews } from "../../src/storage/reviewsStore";
import { cardShadow, radius, spacing } from "../../src/theme/ui";
import { useAppColors } from "../../src/theme/useAppColors";
import type { Review } from "../../src/types/review";
import { formatDistance, haversineMeters } from "../../src/utils/distance";

/**
 * Simple reusable card wrapper for the home screen sections.
 * Keeps spacing/colour/border consistent without duplicating styles everywhere.
 */
function Card({
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
      <Text style={{ fontSize: 18, fontWeight: "900", color: c.text }}>{title}</Text>
      {subtitle ? <Text style={{ color: c.textMuted }}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

/**
 * Small pill used for tiny bits of emphasis.
 * Nice for keeping the UI looking consistent across sections.
 */
function MiniChip({ label }: { label: string }) {
  const c = useAppColors();
  return (
    <View
      style={{
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: c.border,
        backgroundColor: c.pillBg
      }}
    >
      <Text style={{ color: c.text, fontWeight: "900", fontSize: 12 }}>{label}</Text>
    </View>
  );
}

/**
 * Keeps review previews readable.
 * Also avoids showing an empty string if the user didnt type anything.
 */
function reviewPreview(text: string) {
  const t = (text ?? "").trim();
  if (!t) return "No text provided.";
  return t.length > 90 ? t.slice(0, 90) + "…" : t;
}

/**
 * State model for recent reviews so the UI can show loading/error/empty properly.
 * This makes the screen feel a bit more like a real app not just nothing happens.
 */
type RecentState =
  | { status: "loading"; items: Review[] }
  | { status: "ready"; items: Review[] }
  | { status: "error"; items: Review[]; message: string };

/**
 * Home screen: quick picks + recent reviews.
 * Designed to be lightweight fast to scan and usable even if location is denied.
 */
export default function HomeScreen() {
  const router = useRouter();
  const c = useAppColors();
  const { resolvedScheme } = useThemeMode();

  // Location is optional for the app to function but it improves distance based suggestions.
  const { coords, state: locState } = useCurrentLocation();

  const [recentState, setRecentState] = useState<RecentState>({
    status: "loading",
    items: []
  });
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Loads a small number of recent reviews for the home screen.
   * Kept separate so it can be reused by both focus refresh and pull to refresh.
   */
  const loadRecent = useCallback(async () => {
    setRecentState((s) => ({ ...s, status: "loading" }));
    try {
      const items = await listRecentReviews(3);
      setRecentState({ status: "ready", items });
    } catch (e: any) {
      // Fail gracefully: the user can still use the rest of the app even if storage read fails.
      setRecentState({
        status: "error",
        items: [],
        message: String(e?.message ?? "Failed to load recent reviews")
      });
    }
  }, []);

  // Reload when the screen comes into focus.
  useFocusEffect(
    useCallback(() => {
      loadRecent();
    }, [loadRecent])
  );

  /**
   * Pull to refresh handler.
   * Using finally ensures the spinner stops even if loadRecent throws.
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadRecent();
    } finally {
      setRefreshing(false);
    }
  }, [loadRecent]);

  /**
   * Quick picks are calculated from existing place data:
   * - a 24h option (if available)
   * - a student discount option (if available)
   * - the closest place to the user (based on current coords)
   *
   * Memoised so it doesnt rerun unnecessarily.
   */
  const quickPicks = useMemo(() => {
    const open24 = places.find((p) => p.openingHours?.type === "24h");
    const discount = places.find((p) => p.studentDiscount);

    const closest = [...places]
      .map((p) => ({
        p,
        d: haversineMeters(coords.lat, coords.lon, p.lat, p.lon)
      }))
      .sort((a, b) => a.d - b.d)[0];

    const out: { key: string; title: string; subtitle: string; placeId: string }[] = [];

    // Keep picks simple rather than over engineering recommendations.
    if (open24) out.push({ key: "open24", title: "Open 24 hours", subtitle: open24.name, placeId: open24.id });
    if (discount) out.push({ key: "discount", title: "Student discount", subtitle: discount.name, placeId: discount.id });
    if (closest?.p)
      out.push({
        key: "closest",
        title: "Closest to you",
        subtitle: `${closest.p.name} · ${formatDistance(closest.d)}`,
        placeId: closest.p.id
      });

    // Avoid duplicates (e.g. the same place being both closest and student discount).
    const seen = new Set<string>();
    return out.filter((x) => (seen.has(x.placeId) ? false : (seen.add(x.placeId), true))).slice(0, 3);
  }, [coords.lat, coords.lon]);

  const isDark = resolvedScheme === "dark";
  const refreshSpinner = isDark ? "#FFFFFF" : c.accent;

  return (
    <ScrollView
      alwaysBounceVertical
      style={{ flex: 1, backgroundColor: c.background }}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          // iOS
          tintColor={refreshSpinner}
          title="Refreshing…"
          titleColor={c.text}
          // Android
          colors={[refreshSpinner]}
          // theme safe background
          progressBackgroundColor={c.pillBg}
        />
      }
    >
      {/* Small status text so the user knows why distance based bits might take a moment */}
      <Text style={{ fontSize: 16, fontWeight: "900", color: c.text }}>
        {locState?.status === "loading" ? "Getting your location…" : " "}
      </Text>

      {/* Friendly greeting */}
      <Text
        style={{
          marginTop: spacing.sm,
          color: c.textMuted,
          fontSize: 16,
          lineHeight: 22
        }}
      >
        Welcome! Discover places to eat around Lincoln enjoy nearby cafés, takeaways and restaurants!
      </Text>

      <Card title="Quick picks" subtitle="Fast suggestions based on common needs.">
        <View style={{ gap: spacing.sm }}>
          {quickPicks.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => router.push(`/place/${item.placeId}`)}
              accessibilityRole="button"
              accessibilityLabel={`Open ${item.subtitle}`}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 12,
                borderRadius: radius.lg,
                borderWidth: 1,
                borderColor: c.border,
                // visible in light mode
                backgroundColor: c.pillBg,
                gap: 6
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <Text style={{ color: c.text, fontWeight: "900" }}>{item.title}</Text>
                <MiniChip label="Tap" />
              </View>
              <Text style={{ color: c.textMuted, fontWeight: "800" }}>{item.subtitle}</Text>
            </Pressable>
          ))}
        </View>
      </Card>

      <Card title="Recently reviewed" subtitle="Latest ratings and comments.">
        {/* Show loading only when we’re not already doing a pull to refresh */}
        {recentState.status === "loading" && !refreshing && (
          <Text style={{ color: c.textMuted }}>Loading recent reviews…</Text>
        )}

        {/* Lightweight error message doesnt block the rest of the screen */}
        {recentState.status === "error" && (
          <Text style={{ color: c.textMuted }}>Could not load: {recentState.message}</Text>
        )}

        {/* Empty state: explains how to create reviews rather than just saying nothing here */}
        {recentState.status === "ready" && recentState.items.length === 0 && (
          <Text style={{ color: c.textMuted, lineHeight: 20 }}>
            No reviews yet. Add one from any place page and it will appear here.
          </Text>
        )}

        {recentState.status === "ready" &&
          recentState.items.map((r) => {
            const place = places.find((p) => p.id === r.placeId);
            if (!place) return null;

            // Keep the date display simple and consistent across locales.
            const when = new Date(r.updatedAt || r.createdAt).toLocaleDateString();

            return (
              <Pressable
                key={r.id}
                onPress={() => router.push(`/place/${place.id}/reviews`)}
                accessibilityRole="button"
                accessibilityLabel={`Open reviews for ${place.name}`}
                style={{
                  marginTop: spacing.sm,
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  borderRadius: radius.lg,
                  borderWidth: 1,
                  borderColor: c.border,
                  // visible in light mode
                  backgroundColor: c.pillBg,
                  gap: 6
                }}
              >
                <Text style={{ color: c.text, fontWeight: "900" }}>
                  {place.name} · {r.rating}★
                </Text>
                <Text style={{ color: c.textMuted, fontSize: 12 }}>{when}</Text>
                <Text style={{ color: c.textMuted }}>{reviewPreview(r.text)}</Text>
              </Pressable>
            );
          })}
      </Card>

      {/* Tiny hint so users discover pull to refresh */}
      <Text style={{ marginTop: spacing.lg, color: c.textMuted, fontSize: 12, lineHeight: 18 }}>
        Pull down to refresh.
      </Text>
    </ScrollView>
  );
}
