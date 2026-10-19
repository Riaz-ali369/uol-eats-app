import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

type Ctx = {
  favourites: Set<string>;
  isFavourite: (id: string) => boolean;
  toggleFavourite: (id: string) => void;
  clearAllFavourites: () => Promise<void>;
  ready: boolean;
};

// Storage key is versioned so we can change format later if needed.
const KEY = "uol-eats:favourites:v1";

const FavouritesContext = createContext<Ctx | null>(null);

/**
 * Global favourites provider.
 * Stores favourites offline using AsyncStorage so they persist between app launches.
 */
export function FavouritesProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [favourites, setFavourites] = useState<Set<string>>(new Set());

  /**
   * Load favourites once on mount.
   * The alive flag prevents setState if the component unmounts mid load.
   */
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        const arr: string[] = raw ? JSON.parse(raw) : [];

        if (!alive) return;
        setFavourites(new Set(arr));
      } catch {
        // If storage is corrupted or missing  we just start empty.
      } finally {
        if (alive) setReady(true);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  /**
   * Persist favourites to storage.
   * Set -> Array because JSON cant store Sets directly.
   */
  const persist = async (next: Set<string>) => {
    try {
      await AsyncStorage.setItem(KEY, JSON.stringify(Array.from(next)));
    } catch {
      // Ignore storage write failures (app should still work without crashing).
    }
  };

  /**
   * Clears all saved favourites (used in Settings).
   */
  const clearAllFavourites = async () => {
    const empty = new Set<string>();
    setFavourites(empty);
    await persist(empty);
  };

  /**
   * Memoised context value so consumers dont rerender unnecessarily.
   * Also keeps the public API in one tidy place.
   */
  const value = useMemo<Ctx>(() => {
    return {
      favourites,
      ready,

      isFavourite: (id) => favourites.has(id),

      toggleFavourite: (id) => {
        setFavourites((prev) => {
          const next = new Set(prev);

          if (next.has(id)) next.delete(id);
          else next.add(id);

          // Persist in the background so the UI stays snappy.
          persist(next);

          return next;
        });
      },

      clearAllFavourites
    };
  }, [favourites, ready]);

  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
}

/**
 * Convenience hook for consuming favourites.
 * Throws early if someone forgets to wrap the app in the provider.
 */
export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error("useFavourites must be used within FavouritesProvider");
  return ctx;
}
