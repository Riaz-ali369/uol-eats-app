import React from "react";
import { Pressable, Text, View } from "react-native";

import { spacing } from "../theme/ui";
import { useAppColors } from "../theme/useAppColors";
import type { Category } from "../types";

export type Filters = {
  openNow: boolean;
  only24h: boolean;
  category: Category | "All";
};

/**
 * Small reusable chip button for filter toggles.
 * Uses accessibilityState so selected filters are announced properly.
 */
function Chip({
  label,
  selected,
  onPress
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const c = useAppColors();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      hitSlop={8}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: selected ? c.accent : c.border,
        backgroundColor: selected ? c.chipSelectedBg : c.chipBg,
        marginRight: spacing.sm,
        marginBottom: spacing.sm
      }}
    >
      <Text
        style={{
          fontWeight: selected ? "900" : "700",
          color: selected ? c.chipSelectedText : c.text
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * Filter chip group used by list screens.
 * Keeps the filter UI consistent and avoids duplicating chips across screens.
 */
export default function FilterChips({
  filters,
  setFilters
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
}) {
  // Categories are kept local to this component so the UI list is easy to tweak.
  const categories: (Category | "All")[] = [
    "All",
    "Cafe",
    "Fast Food",
    "Restaurant",
    "Pub",
    "Dessert"
  ];

  return (
    <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        <Chip
          label={filters.openNow ? "Open now ✓" : "Open now"}
          selected={filters.openNow}
          onPress={() =>
            setFilters({ ...filters, openNow: !filters.openNow })
          }
        />

        <Chip
          label={filters.only24h ? "24 hours ✓" : "24 hours"}
          selected={filters.only24h}
          onPress={() =>
            setFilters({ ...filters, only24h: !filters.only24h })
          }
        />
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {categories.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            selected={filters.category === cat}
            onPress={() =>
              setFilters({ ...filters, category: cat })
            }
          />
        ))}
      </View>
    </View>
  );
}
