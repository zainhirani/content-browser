import type { ReactNode } from "react";
import type { Title } from "@/modules/catalog";
import { ContentCard } from "./content-card";

function Grid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-4">
      {children}
    </div>
  );
}

export function ContentGrid({ titles }: { titles: Title[] }) {
  return (
    <Grid>
      {titles.map((title) => (
        <ContentCard key={title.id} title={title} />
      ))}
    </Grid>
  );
}

export function ContentGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <Grid>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-lg bg-surface-raised">
          <div className="aspect-poster animate-pulse bg-white/5" />
          <div className="space-y-2 p-3">
            <div className="h-3.5 w-3/4 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-white/5" />
          </div>
        </div>
      ))}
    </Grid>
  );
}