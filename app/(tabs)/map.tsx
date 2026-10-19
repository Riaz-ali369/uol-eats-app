import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { places } from "../../src/data/places";
import { useCurrentLocation } from "../../src/hooks/useCurrentLocation";
import { cardShadow, radius, spacing } from "../../src/theme/ui";
import { useAppColors } from "../../src/theme/useAppColors";

/**
 * Map screen showing all places around Lincoln.
 * Provides a quick visual way to explore locations rather than scrolling a list.
 */
export default function MapScreen() {
  const c = useAppColors();
  const router = useRouter();
  const { coords, state: locState } = useCurrentLocation();

  /**
   * Initial map region is derived from the users current coordinates.
   * Memoised so the map doesnt recentre itself on every re render.
   */
  const initialRegion = useMemo(
    () => ({
      latitude: coords.lat,
      longitude: coords.lon,
      latitudeDelta: 0.03,
      longitudeDelta: 0.03
    }),
    [coords.lat, coords.lon]
  );

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <View
        style={{
          margin: spacing.lg,
          borderRadius: radius.xl,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: c.border,
          backgroundColor: c.card,
          ...cardShadow,
          flex: 1
        }}
      >
        <MapView
          style={{ flex: 1 }}
          initialRegion={initialRegion}
          accessibilityLabel="Map showing places in Lincoln"
        >
          {places.map((p) => (
            <Marker
              key={p.id}
              coordinate={{ latitude: p.lat, longitude: p.lon }}
              pinColor={c.accent}
              accessibilityLabel={`Open details for ${p.name}`}
              // Keep interaction simple: tapping a marker opens the place details screen.
              onPress={() => router.push(`/place/${p.id}`)}
            />
          ))}
        </MapView>
      </View>

      <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}>
        {/* Give a short explanation depending on whether location access is available */}
        {locState?.status === "denied" ? (
          <Text style={{ color: c.textMuted }}>
            Location permission denied — map is centred on Lincoln.
          </Text>
        ) : (
          <Text style={{ color: c.textMuted }}>
            Tap a marker to open place details.
          </Text>
        )}
      </View>
    </View>
  );
}
