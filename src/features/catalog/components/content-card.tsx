import Image from "next/image";
import Link from "next/link";
import type { Title } from "@/modules/catalog";
import { formatScore } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export function ContentCard({ title }: { title: Title }) {
  return (
    <Link
      href={`/title/${title.id}`}
      className="group block overflow-hidden rounded-lg bg-surface-raised transition hover:bg-surface-hover"
    >
      <div className="relative aspect-poster overflow-hidden bg-white/5">
        <Image
          src={title.thumbnailUrl}
          alt={`${title.title} poster`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="absolute right-2 top-2 rounded bg-black/70 px-1.5 py-0.5 text-xs font-semibold text-amber-400">
          ★ {formatScore(title.score)}
        </span>
      </div>

      <div className="space-y-1.5 p-3">
        <h3 className="line-clamp-1 text-sm font-semibold text-neutral-100">
          {title.title}
        </h3>
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-400">
          <span>{title.year}</span>
          <span aria-hidden>·</span>
          <span>{title.category}</span>
          <Badge>{title.rating}</Badge>
        </div>
      </div>
    </Link>
  );
}