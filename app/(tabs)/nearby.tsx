import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PlaceCard from "../../src/components/PlaceCard";
import WeatherCard from "../../src/components/WeatherCard";
import { places } from "../../src/data/places";
import { useCurrentLocation } from "../../src/hooks/useCurrentLocation";
import { cardShadow, radius, spacing } from "../../src/theme/ui";
import { useAppColors } from "../../src/theme/useAppColors";
import { haversineMeters } from "../../src/utils/distance";
import { isOpenNow } from "../../src/utils/opening";

// Simple vibe tags used for filtering.
type Vibe = "quiet" | "social" | "study" | "quick" | "date";

// Sorting modes for the nearby list.
type SortMode = "distance" | "name" | "discount";

/**
 * Filter chip used for vibe and discount toggles.
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
          fontWeight: "800",
          color: selected ? c.chipSelectedText : c.text,
          fontSize: 12
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * Compact toggle used for primary on/off filters.
 */
function SmallToggle({
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
      hitSlop={10}
      style={{
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: selected ? c.accent : c.border,
        backgroundColor: selected ? c.chipSelectedBg : c.pillBg,
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Text
        style={{
          fontWeight: "900",
          color: selected ? c.chipSelectedText : c.text
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function sortLabel(mode: SortMode) {
  switch (mode) {
    case "distance":
      return "Sort: Distance";
    case "name":
      return "Sort: Name (A–Z)";
    case "discount":
      return "Sort: Discount first";
  }
}

function nextSort(mode: SortMode): SortMode {
  if (mode === "distance") return "name";
  if (mode === "name") return "discount";
  return "distance";
}

/**
 * Button that cycles through the available sort modes.
 */
function SortButton({
  mode,
  onPress
}: {
  mode: SortMode;
  onPress: () => void;
}) {
  const c = useAppColors();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Change sort order"
      accessibilityHint="Cycles between distance, name and discount first"
      hitSlop={8}
      style={{
        flex: 1,
        paddingVertical: 14,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: c.border,
        backgroundColor: c.pillBg,
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Text style={{ fontWeight: "900", color: c.text }}>
        {sortLabel(mode)}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: c.textMuted,
          marginTop: 2
        }}
      >
        Tap to change
      </Text>
    </Pressable>
  );
}

/**
 * Nearby screen: main discovery view with search, filters, sorting and weather.
 */
export default function NearbyScreen() {
  const router = useRouter();
  const c = useAppColors();
  const { state: locState, coords } = useCurrentLocation();

  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const [query, setQuery] = useState("");
  const [openNow, setOpenNow] = useState(false);
  const [discountOnly, setDiscountOnly] = useState(false);
  const [selectedVibe, setSelectedVibe] = useState<Vibe | "all">("all");
  const [sortMode, setSortMode] = useState<SortMode>("distance");

  /**
   * Builds the filtered + sorted list based on user input.
   */
  const data = useMemo(() => {
    const q = query.trim().toLowerCase();

    const base = places
      .map((p) => ({
        p,
        d: haversineMeters(coords.lat, coords.lon, p.lat, p.lon)
      }))
      .filter(({ p }) => {
        if (openNow && !isOpenNow(p.openingHours)) return false;
        if (discountOnly && !p.studentDiscount) return false;
        if (selectedVibe !== "all" && !p.vibes.includes(selectedVibe)) return false;

        if (!q) return true;

        return (
          p.name.toLowerCase().includes(q) ||
          p.areaLabel.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q)
        );
      });

    return [...base].sort((a, b) => {
      if (sortMode === "distance") return a.d - b.d;
      if (sortMode === "name") return a.p.name.localeCompare(b.p.name);

      if (sortMode === "discount") {
        const ad = a.p.studentDiscount ? 1 : 0;
        const bd = b.p.studentDiscount ? 1 : 0;
        if (ad !== bd) return bd - ad;
        return a.d - b.d;
      }

      return a.d - b.d;
    });
  }, [
    coords.lat,
    coords.lon,
    query,
    openNow,
    discountOnly,
    selectedVibe,
    sortMode
  ]);

  const clearFilters = () => {
    setSelectedVibe("all");
    setDiscountOnly(false);
    setOpenNow(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.p.id}
        renderItem={({ item }) => (
          <PlaceCard
            place={item.p}
            distanceMeters={item.d}
            onPress={() => router.push(`/place/${item.p.id}`)}
          />
        )}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: tabBarHeight + insets.bottom + spacing.xl
        }}
        ListHeaderComponentStyle={{ paddingBottom: spacing.lg }}
        ListHeaderComponent={
          <View style={{ paddingTop: spacing.sm }}>
            <WeatherCard
              lat={coords.lat}
              lon={coords.lon}
              locationState={locState as any}
            />

            <View
              style={{
                marginHorizontal: spacing.lg,
                marginTop: spacing.md,
                padding: spacing.lg,
                borderRadius: radius.xl,
                borderWidth: 1,
                borderColor: c.border,
                backgroundColor: c.card,
                ...cardShadow
              }}
            >
              {/* Search */}
              <View
                style={{
                  borderWidth: 1,
                  borderColor: c.border,
                  borderRadius: radius.lg,
                  backgroundColor: c.pillBg
                }}
              >
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search by name or area"
                  placeholderTextColor={c.textMuted}
                  accessibilityLabel="Search by name or area"
                  autoCorrect={false}
                  autoCapitalize="none"
                  style={{
                    paddingHorizontal: spacing.md,
                    paddingVertical: 12,
                    color: c.text,
                    fontWeight: "700"
                  }}
                />
              </View>

              {/* Sort + open now */}
              <View
                style={{
                  flexDirection: "row",
                  gap: spacing.sm,
                  marginTop: spacing.lg
                }}
              >
                <SortButton
                  mode={sortMode}
                  onPress={() => setSortMode((m) => nextSort(m))}
                />
                <SmallToggle
                  label="Open now"
                  selected={openNow}
                  onPress={() => setOpenNow((v) => !v)}
                />
              </View>

              {/* Chips */}
              <View
                style={{
                  marginTop: spacing.md,
                  flexDirection: "row",
                  flexWrap: "wrap"
                }}
              >
                <Chip label="Quiet" selected={selectedVibe === "quiet"} onPress={() => setSelectedVibe("quiet")} />
                <Chip label="Social" selected={selectedVibe === "social"} onPress={() => setSelectedVibe("social")} />
                <Chip label="Study" selected={selectedVibe === "study"} onPress={() => setSelectedVibe("study")} />
                <Chip label="Quick" selected={selectedVibe === "quick"} onPress={() => setSelectedVibe("quick")} />
                <Chip label="Date" selected={selectedVibe === "date"} onPress={() => setSelectedVibe("date")} />
                <Chip
                  label="Discount only"
                  selected={discountOnly}
                  onPress={() => setDiscountOnly((v) => !v)}
                />
              </View>

              {(selectedVibe !== "all" || discountOnly || openNow) && (
                <Pressable
                  onPress={clearFilters}
                  accessibilityRole="button"
                  style={{ marginTop: spacing.sm }}
                >
                  <Text style={{ color: c.textMuted, fontWeight: "800" }}>
                    Clear filters
                  </Text>
                </Pressable>
              )}
            </View>

            {locState?.status === "denied" && (
              <View
                style={{
                  paddingHorizontal: spacing.lg,
                  marginTop: spacing.sm
                }}
              >
                <Text style={{ color: c.textMuted }}>
                  Location permission denied — showing distances from Lincoln centre.
                </Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={{ padding: spacing.lg }}>
            <Text style={{ color: c.text, fontWeight: "900" }}>
              No results
            </Text>
            <Text style={{ color: c.textMuted }}>
              Try clearing filters or searching a different area.
            </Text>
          </View>
        }
      />
    </View>
  );
}
