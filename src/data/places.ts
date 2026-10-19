import type { Place } from "../types";

/**
 * Helper for creating weekly opening hours.
 * Keeps the data readable and avoids repeating the same structure everywhere.
 */
const weekly = (
  days: Record<number, { open: string; close: string }[]>
): Place["openingHours"] => ({
  type: "weekly",
  days
});

/**
 * Static place dataset for the app.
 * In a real world app this would come from an API,
 * but for this project i kept to local and predictable to show what it would look like.
 */

export const places: Place[] = [
  {
    id: "jews-house",
    name: "The Jews House Restaurant",
    category: "Restaurant",
    price: "£££",
    areaLabel: "Cathedral Quarter",
    address: "15 The Strait, Lincoln, LN2 1JD",
    lat: 53.2323,
    lon: -0.5387,
    studentDiscount: false,
    vibes: ["date", "quiet"],
    description: "Historic restaurant in the Cathedral Quarter.",
    openingHours: weekly({
      0: [],
      1: [],
      2: [],
      3: [{ open: "18:30", close: "23:30" }],
      4: [{ open: "18:30", close: "23:30" }],
      5: [{ open: "18:30", close: "23:30" }],
      6: [{ open: "18:30", close: "23:30" }]
    })
  },
  {
    id: "wig-and-mitre",
    name: "Wig & Mitre",
    category: "Pub",
    price: "££",
    areaLabel: "Steep Hill",
    address: "32 Steep Hill, Lincoln, LN2 1LU",
    lat: 53.2342,
    lon: -0.5388,
    studentDiscount: false,
    vibes: ["social", "date"],
    description: "Cosy pub and food stop on Steep Hill.",
    openingHours: weekly({
      0: [{ open: "08:30", close: "23:00" }],
      1: [{ open: "08:30", close: "23:00" }],
      2: [{ open: "08:30", close: "23:00" }],
      3: [{ open: "08:30", close: "23:00" }],
      4: [{ open: "08:30", close: "23:00" }],
      5: [{ open: "08:30", close: "00:00" }],
      6: [{ open: "08:30", close: "00:00" }]
    })
  },
  {
    id: "bells-tea-shop",
    name: "Bells Tea Shop",
    category: "Cafe",
    price: "££",
    areaLabel: "Steep Hill",
    address: "39 Steep Hill, Lincoln, LN2 1LU",
    lat: 53.2340,
    lon: -0.5387,
    studentDiscount: false,
    vibes: ["quiet", "study"],
    description: "Tea room — good for cake, tea, and a quiet break.",
    openingHours: weekly({
      0: [{ open: "08:30", close: "16:30" }],
      1: [{ open: "08:30", close: "16:30" }],
      2: [{ open: "08:30", close: "16:30" }],
      3: [{ open: "08:30", close: "16:30" }],
      4: [{ open: "08:30", close: "16:30" }],
      5: [{ open: "08:30", close: "16:30" }],
      6: [{ open: "08:30", close: "17:30" }]
    })
  },
  {
    id: "magna-carta",
    name: "The Magna Carta",
    category: "Pub",
    price: "££",
    areaLabel: "Castle Square",
    address: "1 Exchequer Gate, Lincoln, LN2 1PZ",
    lat: 53.2344,
    lon: -0.5383,
    studentDiscount: false,
    vibes: ["social", "quick"],
    description: "Popular pub by Castle Square for relaxed meals and drinks.",
    openingHours: weekly({
      0: [{ open: "11:00", close: "23:30" }],
      1: [{ open: "11:00", close: "23:30" }],
      2: [{ open: "11:00", close: "23:30" }],
      3: [{ open: "11:00", close: "23:30" }],
      4: [{ open: "11:00", close: "23:30" }],
      5: [{ open: "11:00", close: "23:30" }],
      6: [{ open: "11:00", close: "23:30" }]
    })
  },
  {
    id: "cafe-zoot",
    name: "Cafe Zoot",
    category: "Cafe",
    price: "££",
    areaLabel: "Bailgate",
    address: "5 Bailgate, Lincoln, LN1 3AE",
    lat: 53.2352,
    lon: -0.5383,
    studentDiscount: false,
    vibes: ["quiet", "study"],
    description: "Coffee and brunch uphill — calm place to sit.",
    openingHours: weekly({
      0: [{ open: "09:00", close: "22:00" }],
      1: [{ open: "09:00", close: "22:00" }],
      2: [{ open: "09:00", close: "22:00" }],
      3: [{ open: "09:00", close: "22:00" }],
      4: [{ open: "09:00", close: "22:00" }],
      5: [{ open: "09:00", close: "22:00" }],
      6: [{ open: "09:00", close: "22:00" }]
    })
  },
  {
    id: "stokes-high-bridge",
    name: "Stokes High Bridge Cafe",
    category: "Cafe",
    price: "££",
    areaLabel: "High Street",
    address: "207-209 High Street, Lincoln, LN5 7AU",
    lat: 53.2286,
    lon: -0.5408,
    studentDiscount: false,
    vibes: ["quiet", "study"],
    description: "Classic Lincoln cafe in town — lunch, cakes and coffee.",
    openingHours: weekly({
      0: [{ open: "10:00", close: "16:00" }],
      1: [{ open: "09:00", close: "17:00" }],
      2: [{ open: "09:00", close: "17:00" }],
      3: [{ open: "09:00", close: "17:00" }],
      4: [{ open: "09:00", close: "17:00" }],
      5: [{ open: "09:00", close: "17:00" }],
      6: [{ open: "08:30", close: "17:00" }]
    })
  },
  {
    id: "200-degrees",
    name: "200 Degrees Coffee",
    category: "Cafe",
    price: "££",
    areaLabel: "City Centre",
    address: "35 Sincil Street, Lincoln, LN5 7ET",
    lat: 53.2276,
    lon: -0.5387,
    studentDiscount: false,
    vibes: ["quick", "study"],
    description: "Specialty coffee — good for a quick caffeine stop.",
    openingHours: weekly({
      0: [{ open: "09:00", close: "17:00" }],
      1: [{ open: "07:30", close: "18:00" }],
      2: [{ open: "07:30", close: "18:00" }],
      3: [{ open: "07:30", close: "18:00" }],
      4: [{ open: "07:30", close: "18:00" }],
      5: [{ open: "07:30", close: "18:00" }],
      6: [{ open: "07:30", close: "18:00" }]
    })
  },
  {
    id: "cosy-club",
    name: "Cosy Club",
    category: "Restaurant",
    price: "££",
    areaLabel: "Cornhill Quarter",
    address: "Corn Exchange, Lincoln, LN5 7HE",
    lat: 53.4254,
    lon: -0.5185,
    studentDiscount: false,
    vibes: ["social", "date"],
    description: "All-day dining and drinks in a stylish setting.",
    openingHours: weekly({
      0: [{ open: "09:00", close: "23:00" }],
      1: [{ open: "09:00", close: "23:00" }],
      2: [{ open: "09:00", close: "23:00" }],
      3: [{ open: "09:00", close: "23:00" }],
      4: [{ open: "09:00", close: "00:00" }],
      5: [{ open: "09:00", close: "01:00" }],
      6: [{ open: "09:00", close: "01:00" }]
    })
  },
  {
    id: "turtle-bay",
    name: "Turtle Bay (Lincoln)",
    category: "Restaurant",
    price: "££",
    areaLabel: "City Centre",
    address: "Central Market, Sincil St, Lincoln, LN5 7ET",
    lat: 53.2279,
    lon: -0.5387,
    studentDiscount: false,
    vibes: ["social", "date"],
    description: "Caribbean-inspired food and cocktails — lively atmosphere.",
    openingHours: weekly({
      0: [{ open: "10:00", close: "22:30" }],
      1: [{ open: "12:00", close: "22:30" }],
      2: [{ open: "12:00", close: "22:30" }],
      3: [{ open: "12:00", close: "22:30" }],
      4: [{ open: "12:00", close: "22:30" }],
      5: [{ open: "12:00", close: "22:30" }],
      6: [{ open: "10:00", close: "22:30" }]
    })
  },
  {
    id: "wagamama-brayford",
    name: "Wagamama (Brayford Wharf)",
    category: "Restaurant",
    price: "££",
    areaLabel: "Brayford Waterfront",
    address: "Brayford Wharf North, Lincoln, LN1 1YX",
    lat: 53.2288,
    lon: -0.5444,
    studentDiscount: false,
    vibes: ["social", "quick"],
    description: "Noodles and bowls — popular quick sit-down option by the waterfront.",
    openingHours: weekly({
      0: [{ open: "11:00", close: "22:00" }],
      1: [{ open: "11:00", close: "22:00" }],
      2: [{ open: "11:00", close: "22:00" }],
      3: [{ open: "11:00", close: "22:00" }],
      4: [{ open: "11:00", close: "22:00" }],
      5: [{ open: "11:00", close: "23:00" }],
      6: [{ open: "11:00", close: "23:00" }]
    })
  },
  {
    id: "nandos-brayford",
    name: "Nando's (Brayford Wharf)",
    category: "Restaurant",
    price: "££",
    areaLabel: "Brayford Waterfront",
    address: "Brayford Wharf North, Lincoln, LN1 1YX",
    lat: 53.2294,
    lon: -0.5449,
    studentDiscount: false,
    vibes: ["quick", "social"],
    description: "Quick and easy sit-down choice by the waterfront.",
    openingHours: weekly({
      0: [{ open: "11:00", close: "22:00" }],
      1: [{ open: "11:00", close: "22:00" }],
      2: [{ open: "11:00", close: "22:00" }],
      3: [{ open: "11:00", close: "22:00" }],
      4: [{ open: "11:00", close: "22:00" }],
      5: [{ open: "11:00", close: "23:00" }],
      6: [{ open: "11:00", close: "23:00" }]
    })
  },
  {
    id: "mcdonalds-Ruston-Way",
    name: "McDonald's (Ruston Way)",
    category: "Fast Food",
    price: "£",
    areaLabel: "Ruston Way",
    address: "Ruston Way, Lincoln, LN6 7FS",
    lat: 53.2270,
    lon: -0.5505,
    studentDiscount: false,
    vibes: ["quick"],
    description: "Fast food option — useful late or when you need something quick.",
    openingHours: { type: "24h" }
  },
  {
    id: "dominos-lincoln",
    name: "Domino's Pizza (Lincoln)",
    category: "Fast Food",
    price: "££",
    areaLabel: "High St",
    address: "410 High St, Lincoln, LN5 7TE",
    lat: 53.2200,
    lon: -0.5445,
    studentDiscount: true,
    vibes: ["quick", "social"],
    description: "Pizza option — good for quick food (often student deals).",
    openingHours: weekly({
      0: [{ open: "11:30", close: "22:45" }],
      1: [{ open: "11:30", close: "22:45" }],
      2: [{ open: "11:30", close: "22:45" }],
      3: [{ open: "11:30", close: "22:45" }],
      4: [{ open: "11:30", close: "22:45" }],
      5: [{ open: "11:30", close: "22:45" }],
      6: [{ open: "11:30", close: "22:45" }]
    })
  },
  {
    id: "caffe-portico",
    name: "Caffe Portico",
    category: "Cafe",
    price: "££",
    areaLabel: "The Terrace",
    address: "The Terrace, Grantham St, Lincoln, LN2 1BD",
    lat: 53.2318,
    lon: -0.5378,
    studentDiscount: false,
    vibes: ["quiet", "study"],
    description: "Cafe with a calm atmosphere — good for coffee and a quiet sit.",
    openingHours: weekly({
      0: [],
      1: [{ open: "09:00", close: "16:00" }],
      2: [{ open: "09:00", close: "16:00" }],
      3: [{ open: "09:00", close: "16:00" }],
      4: [{ open: "09:00", close: "21:30" }],
      5: [{ open: "09:00", close: "21:30" }],
      6: [{ open: "09:00", close: "21:30" }]
    })
  },
  {
    id: "kaspas-desserts",
    name: "Kaspa's Desserts (Lincoln)",
    category: "Dessert",
    price: "££",
    areaLabel: "Clasketgate",
    address: "45 Clasketgate, Lincoln, LN2 1LA",
    lat: 53.2209,
    lon: -0.5376,
    studentDiscount: false,
    vibes: ["social", "date"],
    description: "Desserts and sweet treats — good for after dinner or a casual meet-up.",
    openingHours: weekly({
      0: [{ open: "12:00", close: "23:00" }],
      1: [{ open: "12:00", close: "23:00" }],
      2: [{ open: "12:00", close: "23:00" }],
      3: [{ open: "12:00", close: "23:00" }],
      4: [{ open: "12:00", close: "23:00" }],
      5: [{ open: "12:00", close: "23:00" }],
      6: [{ open: "11:00", close: "23:00" }]
    })
  }
];
