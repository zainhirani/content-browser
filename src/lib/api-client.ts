import type {
  CatalogQuery,
  Category,
  Title,
  TitleListResult,
} from "@/modules/catalog";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new ApiError(`Request failed: ${url}`, res.status);
  }
  return res.json() as Promise<T>;
}

export async function fetchTitles(
  query: CatalogQuery = {},
): Promise<TitleListResult> {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.category) params.set("category", query.category);
  if (query.page) params.set("page", String(query.page));
  if (query.pageSize) params.set("pageSize", String(query.pageSize));

  const qs = params.toString();
  const suffix = qs ? `?${qs}` : "";
  return getJson<TitleListResult>(`/api/titles${suffix}`);
}

export async function fetchTitle(id: string): Promise<Title> {
  return getJson<Title>(`/api/titles/${encodeURIComponent(id)}`);
}

export async function fetchCategories(): Promise<Category[]> {
  const data = await getJson<{ items: Category[] }>("/api/categories");
  return data.items;
}