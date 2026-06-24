export type Category =
  | "Action"
  | "Comedy"
  | "Drama"
  | "Documentary"
  | "Sci-Fi"
  | "Animation";

export interface Title {
  id: string;
  title: string;
  synopsis: string;
  category: Category;
  year: number;
  rating: string;
  score: number;
  durationMinutes: number;
  thumbnailUrl: string;
  backdropUrl: string;
  streamUrl: string;
}

export interface CatalogQuery {
  search?: string;
  category?: Category;
  page?: number;
  pageSize?: number;
}

export interface TitleListResult {
  items: Title[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export type Filters = Pick<CatalogQuery, "search" | "category">;