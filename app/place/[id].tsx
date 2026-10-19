import * as Linking from "expo-linking";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";

import { useFavourites } from "../../src/context/FavouritesContext";
import { places } from "../../src/data/places";
import { useCurrentLocation } from "../../src/hooks/useCurrentLocation";
import { cardShadow, radius, spacing } from "../../src/theme/ui";
import { useAppColors } from "../../src/theme/useAppColors";
import type { OpeningHours } from "../../src/types";
import { formatDistance, haversineMeters } from "../../src/utils/distance";
import { isOpenNow } from "../../src/utils/opening";

/* ------------------ Shared UI ------------------ */

/**
 * Simple card wrapper for sections on the details screen.
 * Keeps spacing and typography consistent across sections.
 */
function Card({
  title,
  right,
  children
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  const c = useAppColors();

  return (
    <View
      style={{
        marginHorizontal: spacing.lg,
        marginTop: spacing.md,
        padding: spacing.lg,
        borderRadius: radius.xl,
        backgroundColor: c.card,
        borderWidth: 1,
        borderColor: c.border,
        ...cardShadow,
        gap: 10
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "900", color: c.text }}>
          {title}
        </Text>
        {right ?? null}
      </View>

      {children}
    </View>
  );
}

/**
 * Small tag pill for vibes (quiet, study, etc).
 * Uses theme tokens so it stays readable in both light/dark mode.
 */
function Tag({ label }: { label: string }) {
  const c = useAppColors();

  return (
    <View
      style={{
        paddingVertical: 5,
        paddingHorizontal: 9,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: c.border,
        backgroundColor: c.pillBg
      }}
    >
      <Text style={{ color: c.text, fontWeight: "800", fontSize: 12 }}>
        {label}
      </Text>
    </View>
  );
}

/* ------------------ Status Pill ------------------ */

/**
 * Open/closed status indicator based on opening hours.
 * Colour tokens are separated so it stays clear in light mode as well.
 */
function StatusPill({ open }: { open: boolean }) {
  const c = useAppColors();

  const s = open
    ? { bg: c.statusOpenBg, border: c.statusOpenBorder, text: c.statusOpenText }
    : { bg: c.statusClosedBg, border: c.statusClosedBorder, text: c.statusClosedText };

  return (
    <View
      style={{
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: s.border,
        backgroundColor: s.bg
      }}
    >
      <Text style={{ color: s.text, fontWeight: "900", fontSize: 12 }}>
        {open ? "Open now" : "Closed"}
      </Text>
    </View>
  );
}

/* ------------------ Buttons ------------------ */

/**
 * Lightweight button used for actions on the details page.
 * Ghost is used for secondary actions so the main CTA stands out.
 */
function Button({
  label,
  onPress,
  tone = "primary"
}: {
  label: string;
  onPress: () => void;
  tone?: "primary" | "ghost";
}) {
  const c = useAppColors();

  const bg = tone === "primary" ? c.accent : c.pillBg;
  const borderColor = tone === "primary" ? "transparent" : c.border;
  const labelColor = tone === "primary" ? "#FFFFFF" : c.text;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      hitSlop={10}
      style={{
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor,
        backgroundColor: bg
      }}
    >
      <Text style={{ fontWeight: "900", color: labelColor }}>{label}</Text>
    </Pressable>
  );
}

/* ------------------ Opening Hours ------------------ */

function dayLabel(day: number) {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day] ?? "";
}

function rangesToText(ranges: { open: string; close: string }[]) {
  if (!ranges?.length) return "Closed";
  return ranges.map((r) => `${r.open}–${r.close}`).join(", ");
}

/**
 * Compact hours component:
 * - Special case 24h venues
 * - Otherwise show a simple 7 day breakdown with today highlighted
 */
function CompactHours({ openingHours }: { openingHours: OpeningHours }) {
  const c = useAppColors();
  const today = new Date().getDay();

  if (openingHours.type === "24h") {
    return (
      <View style={{ gap: 8 }}>
        <View
          style={{
            alignSelf: "flex-start",
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: c.status24Border,
            backgroundColor: c.status24Bg
          }}
        >
          <Text style={{ color: c.status24Text, fontWeight: "900" }}>
            Open 24 hours
          </Text>
        </View>

        <Text style={{ color: c.textMuted, lineHeight: 20 }}>
          This venue is open all day, every day.
        </Text>
      </View>
    );
  }

  const days = openingHours.days;

  return (
    <View style={{ gap: 8 }}>
      {Array.from({ length: 7 }).map((_, i) => {
        const isToday = i === today;
        const t = rangesToText(days[i] ?? []);

        return (
          <View
            key={i}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: isToday ? c.accent : c.border,
              backgroundColor: isToday ? c.pillBg : "transparent"
            }}
          >
            <Text style={{ color: c.text, fontWeight: "900" }}>
              {dayLabel(i)}
              {isToday ? " (Today)" : ""}
            </Text>
            <Text style={{ color: c.textMuted, fontWeight: "800" }}>{t}</Text>
          </View>
        );
      })}
    </View>
  );
}

