/**
 * Review model used throughout the app.
 * Stored locally and linked to a specific place.
 */
export type Review = {
  id: string;              // Unique identifier for the review
  placeId: string;         // ID of the place this review belongs to
  rating: 1 | 2 | 3 | 4 | 5; // Star rating (restricted to valid values)
  text: string;            // Optional written review text
  photoUri?: string;       // Optional photo stored locally on the device
  createdAt: number;       // Creation timestamp
  updatedAt: number;       // Last updated timestamp 
};
