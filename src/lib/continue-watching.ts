const STORAGE_KEY = "cb:continue-watching";

export interface WatchEntry {
  id: string;
  title: string;
  thumbnailUrl: string;
  progress: number;
  updatedAt: number;
}

export const loadContinueWatching = (): WatchEntry[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as WatchEntry[]) : [];
  } catch {
    return [];
  }
}

export const saveContinueWatching = (entries: WatchEntry[]): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    console.warn("Failed to save continue watching entries to localStorage");
  }
}