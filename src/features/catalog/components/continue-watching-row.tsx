"use client";

import Image from "next/image";
import Link from "next/link";
import type {WatchEntry} from "@/lib/continue-watching";

interface ContinueWatchingRowProps {
  entries: WatchEntry[];
  onRemove: (id: string) => void;
}

const ContinueWatchingRow = ({
  entries,
  onRemove,
}: ContinueWatchingRowProps) => {
  if (entries.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-semibold">Continue watching</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {entries.map((entry) => (
          <div key={entry.id} className="relative w-40 shrink-0 sm:w-48">
            <Link
              href={`/title/${entry.id}`}
              className="group block overflow-hidden rounded-lg bg-surface-raised"
            >
              <div className="relative aspect-video bg-white/5">
                <Image
                  src={entry.thumbnailUrl}
                  alt={`${entry.title} thumbnail`}
                  fill
                  sizes="192px"
                  className="object-cover transition group-hover:scale-105"
                />
              </div>
              <div className="h-1 w-full bg-white/10">
                <div
                  className="h-full bg-brand"
                  style={{ width: `${Math.round(entry.progress * 100)}%` }}
                />
              </div>
              <p className="line-clamp-1 p-2 text-xs font-medium">
                {entry.title}
              </p>
            </Link>
            <button
              type="button"
              onClick={() => onRemove(entry.id)}
              aria-label={`Remove ${entry.title} from continue watching`}
              className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/70 text-xs text-white transition hover:bg-black"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ContinueWatchingRow;