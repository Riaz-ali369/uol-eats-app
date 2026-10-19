import React from "react";
import { TextInput, View } from "react-native";

import { radius, spacing } from "../theme/ui";
import { useAppColors } from "../theme/useAppColors";

/**
 * Reusable search bar component.
 * Kept simple so it can be dropped into multiple list screens.
 */
export default function SearchBar({
  value,
  onChange
}: {
  value: string;
  onChange: (t: string) => void;
}) {
  const c = useAppColors();

  return (
    <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Search places…"
        placeholderTextColor={c.textMuted}
        accessibilityLabel="Search places"
        autoCorrect={false}
        autoCapitalize="none"
        style={{
          backgroundColor: c.card,
          borderColor: c.border,
          color: c.text,
          borderWidth: 1,
          borderRadius: radius.lg,
          paddingHorizontal: spacing.md,
          paddingVertical: 12,
          fontSize: 16
        }}
      />
    </View>
  );
}
