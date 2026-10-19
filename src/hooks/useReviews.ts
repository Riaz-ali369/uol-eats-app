import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";

import {
  deleteReview,
  listReviews,
  upsertReview
} from "../storage/reviewsStore";
import type { Review } from "../types/review";

type State =
  | { status: "loading"; reviews: Review[] }
  | { status: "ready"; reviews: Review[] }
  | { status: "error"; reviews: Review[]; message: string };

/**
 * Reviews hook scoped to a specific place.
 * Handles loading, saving, deleting and refreshing review data.
 */
export function useReviews(placeId: string) {
  const [state, setState] = useState<State>({
    status: "loading",
    reviews: []
  });

  /**
   * Load reviews from storage.
   * Wrapped in useCallback so it can be reused safely in effects.
   */
  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, status: "loading" }));

    try {
      const reviews = await listReviews(placeId);
      setState({ status: "ready", reviews });
    } catch (e: any) {
      setState({
        status: "error",
        reviews: [],
        message: String(e?.message ?? "Failed to load reviews")
      });
    }
  }, [placeId]);

  /**
   * Initial load when the hook mounts or placeId changes.
   */
  useEffect(() => {
    refresh();
  }, [refresh]);

  /**
   * Refresh again whenever the screen regains focus.
   * This keeps the list up to date after navigating back from edit screens.
   */
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  /**
   * Save or update a review then reload the list.
   */
  const save = useCallback(
    async (review: Review) => {
      await upsertReview(placeId, review);
      await refresh();
    },
    [placeId, refresh]
  );

  /**
   * Delete a review then reload the list.
   */
  const remove = useCallback(
    async (reviewId: string) => {
      await deleteReview(placeId, reviewId);
      await refresh();
    },
    [placeId, refresh]
  );

  return { state, refresh, save, remove };
}
