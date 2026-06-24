"use client";

import Link from "next/link";
import { useCallback, useRef } from "react";
import type { Title } from "@/modules/catalog";
import { useTitle } from "@/modules/catalog";
import { useContinueWatching } from "@/hooks/use-continue-watching";
import { VideoPlayer } from "@/features/player/components/video-player";
import { Badge } from "@/components/ui/badge";
import { formatRuntime, formatScore } from "@/lib/format";

export function TitleDetailView({
  title: initialTitle,
}: Readonly<{ title: Title }>) {
  const { data: title } = useTitle(initialTitle.id, initialTitle);
  const { entries, upsert } = useContinueWatching();

  const savedProgress = entries.find(
    (entry) => entry.id === initialTitle.id,
  )?.progress;

  const lastSavedAt = useRef(0);
  const handleProgress = useCallback(
    (fraction: number) => {
      const now = Date.now();
      if (now - lastSavedAt.current < 5000) return;
      lastSavedAt.current = now;
      upsert(initialTitle, fraction);
    },
    [initialTitle, upsert],
  );

  const data = title ?? initialTitle;

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-neutral-400 transition hover:text-neutral-100"
      >
        ← Back to browse
      </Link>

      <VideoPlayer
        src={data.streamUrl}
        poster={data.backdropUrl}
        startAt={savedProgress}
        onProgress={handleProgress}
      />

      <div className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {data.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-400">
          <span className="font-semibold text-amber-400">
            ★ {formatScore(data.score)}
          </span>
          <span aria-hidden>·</span>
          <span>{data.year}</span>
          <span aria-hidden>·</span>
          <span>{formatRuntime(data.durationMinutes)}</span>
          <Badge>{data.rating}</Badge>
          <Badge>{data.category}</Badge>
        </div>

        <p className="max-w-2xl leading-relaxed text-neutral-300">
          {data.synopsis}
        </p>
      </div>
    </div>
  );
}