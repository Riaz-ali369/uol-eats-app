import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

/**
 * Generic loading indicator.
 * Used anywhere the app needs to show a short loading state.
 */
export default function Loading({
  label = "Loading…"
}: {
  label?: string;
}) {
  return (
    <View
      style={{
        padding: 16,
        alignItems: "center",
        gap: 10
      }}
    >
      <ActivityIndicator />
      <Text accessibilityRole="text">
        {label}
      </Text>
    </View>
  );
}