/* ------------------ Screen ------------------ */

/**
 * Place details screen.
 * Top level component handles routing params + header then renders the body.
 */
export default function PlaceDetails() {
  const router = useRouter();
  const c = useAppColors();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Memoised lookup so the header and render dont repeatedly scan the array.
  const place = useMemo(() => places.find((p) => p.id === id), [id]);

  return (
    <>
      <Stack.Screen
        options={{
          title: place?.name ?? "Place",
          headerBackTitle: "Back"
        }}
      />

      {!place ? (
        <View style={{ flex: 1, backgroundColor: c.background, padding: spacing.lg }}>
          <Text style={{ fontSize: 22, fontWeight: "900", color: c.text }}>
            Not found
          </Text>
          <Button label="Go back" onPress={() => router.back()} />
        </View>
      ) : (
        <PlaceBody placeId={place.id} />
      )}
    </>
  );

  /**
   * Render body separated out so the not found branch stays clean.
   * Nested here because it only makes sense within PlaceDetails.
   */
  function PlaceBody({ placeId }: { placeId: string }) {
    const place = places.find((p) => p.id === placeId)!;
    const { coords, state: locState } = useCurrentLocation();
    const { isFavourite, toggleFavourite } = useFavourites();

    // Fallback location keeps distance stable even if permission is denied.
    const safeCoords = useMemo(() => {
      const fallback = { lat: 53.2307, lon: -0.5406 };
      if (!coords || typeof coords.lat !== "number" || typeof coords.lon !== "number") return fallback;
      return coords;
    }, [coords]);

    const distance = useMemo(
      () => haversineMeters(safeCoords.lat, safeCoords.lon, place.lat, place.lon),
      [safeCoords.lat, safeCoords.lon, place.lat, place.lon, safeCoords]
    );

    const fav = isFavourite(place.id);
    const open = isOpenNow(place.openingHours);

    /**
     * Opens the place in the users maps app.
     * Handles iOS (Apple Maps) vs Android (geo: URI) and falls back to web if needed.
     */
    const openInMaps = async () => {
      const label = encodeURIComponent(place.name);
      const lat = place.lat;
      const lon = place.lon;

      const url =
        Platform.OS === "ios"
          ? `http://maps.apple.com/?ll=${lat},${lon}&q=${label}`
          : `geo:${lat},${lon}?q=${lat},${lon}(${label})`;

      const can = await Linking.canOpenURL(url);
      if (can) await Linking.openURL(url);
      else await Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`);
    };

    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: c.background }}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      >
        <View style={{ padding: spacing.lg, gap: 10 }}>
          <Text style={{ color: c.textMuted, fontSize: 14 }}>
            {place.areaLabel} · {place.category} · {place.price} · {formatDistance(distance)}
          </Text>

          {locState?.status === "denied" && (
            <Text style={{ color: c.textMuted, fontSize: 12 }}>
              Location permission denied — distance is estimated from Lincoln centre.
            </Text>
          )}

          <View style={{ flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" }}>
            <Button
              label={fav ? "♥ Saved" : "♡ Save"}
              onPress={() => toggleFavourite(place.id)}
            />
            <Button
              label="Reviews"
              onPress={() => router.push(`/place/${place.id}/reviews`)}
              tone="ghost"
            />
            <Button
              label="Open in Maps"
              onPress={openInMaps}
              tone="ghost"
            />
          </View>
        </View>

        <Card title="About" right={<StatusPill open={open} />}>
          <Text style={{ color: c.text, fontSize: 16, lineHeight: 22 }}>
            {place.description}
          </Text>

          <Text style={{ color: c.textMuted, marginTop: spacing.sm, fontWeight: "900" }}>
            Good for
          </Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {place.vibes?.length ? (
              place.vibes.map((v) => <Tag key={v} label={v} />)
            ) : (
              <Text style={{ color: c.textMuted }}>No tags yet.</Text>
            )}
          </View>
        </Card>

        <Card title="Opening hours">
          <CompactHours openingHours={place.openingHours} />
        </Card>
      </ScrollView>
    );
  }
}
