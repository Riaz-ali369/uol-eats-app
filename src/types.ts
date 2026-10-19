/**
 * High level place categories used for filtering and display.
 * Kept as a union so it stays consistent everywhere in the app.
 */
export type Category = "Cafe" | "Fast Food" | "Restaurant" | "Pub" | "Dessert";

/**
 * Opening hours model.
 * Supports either 24h venues or a weekly schedule (0 = Sunday ... 6 = Saturday).
 */
export type OpeningHours =
  | { type: "24h" }
  | {
      type: "weekly";
      // 0=Sun ... 6=Sat
      days: Record<number, { open: string; close: string }[]>;
    };

/**
 * Core place model used across the app lists, map, details, etc.
 */
export type Place = {
  id: string;
  name: string;
  category: Category;
  description: string;
  address: string;

  // Short area label shown in cards to keep the UI readable
  areaLabel: string;

  // Coordinates used for map markers + distance calculations
  lat: number;
  lon: number;

  openingHours: OpeningHours;

  // Simple price indicator used for quick comparison
  price: "£" | "££" | "£££";

  // Extra attributes used for filters and quick picks
  studentDiscount: boolean;
  vibes: ("quiet" | "social" | "study" | "quick" | "date")[];
};
