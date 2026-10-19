import React from "react";
import { Text, View } from "react-native";

import { useWeather } from "../hooks/useWeather";
import { cardShadow, radius, spacing } from "../theme/ui";
import { useAppColors } from "../theme/useAppColors";

type LocationState =
  | { status: "idle" | "loading" }
  | { status: "ready"; lat: number; lon: number; accuracy?: number }
  | { status: "denied"; message: string }
  | { status: "error"; message: string };

/**
 * Converts Open-Meteo weather codes into simple user-friendly labels.
 * Kept short on purpose.
 */
function codeToText(code: number) {
  if ([0].includes(code)) return "Clear";
  if ([1, 2, 3].includes(code)) return "Partly cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 61, 63, 65].includes(code)) return "Rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Showers";
  if ([95, 96, 99].includes(code)) return "Thunder";
  return "Weather";
}

/**
 * Small pill used for compact weather metadata (e.g. wind, source).
 */
function SmallPill({ label }: { label: string }) {
  const c = useAppColors();

  return (
    <View
      style={{
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: c.border,
        backgroundColor: c.pillBg
      }}
    >
      <Text style={{ color: c.text, fontWeight: "800", fontSize: 12 }}>
        {label}
      </Text>
    </View>
  );
}

/**
 * Weather card (advanced feature).
 * Only shows near you weather if location permission is granted
 * otherwise it falls back to a simple Lincoln-based message.
 */
export default function WeatherCard({
  lat,
  lon,
  locationState
}: {
  lat: number;
  lon: number;
  locationState: LocationState;
}) {
  const c = useAppColors();

  // Only fetch near you weather if permission is granted.
  const shouldFetch = locationState.status === "ready";

  // Hook supports skipping fetch which avoids wasted requests and messy errors.
  const state = useWeather(lat, lon, { enabled: shouldFetch });

  const title = shouldFetch ? "Weather near you" : "Lincoln weather";

  return (
    <View
      style={{
        marginHorizontal: spacing.lg,
        marginTop: spacing.md,
        padding: spacing.lg,
        borderRadius: radius.xl,
        backgroundColor: c.card,
        borderWidth: 1,
        borderColor: c.border,
        ...cardShadow,
        gap: 6
      }}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={title}
    >
      <Text style={{ fontSize: 16, fontWeight: "900", color: c.text }}>
        {title}
      </Text>

      {/* Location messaging so users understand why it may not show local weather */}
      {locationState.status === "loading" && (
        <Text style={{ marginTop: spacing.sm, color: c.textMuted }}>
          Getting your location…
        </Text>
      )}

      {locationState.status === "denied" && (
        <Text style={{ marginTop: spacing.sm, color: c.textMuted }}>
          Enable location to show local weather.
        </Text>
      )}

      {locationState.status === "error" && (
        <Text style={{ marginTop: spacing.sm, color: c.textMuted }}>
          Location error: {locationState.message}
        </Text>
      )}

      {/* If we dont have permission dont show weather numbers */}
      {!shouldFetch ? (
        <Text style={{ marginTop: spacing.sm, color: c.textMuted, fontSize: 12 }}>
          Tip: You can change location permissions in your phone settings.
        </Text>
      ) : (
        <>
          {state.status === "idle" && (
            <Text style={{ marginTop: spacing.sm, color: c.textMuted }}>
              Weather paused.
            </Text>
          )}

          {state.status === "loading" && (
            <Text style={{ marginTop: spacing.sm, color: c.textMuted }}>
              Loading weather…
            </Text>
          )}

          {state.status === "error" && (
            <Text style={{ marginTop: spacing.sm, color: c.textMuted }}>
              Weather unavailable: {state.message}
            </Text>
          )}

          {state.status === "ready" && (
            <>
              <Text
                style={{
                  marginTop: spacing.sm,
                  fontSize: 28,
                  fontWeight: "900",
                  color: c.text
                }}
              >
                {Math.round(state.tempC)}°C
              </Text>

              <Text
                style={{
                  marginTop: 2,
                  fontSize: 18,
                  fontWeight: "800",
                  color: c.text
                }}
              >
                {codeToText(state.code)}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 8,
                  marginTop: spacing.sm
                }}
              >
                <SmallPill label={`Wind: ${Math.round(state.windKph)} km/h`} />
                <SmallPill label="Source: Open-Meteo" />
              </View>
            </>
          )}
        </>
      )}
    </View>
  );
}
