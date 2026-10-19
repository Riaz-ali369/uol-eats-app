import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import { cardShadow, radius, spacing } from "../theme/ui";
import { useAppColors } from "../theme/useAppColors";
import type { Review } from "../types/review";

/**
 * Simple star display without pulling in an icon library.
 * Uses muted colour for the empty stars so the rating is easy to scan.
 */
function Stars({ rating }: { rating: number }) {
  const c = useAppColors();

  return (
    <Text style={{ color: c.text, fontWeight: "900" }}>
      {"★★★★★".slice(0, rating)}
      <Text style={{ color: c.textMuted }}>
        {"★★★★★".slice(rating)}
      </Text>
    </Text>
  );
}

/**
 * Small action pill used for edit/delete controls.
 * Kept consistent with the rest of the pill styling in the app.
 */
function ActionPill({
  label,
  onPress,
  tone = "neutral"
}: {
  label: string;
  onPress: () => void;
  tone?: "neutral" | "danger";
}) {
  const c = useAppColors();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      hitSlop={8}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: c.border,
        // Theme-based background so it stays visible in light mode.
        backgroundColor: c.pillBg
      }}
    >
      <Text
        style={{
          color: tone === "danger" ? c.statusClosedBorder : c.text,
          fontWeight: "900"
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * Review card used on the reviews screen.
 * Shows rating, date, optional photo and basic edit/delete actions.
 */
export default function ReviewCard({
  review,
  onEdit,
  onDelete
}: {
  review: Review;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const c = useAppColors();

  // Use updatedAt so edits are reflected but still shows a simple human readable date.
  const dt = new Date(review.updatedAt);
  const dateLabel = dt.toLocaleDateString();

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
        gap: 8
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 12
        }}
      >
        <View style={{ flex: 1, gap: 6 }}>
          <Stars rating={review.rating} />
          <Text style={{ color: c.textMuted, fontSize: 12 }}>
            Updated: {dateLabel}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <ActionPill label="Edit" onPress={onEdit} />
          <ActionPill label="Delete" onPress={onDelete} tone="danger" />
        </View>
      </View>

      {review.photoUri ? (
        <Image
          source={{ uri: review.photoUri }}
          style={{ width: "100%", height: 220, borderRadius: radius.lg }}
          resizeMode="cover"
          accessibilityLabel="Review photo"
        />
      ) : null}

      <Text style={{ color: c.text, fontSize: 15, lineHeight: 20 }}>
        {review.text || "No text provided."}
      </Text>
    </View>
  );
}
