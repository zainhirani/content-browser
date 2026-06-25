"use client";

import { useEffect, useRef } from "react";
import { useHlsPlayer } from "@/hooks/use-hls-player";
import type { VideoPlayerProps } from "@/types";
import { Spinner } from "@/components/ui";

const RESUME_MAX = 0.95;

const VideoPlayer = ({
  src,
  poster,
  startAt,
  onProgress,
}: Readonly<VideoPlayerProps>) => {
  const { videoRef, status } = useHlsPlayer(src);

  const onProgressRef = useRef(onProgress);
  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  const hasResumed = useRef(false);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !onProgressRef.current) return;
    const { currentTime, duration } = video;
    if (!duration) return;
    onProgressRef.current(currentTime / duration);
  }

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (hasResumed.current || !video?.duration) return;
    hasResumed.current = true;
    if (startAt && startAt > 0 && startAt < RESUME_MAX) {
      video.currentTime = startAt * video.duration;
    }
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
      <video
        ref={videoRef}
        poster={poster}
        controls
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        className="h-full w-full"
      />

      {status === "loading" && (
        <div className="absolute inset-0 grid place-items-center bg-black">
          <Spinner label="Loading video" />
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 grid place-items-center bg-black/80 px-6 text-center">
          <p className="text-sm text-neutral-300">
            This stream could not be played in your browser.
          </p>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;