import type { OpeningHours } from "../types";

/**
 * Converts a HH:MM string to minutes since midnight.
 */
function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/**
 * Converts minutes since midnight back into HH:MM (24-hour format).
 */
function minutesToHHMM(mins: number) {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${pad2(h)}:${pad2(m)}`;
}

function nowMinutes(now: Date) {
  return now.getHours() * 60 + now.getMinutes();
}

/**
 * If a slot closes at "00:00" treat it as end-of-day (24:00).
 * This stops venues that close at midnight appearing as if they close instantly.
 */
function normalizeClose(close: string) {
  const c = toMinutes(close);
  return c === 0 ? 24 * 60 : c;
}

/**
 * Returns true if the venue is currently open.
 * Handles both 24h venues and standard weekly opening hours.
 */
export function isOpenNow(openingHours: OpeningHours, now = new Date()) {
  if (openingHours.type === "24h") return true;

  const day = now.getDay(); // 0..6 (Sun..Sat)
  const slots = openingHours.days[day] ?? [];
  const n = nowMinutes(now);

  for (const slot of slots) {
    const open = toMinutes(slot.open);
    const close = normalizeClose(slot.close);

    if (n >= open && n < close) return true;
  }

  return false;
}

/**
 * Returns a simple string describing todays opening hours.
 * Used for the details screen and anywhere that needs a quick summary.
 */
export function todaysHours(openingHours: OpeningHours, now = new Date()) {
  if (openingHours.type === "24h") return "24h";

  const day = now.getDay();
  const slots = openingHours.days[day] ?? [];

  if (!slots.length) return "Closed today";

  return slots.map((s) => `${s.open}–${s.close}`).join(", ");
}

/**
 * Smart status string for UI:
 * - "Open 24 hours"
 * - "Open now · Closes in 45 min"
 * - "Open now · Closes at 23:00"
 * - "Closed · Opens at 10:00"
 * - "Closed today"
 */
export function smartOpeningStatus(openingHours: OpeningHours, now = new Date()) {
  if (openingHours.type === "24h") return "Open 24 hours";

  const day = now.getDay();
  const slots = openingHours.days[day] ?? [];

  if (!slots.length) return "Closed today";

  const n = nowMinutes(now);

  // If we're currently open show time remaining / closing time.
  for (const slot of slots) {
    const open = toMinutes(slot.open);
    const close = normalizeClose(slot.close);

    if (n >= open && n < close) {
      const remaining = close - n;

      // "Closes in ..." feels nicer when the closing time is soon.
      if (remaining <= 90) {
        if (remaining <= 1) return "Open now · Closes in 1 min";
        return `Open now · Closes in ${remaining} min`;
      }

      return `Open now · Closes at ${minutesToHHMM(close)}`;
    }
  }

  // Not open right now -> find the next opening slot later today.
  const next = slots
    .map((s) => ({
      open: toMinutes(s.open),
      close: normalizeClose(s.close)
    }))
    .filter((s) => s.open > n)
    .sort((a, b) => a.open - b.open)[0];

  if (next) return `Closed · Opens at ${minutesToHHMM(next.open)}`;

  // No more openings today.
  return "Closed · Opens another day";
}
