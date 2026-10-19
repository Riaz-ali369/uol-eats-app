import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import ReviewCard from "../../../src/components/ReviewCard";
import { places } from "../../../src/data/places";
import { useReviews } from "../../../src/hooks/useReviews";
import { cardShadow, radius, spacing } from "../../../src/theme/ui";
import { useAppColors } from "../../../src/theme/useAppColors";

/**
 * Reviews list screen for a specific place.
 * Handles loading/empty states and supports add/edit/delete.
 */
export default function ReviewsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const c = useAppColors();

  const place = places.find((p) => p.id === id);
  const { state, remove } = useReviews(id);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Reviews",
          headerBackTitle: "Back"
        }}
      />

      {/* If the place id is invalid, fail gracefully */}
      {!place ? (
        <View style={{ flex: 1, backgroundColor: c.background, padding: spacing.lg }}>
          <Text style={{ color: c.text, fontWeight: "900", fontSize: 20 }}>
            Place not found
          </Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1, backgroundColor: c.background }}
          contentContainerStyle={{ paddingBottom: spacing.xl }}
        >
          <View style={{ padding: spacing.lg, gap: 8 }}>
            <Text style={{ color: c.textMuted, fontWeight: "800", fontSize: 13 }}>
              {place.name}
            </Text>

            {/* Main CTA: adding a review is the primary action on this screen */}
            <Pressable
              onPress={() => router.push(`/place/${place.id}/review-edit`)}
              accessibilityRole="button"
              accessibilityLabel={`Add a review for ${place.name}`}
              style={{
                marginTop: spacing.md,
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderRadius: radius.lg,
                backgroundColor: c.accent,
                // Adds structure in light mode without changing the overall look.
                borderWidth: 1,
                borderColor: "transparent",
                ...cardShadow
              }}
            >
              <Text style={{ color: "#FFFFFF", fontWeight: "900", fontSize: 16 }}>
                Add review
              </Text>
            </Pressable>
          </View>

          {/* Loading state */}
          {state.status === "loading" && (
            <View style={{ paddingHorizontal: spacing.lg }}>
              <Text style={{ color: c.textMuted }}>Loading…</Text>
            </View>
          )}

          {/* Empty state (only when not loading) */}
          {state.status !== "loading" && state.reviews.length === 0 && (
            <View style={{ paddingHorizontal: spacing.lg }}>
              <Text style={{ color: c.text, fontWeight: "900" }}>
                No reviews yet
              </Text>
              <Text style={{ color: c.textMuted, marginTop: 6 }}>
                Be the first to add a rating and optional photo.
              </Text>
            </View>
          )}

          {/* Reviews list */}
          {state.reviews.map((r) => (
            <ReviewCard
              key={r.id}
              review={r}
              onEdit={() =>
                router.push(
                  `/place/${place.id}/review-edit?reviewId=${encodeURIComponent(r.id)}`
                )
              }
              onDelete={() => {
                // Confirm destructive actions so reviews arent removed accidentally.
                Alert.alert("Delete review?", "This cannot be undone.", [
                  { text: "Cancel", style: "cancel" },
                  { text: "Delete", style: "destructive", onPress: () => remove(r.id) }
                ]);
              }}
            />
          ))}
        </ScrollView>
      )}
    </>
  );
}
