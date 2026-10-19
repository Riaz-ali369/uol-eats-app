import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";

import { useFavourites } from "../context/FavouritesContext";
import { cardShadow, radius, spacing } from "../theme/ui";
import { useAppColors } from "../theme/useAppColors";
import type { Place } from "../types";
import { formatDistance } from "../utils/distance";
import { smartOpeningStatus } from "../utils/opening";

/**
 * Small pill style label used for metadata (price, distance, vibes, etc...).
 */
function Pill({ label }: { label: string }) {
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
      <Text
        style={{
          fontWeight: "800",
          color: c.text,
          fontSize: 12
        }}
      >
        {label}
      </Text>
    </View>
  );
}

type StatusTone = "open" | "closed" | "twentyfour" | "unknown";

/**
 * Opening status badge.
 * Tone is derived separately so styling stays clean and readable.
 */
function StatusBadge({
  label,
  tone
}: {
  label: string;
  tone: StatusTone;
}) {
  const c = useAppColors();

  const s =
    tone === "twentyfour"
      ? {
          bg: c.status24Bg,
          border: c.status24Border,
          text: c.status24Text
        }
      : tone === "open"
      ? {
          bg: c.statusOpenBg,
          border: c.statusOpenBorder,
          text: c.statusOpenText
        }
      : tone === "closed"
      ? {
          bg: c.statusClosedBg,
          border: c.statusClosedBorder,
          text: c.statusClosedText
        }
      : {
          bg: c.pillBg,
          border: c.border,
          text: c.text
        };

  return (
    <View
      style={{
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: s.border,
        backgroundColor: s.bg
      }}
    >
      <Text
        style={{
          fontWeight: "900",
          color: s.text,
          fontSize: 12
        }}
      >
        {label}
      </Text>
    </View>
  );
}

/**
 * Place card used across list screens.
 * Shows key info at a glance and supports saving to favourites.
 */
export default function PlaceCard({
  place,
  distanceMeters,
  onPress
}: {
  place: Place;
  distanceMeters?: number;
  onPress: () => void;
}) {
  const c = useAppColors();
  const { isFavourite, toggleFavourite } = useFavourites();
  const fav = isFavourite(place.id);

  // Limit vibes so the card stays compact on smaller screens.
  const vibeText = place.vibes.slice(0, 2).join(", ");

  const openingText = smartOpeningStatus(place.openingHours);

  /**
   * Derive a tone from the opening text so we dont duplicate logic
   * inside the badge component.
   */
  const openingTone: StatusTone = useMemo(() => {
    const t = (openingText || "").toLowerCase();
    if (t.includes("24")) return "twentyfour";
    if (t.startsWith("open")) return "open";
    if (t.includes("closed")) return "closed";
    return "unknown";
  }, [openingText]);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open details for ${place.name}`}
      style={{
        marginHorizontal: spacing.lg,
        marginTop: spacing.md,
        padding: spacing.lg,
        borderRadius: radius.xl,
        backgroundColor: c.card,
        borderWidth: 1,
        borderColor: c.border,
        ...cardShadow
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: spacing.md
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: "900", color: c.text }}>
            {place.name}
          </Text>

          <Text
            style={{
              marginTop: 4,
              color: c.textMuted,
              fontSize: 14
            }}
          >
            {place.areaLabel}
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginTop: spacing.sm,
              alignItems: "center"
            }}
          >
            <Pill label={place.price} />
            {place.studentDiscount && <Pill label="Student discount" />}
            <StatusBadge label={openingText} tone={openingTone} />
            <Pill label={formatDistance(distanceMeters ?? Number.NaN)} />
            {vibeText ? <Pill label={vibeText} /> : null}
          </View>
        </View>

        <View style={{ alignItems: "flex-end", gap: 10 }}>
          {place.studentDiscount ? <Pill label="Discount" /> : <View />}

          {/* Save button is separated so tapping it doesnt open the card */}
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              toggleFavourite(place.id);
            }}
            accessibilityRole="button"
            accessibilityLabel={fav ? "Remove from saved" : "Save place"}
            hitSlop={10}
            style={{
              width: 46,
              height: 46,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: c.border,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: c.pillBg
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: fav ? "#FF4D6D" : c.textMuted
              }}
            >
              {fav ? "♥" : "♡"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}
