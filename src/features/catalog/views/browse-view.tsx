"use client";

import { useMemo, useState } from "react";
import type { Category } from "@/modules/catalog";
import { useTitles, useCategories } from "@/modules/catalog";
import {
  SearchBar,
  CategoryFilter,
  ContentGrid,
  ContentGridSkeleton,
  ContinueWatchingRow,
} from "../components";
import { Button, EmptyState, ErrorState } from "@/components/ui";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useContinueWatching } from "@/hooks/use-continue-watching";

const BrowseView = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const debouncedSearch = useDebouncedValue(search, 300);

  const filters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      category: category ?? undefined,
    }),
    [debouncedSearch, category],
  );

  const {data: titlesData, isLoading: isLoadingTitles, isError: isErrorTitles, refetch: refetchTitles, fetchNextPage: fetchNextPageTitles, hasNextPage: hasNextPageTitles, isFetchingNextPage: isFetchingNextPageTitles} = useTitles(filters);
  const {data: categoriesData} = useCategories();
  const { entries, remove } = useContinueWatching();

  const titles = titlesData?.pages.flatMap((page) => page.items) ?? [];
  const total = titlesData?.pages[0]?.total ?? 0;
  const isFiltering = Boolean(debouncedSearch || category);

  return (
    <div className="space-y-6">
      <ContinueWatchingRow entries={entries} onRemove={remove} />

      <div className="space-y-3">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryFilter
          categories={categoriesData ?? []}
          selected={category}
          onSelect={setCategory}
        />
      </div>

      {isLoadingTitles ? (
        <ContentGridSkeleton />
      ) : isErrorTitles ? (
        <ErrorState
          message="Couldn't load the catalog."
          onRetry={() => refetchTitles()}
        />
      ) : titles.length > 0 ? (
        <div className="space-y-6">
          <p className="text-sm text-neutral-500" aria-live="polite">
            Showing {titles.length} of {total}
          </p>

          <ContentGrid titles={titles} />

          {hasNextPageTitles && (
            <div className="flex justify-center">
              <Button
                variant="secondary"
                onClick={() => fetchNextPageTitles()}
                disabled={isFetchingNextPageTitles}
                className="px-6 py-2.5"
              >
                {isFetchingNextPageTitles ? "Loading…" : "Load more"}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          message={
            isFiltering
              ? "No titles match your search."
              : "No titles available."
          }
        />
      )}
    </div>
  );
}

export default BrowseView;