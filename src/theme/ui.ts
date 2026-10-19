import { Platform } from "react-native";

/**
 * Spacing scale used across the app.
 * Keeps margins and padding consistent between screens.
 */
export const spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24
};

/**
 * Border radius scale.
 * Matches the spacing values so the UI feels balanced.
 */
export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24
};

/**
 * Common text styles.
 * Used for headings, metadata, and body text.
 */
export const text = {
  title: {
    fontSize: 18,
    fontWeight: "900" as const
  },
  meta: {
    fontSize: 13
  },
  body: {
    fontSize: 15
  }
};

/**
 * Card style shadow.
 * Uses native shadows on iOS and elevation on Android.
 */
export const cardShadow =
  Platform.OS === "ios"
    ? {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 }
      }
    : {
        elevation: 3
      };
