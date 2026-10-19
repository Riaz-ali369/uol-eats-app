import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { FlatList, Text, View } from "react-native";

import PlaceCard from "../../src/components/PlaceCard";
import { useFavourites } from "../../src/context/FavouritesContext";
import { places } from "../../src/data/places";
import { useCurrentLocation } from "../../src/hooks/useCurrentLocation";
import { spacing } from "../../src/theme/ui";
import { useAppColors } from "../../src/theme/useAppColors";
import { haversineMeters } from "../../src/utils/distance";

/**
 * Saved (favourites) screen.
 * Shows places the user has saved ordered by distance where location is available.
 */
export default function SavedScreen() {
  const router = useRouter();
  const colours = useAppColors();

  const { favourites, ready } = useFavourites();
  const { coords, state: locState } = useCurrentLocation();

  /**
   * Build the list of saved places once and memoise it.
   * This avoids recalculating distances on every render.
   */
  const data = useMemo(() => {
    const saved = places.filter((p) => favourites.has(p.id));

    return saved
      .map((p) => ({
        p,
        d: haversineMeters(coords.lat, coords.lon, p.lat, p.lon),
      }))
      .sort((a, b) => a.d - b.d);
  }, [favourites, coords.lat, coords.lon]);

  return (
    <View style={{ flex: 1, backgroundColor: colours.background }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.p.id}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        renderItem={({ item }) => (
          <PlaceCard
            place={item.p}
            distanceMeters={item.d}
            onPress={() => router.push(`/place/${item.p.id}`)}
          />
        )}
        ListHeaderComponent={
          <View
            style={{
              paddingHorizontal: spacing.lg,
              paddingTop: spacing.lg,
            }}
          >
            <Text style={{ color: colours.textMuted }}>
              Your favourites are stored offline on this device.
            </Text>

            {/* Give the user some context if precise distance data isnt available */}
            {locState?.status === "denied" ? (
              <Text
                style={{
                  color: colours.textMuted,
                  marginTop: 6,
                  fontSize: 12,
                }}
              >
                Location permission denied — distances are estimated from Lincoln centre.
              </Text>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <View
            style={{
              paddingHorizontal: spacing.lg,
              paddingTop: spacing.lg,
            }}
          >
            {/* Distinguish between initial load and genuinely having no saved items */}
            {!ready ? (
              <Text style={{ color: colours.textMuted }}>
                Loading saved places…
              </Text>
            ) : (
              <>
                <Text
                  style={{
                    color: colours.text,
                    fontWeight: "900",
                    fontSize: 16,
                  }}
                >
                  No saved places yet
                </Text>
                <Text
                  style={{
                    color: colours.textMuted,
                    marginTop: 6,
                    lineHeight: 20,
                  }}
                >
                  Tap ♡ on a place to save it. Your saved places will appear here.
                </Text>
              </>
            )}
          </View>
        }
      />
    </View>
  );
}
