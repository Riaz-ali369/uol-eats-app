import React from "react";
import { ScrollView, Text, View } from "react-native";

import { cardShadow, radius, spacing } from "../src/theme/ui";
import { useAppColors } from "../src/theme/useAppColors";

/**
 * Simple card wrapper used on the About screen.
 * Keeps layout consistent with the rest of the app.
 */
function Card({
  title,
  children
}: {
  title: string;
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
        gap: 8
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "900", color: c.text }}>
        {title}
      </Text>

      {children}
    </View>
  );
}

/**
 * About screen.
 * Summarises app features, accessibility considerations and data usage.
 */
export default function AboutScreen() {
  const c = useAppColors();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: c.background }}
      contentContainerStyle={{
        padding: spacing.lg,
        paddingBottom: spacing.xl
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: "900", color: c.text }}>
        About UoL Eats
      </Text>

      <Text
        style={{
          marginTop: 8,
          color: c.textMuted,
          lineHeight: 22
        }}
      >
        UoL Eats is a simple food discovery app for students in Lincoln. It helps
        users find nearby places to eat, view useful details and save favourites
        for later.
      </Text>

      {/* ---------- FEATURES ---------- */}
      <Card title="What the app does">
        <Text style={{ color: c.textMuted }}>
          • Shows food venues around Lincoln
        </Text>
        <Text style={{ color: c.textMuted }}>
          • Uses location to calculate distance
        </Text>
        <Text style={{ color: c.textMuted }}>
          • Displays venues on an interactive map
        </Text>
        <Text style={{ color: c.textMuted }}>
          • Lets users save favourite places
        </Text>
        <Text style={{ color: c.textMuted }}>
          • Allows users to add, edit and delete reviews
        </Text>
        <Text style={{ color: c.textMuted }}>
          • Supports adding photos to reviews using the camera
        </Text>
        <Text style={{ color: c.textMuted }}>
          • Works in both light and dark mode
        </Text>
      </Card>

      {/* ---------- ACCESSIBILITY ---------- */}
      <Card title="Accessibility & usability">
        <Text style={{ color: c.textMuted }}>
          • Clear navigation with visible active tabs
        </Text>
        <Text style={{ color: c.textMuted }}>
          • High contrast colours in light and dark mode
        </Text>
        <Text style={{ color: c.textMuted }}>
          • Large buttons and touch-friendly spacing
        </Text>
        <Text style={{ color: c.textMuted }}>
          • Clear loading, empty and error states
        </Text>
        <Text style={{ color: c.textMuted }}>
          • Simple layouts that are easy to understand
        </Text>
      </Card>

      {/* ---------- DATA ---------- */}
      <Card title="Data & privacy">
        <Text style={{ color: c.textMuted }}>
          • Location is only used to calculate distances
        </Text>
        <Text style={{ color: c.textMuted }}>
          • Saved places and reviews are stored on the device
        </Text>
        <Text style={{ color: c.textMuted }}>
          • Review photos are saved locally on the device
        </Text>
        <Text style={{ color: c.textMuted }}>
          • No user accounts or personal details are required
        </Text>
        <Text style={{ color: c.textMuted }}>
          • No personal data is shared with third parties
        </Text>
      </Card>
    </ScrollView>
  );
}
