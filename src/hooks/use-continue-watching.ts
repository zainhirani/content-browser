"use client";

import { useCallback, useEffect, useState } from "react";
import type { Title } from "@/modules/catalog";
import { loadContinueWatching, saveContinueWatching, WatchEntry } from "@/lib/continue-watching";

const MAX_ENTRIES = 12;

export const useContinueWatching = () => {
  const [entries, setEntries] = useState<WatchEntry[]>([]);

  useEffect(() => {
    setEntries(loadContinueWatching());
  }, []);

  const upsert = useCallback((title: Title, progress: number) => {
    setEntries((prev) => {
      const entry: WatchEntry = {
        id: title.id,
        title: title.title,
        thumbnailUrl: title.thumbnailUrl,
        progress: Math.min(Math.max(progress, 0), 1),
        updatedAt: Date.now(),
      };
      const next = [entry, ...prev.filter((e) => e.id !== title.id)].slice(
        0,
        MAX_ENTRIES,
      );
      saveContinueWatching(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id);
      saveContinueWatching(next);
      return next;
    });
  }, []);

  return { entries, upsert, remove };
}