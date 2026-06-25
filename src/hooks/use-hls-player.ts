"use client";

import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";
import { resolvePlaybackMode } from "@/lib/helper";
import type { PlayerStatus } from "@/types";

export const useHlsPlayer = (src: string) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<PlayerStatus>("loading");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setStatus("loading");
    let hls: Hls | null = null;

    const onReady = () => setStatus("ready");
    const mode = resolvePlaybackMode(video);

    if (mode === "native") {
      video.src = src;
      video.addEventListener("loadedmetadata", onReady);
    } else if (mode === "mse") {
      hls = new Hls({ enableWorker: true });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, onReady);
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) setStatus("error");
      });
    } else {
      setStatus("error");
    }

    return () => {
      video.removeEventListener("loadedmetadata", onReady);
      hls?.destroy();
    };
  }, [src]);

  return { videoRef, status };
}