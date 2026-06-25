import type {
  CatalogQuery,
  Category,
  Title,
  TitleListResult,
} from "./types";
import { CATEGORIES } from "@/constants/constants";
import { catalogRepository } from "./repository";

export const DEFAULT_PAGE_SIZE = 8;

const matchesSearch = (title: Title, search: string): boolean => {
  return title.title.toLowerCase().includes(search.trim().toLowerCase());
}

const matchesCategory = (title: Title, category: Category): boolean => {
  return title.category === category;
}

const applyFilters = (query: CatalogQuery): Title[] => {
  const { search, category } = query;
  return catalogRepository.getAll().filter((title) => {
    if (search && !matchesSearch(title, search)) return false;
    if (category && !matchesCategory(title, category)) return false;
    return true;
  });
}

export const listTitles = (query: CatalogQuery = {}): TitleListResult => {
  const page = Math.max(1, Math.floor(query.page ?? 1));
  const pageSize = Math.max(1, Math.floor(query.pageSize ?? DEFAULT_PAGE_SIZE));

  const filtered = applyFilters(query);
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return {
    items,
    total,
    page,
    pageSize,
    hasMore: start + items.length < total,
  };
}

export const getTitleById = (id: string): Title | null => {
  return catalogRepository.findById(id);
}

export const getAllTitleIds = (): string[] => {
  return catalogRepository.getAll().map((title) => title.id);
}

export const listCategories = (): readonly Category[] => {
  return CATEGORIES;
}

export const parseCategory = (value: string | null): Category | undefined => {
  if (!value) return undefined;
  return (CATEGORIES as readonly string[]).includes(value)
    ? (value as Category)
    : undefined;
}

export const parsePositiveInt = (value: string | null): number | undefined => {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : undefined;
}