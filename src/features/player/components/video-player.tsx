"use client";

import { useEffect, useRef } from "react";
import { useHlsPlayer } from "@/hooks/use-hls-player";
import type { VideoPlayerProps } from "@/types/player.types";
import { Spinner } from "@/components/ui/spinner";

/** Don't bother resuming a title that was effectively finished. */
const RESUME_MAX = 0.95;

/**
 * Presentational HLS video player. The playback lifecycle lives in
 * `useHlsPlayer`; this component renders the `<video>`, the loading/error
 * overlays driven by `status`, forwards playback progress to `onProgress`, and
 * resumes from `startAt` once metadata is ready.
 *
 * The loading overlay is opaque on purpose: a translucent one would let the
 * browser's own buffering indicator show through, so the user would see two
 * spinners at once.
 */
export function VideoPlayer({
  src,
  poster,
  startAt,
  onProgress,
}: Readonly<VideoPlayerProps>) {
  const { videoRef, status } = useHlsPlayer(src);

  // Keep the latest onProgress without re-subscribing on every render.
  const onProgressRef = useRef(onProgress);
  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  // Resume only once per mount, even though `startAt` may update as we save.
  const hasResumed = useRef(false);

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video || !onProgressRef.current) return;
    const { currentTime, duration } = video;
    if (!duration) return;
    onProgressRef.current(currentTime / duration);
  }

  // `loadedmetadata` guarantees `duration` is known, for both native and
  // hls.js playback, so it's the right moment to seek to the saved position.
  function handleLoadedMetadata() {
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
