import { useEffect, useState } from "react";

type WeatherState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; tempC: number; windKph: number; code: number }
  | { status: "error"; message: string };

/**
 * Fetches current weather data using the Open-Meteo API.
 * Designed to be optional and safe to disable when location
 * permission is not available.
 */
export function useWeather(
  lat: number,
  lon: number,
  options?: { enabled?: boolean }
) {
  const enabled = options?.enabled ?? true;

  const [state, setState] = useState<WeatherState>(
    enabled ? { status: "loading" } : { status: "idle" }
  );

  useEffect(() => {
    // If weather fetching is disabled stay idle and do nothing.
    if (!enabled) {
      setState({ status: "idle" });
      return;
    }

    // Guard against invalid or missing coordinates.
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      setState({
        status: "error",
        message: "Invalid location for weather."
      });
      return;
    }

    let alive = true;

    async function run() {
      try {
        setState({ status: "loading" });

        const url =
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${lat}&longitude=${lon}` +
          `&current=temperature_2m,weather_code,wind_speed_10m` +
          `&wind_speed_unit=kmh`;

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Weather request failed (${res.status})`);
        }

        const json = await res.json();
        const cur = json?.current;

        if (!cur) {
          throw new Error("Weather data unavailable.");
        }

        if (!alive) return;

        setState({
          status: "ready",
          tempC: Number(cur.temperature_2m),
          windKph: Number(cur.wind_speed_10m),
          code: Number(cur.weather_code)
        });
      } catch (e: any) {
        if (!alive) return;

        setState({
          status: "error",
          message: e?.message ?? "Failed to load weather."
        });
      }
    }

    run();

    // Prevent state updates if the component unmounts mid request.
    return () => {
      alive = false;
    };
  }, [lat, lon, enabled]);

  return state;
}
