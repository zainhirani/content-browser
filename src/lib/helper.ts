import Hls from "hls.js";
import type { PlaybackMode } from "@/types";

const NATIVE_HLS_MIME = "application/vnd.apple.mpegurl";

export const resolvePlaybackMode = (video: HTMLVideoElement): PlaybackMode => {
  if (video.canPlayType(NATIVE_HLS_MIME)) return "native";
  if (Hls.isSupported()) return "mse";
  return "unsupported";
};