import * as Location from "expo-location";
import { useEffect, useMemo, useState } from "react";

type State =
  | { status: "idle" | "loading" }
  | { status: "ready"; lat: number; lon: number; accuracy?: number }
  | { status: "denied"; message: string }
  | { status: "error"; message: string };

// Fixed fallback so distance calculations always work,
// even when location permission is denied.
const LINCOLN_CENTER = { lat: 53.2307, lon: -0.5406 };

export function useCurrentLocation() {
  const [state, setState] = useState<State>({ status: "idle" });

  useEffect(() => {
    let mounted = true;

    async function run() {
      try {
        setState({ status: "loading" });

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (!mounted) return;

        if (status !== "granted") {
          setState({
            status: "denied",
            message:
              "Location permission denied. Distances will use Lincoln city centre as a fallback."
          });
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced
        });

        if (!mounted) return;

        setState({
          status: "ready",
          lat: loc.coords.latitude,
          lon: loc.coords.longitude,
          accuracy: loc.coords.accuracy ?? undefined
        });
      } catch (e: any) {
        if (!mounted) return;

        setState({
          status: "error",
          message: e?.message ?? "Failed to get location."
        });
      }
    }

    run();

    // Prevent state updates if the component unmounts mid request.
    return () => {
      mounted = false;
    };
  }, []);

  // Memoised fallback so the object reference stays stable.
  const fallback = useMemo(() => LINCOLN_CENTER, []);

  /**
   * coords is ALWAYS defined.
   * Screens dont need to handle undefined or null coordinates.
   */
  const coords =
    state.status === "ready"
      ? { lat: state.lat, lon: state.lon }
      : fallback;

  return { state, coords };
}
