/**
 * Brand colours used across the app.
 * Kept separate so branding stays consistent.
 */
export const BRAND = {
  uolBlue: "#002147",
  white: "#FFFFFF"
};

/* =======================
   LIGHT MODE COLOURS
   ======================= */

export const lightColors = {
  /* Base surfaces */
  background: "#F6F8FC",
  card: BRAND.white,

  /* Text */
  text: "#0B1220",
  textMuted: "#4B5563",

  /* Borders / dividers */
  border: "#D7DCE5",

  /* Chips / filters */
  chipBg: "#EEF2F8",
  chipSelectedBg: BRAND.uolBlue,
  chipSelectedText: BRAND.white,

  /* Accent colour */
  accent: BRAND.uolBlue,

  /* =======================
     STATUS / BADGES (LIGHT)
     ======================= */

  statusOpenBg: "#D1FAE5",       // green-100
  statusOpenBorder: "#10B981",   // green-500
  statusOpenText: "#065F46",     // green-800

  statusClosedBg: "#FEE2E2",     // red-100
  statusClosedBorder: "#EF4444", // red-500
  statusClosedText: "#7F1D1D",   // red-900

  status24Bg: "#DBEAFE",         // blue-100
  status24Border: "#3B82F6",     // blue-500
  status24Text: "#1E3A8A",       // blue-900

  /* Neutral backgrounds for pills and chips */
  pillBg: "rgba(16,24,40,0.04)"
};

/* =======================
   DARK MODE COLOURS
   ======================= */

export const darkColors = {
  /* Base surfaces */
  background: "#0B1220",
  card: "#111A2C",

  /* Text */
  text: "#F3F6FF",
  textMuted: "#B7C0D6",

  /* Borders / dividers */
  border: "#22304D",

  /* Chips / filters */
  chipBg: "#16223A",
  chipSelectedBg: BRAND.uolBlue,
  chipSelectedText: BRAND.white,

  /* Accent colour */
  accent: BRAND.uolBlue,

  /* =======================
     STATUS / BADGES (DARK)
     ======================= */

  statusOpenBg: "rgba(16,185,129,0.22)",
  statusOpenBorder: "rgba(16,185,129,0.55)",
  statusOpenText: "#A7F3D0",

  statusClosedBg: "rgba(239,68,68,0.22)",
  statusClosedBorder: "rgba(239,68,68,0.55)",
  statusClosedText: "#FECACA",

  status24Bg: "rgba(59,130,246,0.22)",
  status24Border: "rgba(59,130,246,0.55)",
  status24Text: "#BFDBFE",

  /* Neutral backgrounds for pills and chips */
  pillBg: "rgba(255,255,255,0.06)"
};

/**
 * Shared colour type used throughout the app.
 * Ensures light and dark themes stay in sync.
 */
export type AppColors = typeof lightColors;
