import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { getCategories, getTitle, getTitles } from "./api";
import type { Filters, Title } from "./types";

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

export const useTitle = (id: string, initialData?: Title) =>
  useQuery({
    queryKey: ["title", id],
    queryFn: () => getTitle(id),
    initialData,
  });

export const useTitles = (filters: Filters) =>
  useInfiniteQuery({
    queryKey: ["titles", filters],
    queryFn: ({ pageParam }) => getTitles({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    placeholderData: keepPreviousData,
  });