/**
 * Calculates the distance between two latitude/longitude points
 * using the Haversine formula.
 *
 * Returned value is in metres.
 */
export function haversineMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371000; // Radius of the Earth in metres

  const toRad = (d: number) => (d * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * Formats a distance in metres into a user friendly string.
 */
export function formatDistance(meters: number) {
  if (!Number.isFinite(meters)) return "—";

  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }

  return `${(meters / 1000).toFixed(meters < 5000 ? 1 : 0)} km`;
}
