import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";

import { places } from "../../../src/data/places";
import { useReviews } from "../../../src/hooks/useReviews";
import { cardShadow, radius, spacing } from "../../../src/theme/ui";
import { useAppColors } from "../../../src/theme/useAppColors";
import type { Review } from "../../../src/types/review";


/**
 * Lightweight unique ID generator for locally stored reviews.
 * Good enough for offline usage without pulling in a whole UUID dependency.
 */
function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * Rating selector row (1–5).
 * Uses accessibilityState so screen readers can tell which rating is selected.
 */
function StarRow({
  rating,
  setRating
}: {
  rating: number;
  setRating: (n: number) => void;
}) {
  const c = useAppColors();

  return (
    <View style={{ flexDirection: "row", gap: 10 }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const selected = n === rating;

        return (
          <Pressable
            key={n}
            onPress={() => setRating(n)}
            accessibilityRole="button"
            accessibilityLabel={`Set rating to ${n} stars`}
            accessibilityState={{ selected }}
            hitSlop={8}
            style={{
              width: 48,
              height: 48,
              borderRadius: 999,
              borderWidth: 2,
              borderColor: selected ? c.accent : c.border,
              alignItems: "center",
              justifyContent: "center",
              // Theme based background so it stays visible in light mode as well.
              backgroundColor: selected ? c.accent : c.pillBg
            }}
          >
            <Text
              style={{
                color: selected ? "#FFFFFF" : c.text,
                fontWeight: "900",
                fontSize: 16
              }}
            >
              {selected ? `${n}✓` : n}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * Review create/edit screen.
 * Supports rating, text and an optional photo (camera or library).
 */
export default function ReviewEditScreen() {
  const { id, reviewId } = useLocalSearchParams<{ id: string; reviewId?: string }>();
  const router = useRouter();
  const c = useAppColors();

  const place = places.find((p) => p.id === id);
  const { state, save } = useReviews(id);

  // If reviewId is present we’re editing otherwise we’re creating a new review.
  const existing = useMemo(
    () => state.reviews.find((r) => r.id === reviewId),
    [state.reviews, reviewId]
  );

  const [rating, setRating] = useState<number>(existing?.rating ?? 5);
  const [text, setText] = useState<string>(existing?.text ?? "");
  const [photoUri, setPhotoUri] = useState<string | undefined>(existing?.photoUri);

  // Safety check: the place must exist (e.g. if someone navigates to an invalid id).
  if (!place) {
    return (
      <View style={{ flex: 1, backgroundColor: c.background, padding: spacing.lg }}>
        <Text style={{ color: c.text, fontWeight: "900", fontSize: 20 }}>
          Place not found
        </Text>
      </View>
    );
  }

  /**
   * Pick an image from the photo library.
   * Keeping quality slightly compressed so storage doesnt balloon.
   */
  const pickFromLibrary = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85
    });

    if (!res.canceled) setPhotoUri(res.assets[0]?.uri);
  };

  /**
   * Take a new photo with the camera.
   * We request permission here so its clear what the app needs and why.
   */
  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();

    if (!perm.granted) {
      Alert.alert("Camera permission needed", "Enable camera permission to take a photo.");
      return;
    }

    const res = await ImagePicker.launchCameraAsync({
      quality: 0.85
    });

    if (!res.canceled) setPhotoUri(res.assets[0]?.uri);
  };

  /**
   * Save review to local storage via the reviews hook.
   * Works for both create and edit (edit preserves createdAt).
   */
  const onSave = async () => {
    if (rating < 1 || rating > 5) {
      Alert.alert("Invalid rating", "Please select a rating between 1 and 5.");
      return;
    }

    const now = Date.now();

    const review: Review = {
      id: existing?.id ?? uid(),
      placeId: id,
      rating: rating as 1 | 2 | 3 | 4 | 5,
      text: text.trim(),
      photoUri,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now
    };

    await save(review);
    router.back();
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: c.background }}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl }}
    >
      <Stack.Screen options={{ headerTitle: "" }} />
      <Text style={{ color: c.text, fontSize: 26, fontWeight: "900" }}>
        {existing ? "Edit review" : "Add review"}
      </Text>

      <Text style={{ color: c.textMuted, marginTop: 6 }}>
        {place.name}
      </Text>

      <View
        style={{
          marginTop: spacing.lg,
          padding: spacing.lg,
          borderRadius: radius.xl,
          backgroundColor: c.card,
          borderWidth: 1,
          borderColor: c.border,
          ...cardShadow,
          gap: 12
        }}
      >
        <Text style={{ color: c.text, fontWeight: "900" }}>
          Rating
        </Text>

        <StarRow rating={rating} setRating={setRating} />

        <Text style={{ color: c.text, fontWeight: "900", marginTop: spacing.sm }}>
          Review
        </Text>

        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Write a short review…"
          placeholderTextColor={c.textMuted}
          multiline
          accessibilityLabel="Review text"
          style={{
            minHeight: 120,
            borderWidth: 1,
            borderColor: c.border,
            borderRadius: radius.lg,
            padding: spacing.md,
            color: c.text,
            // Theme based input background (clean in light & dark).
            backgroundColor: c.chipBg
          }}
        />

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          <Pressable
            onPress={takePhoto}
            accessibilityRole="button"
            style={{
              paddingVertical: 14,
              paddingHorizontal: 14,
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: c.border,
              backgroundColor: c.pillBg
            }}
          >
            <Text style={{ color: c.text, fontWeight: "900" }}>
              Take photo
            </Text>
          </Pressable>

          <Pressable
            onPress={pickFromLibrary}
            accessibilityRole="button"
            style={{
              paddingVertical: 14,
              paddingHorizontal: 14,
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: c.border,
              backgroundColor: c.pillBg
            }}
          >
            <Text style={{ color: c.text, fontWeight: "900" }}>
              Choose photo
            </Text>
          </Pressable>

          {photoUri ? (
            <Pressable
              onPress={() => setPhotoUri(undefined)}
              accessibilityRole="button"
              style={{
                paddingVertical: 14,
                paddingHorizontal: 14,
                borderRadius: radius.lg,
                borderWidth: 1,
                borderColor: c.border,
                backgroundColor: c.pillBg
              }}
            >
              <Text style={{ color: c.statusClosedBorder, fontWeight: "900" }}>
                Remove photo
              </Text>
            </Pressable>
          ) : null}
        </View>

        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={{ width: "100%", height: 240, borderRadius: radius.lg }}
            resizeMode="cover"
            accessibilityLabel="Selected review photo preview"
          />
        ) : null}

        <Pressable
          onPress={onSave}
          accessibilityRole="button"
          accessibilityLabel="Save review"
          style={{
            marginTop: spacing.sm,
            paddingVertical: 16,
            borderRadius: radius.lg,
            backgroundColor: c.accent,
            alignItems: "center",
            ...cardShadow
          }}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "900", fontSize: 16 }}>
            Save review
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
