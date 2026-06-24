import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchTitle, fetchTitles } from "@/lib/api-client";
import { Filters, Title } from "./types";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
}

export function useTitle(id: string, initialData?: Title) {
  return useQuery({
    queryKey: ["title", id],
    queryFn: () => fetchTitle(id),
    initialData,
  });
}


export function useTitles(filters: Filters) {
  return useInfiniteQuery({
    queryKey: ["titles", filters],
    queryFn: ({ pageParam }) => fetchTitles({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    placeholderData: keepPreviousData,
  });
}