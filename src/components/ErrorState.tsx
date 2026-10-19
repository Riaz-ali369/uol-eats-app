import React from "react";
import { Pressable, Text, View } from "react-native";

/**
 * Generic error state component.
 * Used to display a clear message and optional retry action when something fails.
 */
export default function ErrorState({
  title = "Something went wrong",
  message,
  onRetry
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <View style={{ padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>
        {title}
      </Text>

      {!!message && <Text>{message}</Text>}

      {/* Retry is optional so this component can be reused in different contexts */}
      {onRetry && (
        <Pressable
          accessibilityRole="button"
          onPress={onRetry}
          hitSlop={8}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 14,
            borderRadius: 12,
            borderWidth: 1,
            alignSelf: "flex-start"
          }}
        >
          <Text style={{ fontWeight: "700" }}>
            Retry
          </Text>
        </Pressable>
      )}
    </View>
  );
}
