export type PlayerStatus = "loading" | "ready" | "error";

export type PlaybackMode = "native" | "mse" | "unsupported";

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  startAt?: number;
  onProgress?: (fraction: number) => void;
}