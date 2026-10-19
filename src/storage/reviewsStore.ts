import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Review } from "../types/review";

const KEY = "uol-eats:reviews:v1";

type ReviewsByPlace = Record<string, Review[]>;

/**
 * Reads all stored reviews in one go.
 * Returns an empty object if storage is missing/corrupted.
 */
async function readAll(): Promise<ReviewsByPlace> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as ReviewsByPlace;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    // If JSON is invalid or storage fails, just treat it as empty.
    return {};
  }
}

/**
 * Writes the full reviews object back to storage.
 * Kept private so the module controls the data format.
 */
async function writeAll(data: ReviewsByPlace) {
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
}

/**
 * Lists reviews for a single place.
 */
export async function listReviews(placeId: string): Promise<Review[]> {
  const all = await readAll();
  return all[placeId] ?? [];
}

/**
 * Inserts a new review or updates an existing one by id.
 * New reviews go at the top so the newest content appears first.
 */
export async function upsertReview(
  placeId: string,
  review: Review
): Promise<void> {
  const all = await readAll();
  const current = all[placeId] ?? [];

  const idx = current.findIndex((r) => r.id === review.id);

  const next =
    idx >= 0
      ? current.map((r) => (r.id === review.id ? review : r))
      : [review, ...current];

  all[placeId] = next;
  await writeAll(all);
}

/**
 * Deletes a review by id for a given place.
 */
export async function deleteReview(
  placeId: string,
  reviewId: string
): Promise<void> {
  const all = await readAll();
  const current = all[placeId] ?? [];

  all[placeId] = current.filter((r) => r.id !== reviewId);
  await writeAll(all);
}

/**
 * Clears all stored reviews.
 * (Used for reset / settings style actions.)
 */
export async function clearAllReviews(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}

/**
 * Returns newest reviews across all places.
 * Used by the home screen recently reviewed section.
 */
export async function listRecentReviews(limit = 3): Promise<Review[]> {
  const all = await readAll();

  const flat = Object.values(all).flat();
  flat.sort(
    (a, b) =>
      (b.updatedAt ?? b.createdAt) - (a.updatedAt ?? a.createdAt)
  );

  return flat.slice(0, Math.max(0, limit));
}
