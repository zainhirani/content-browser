import api from "@/utils/axios";
import type { CatalogQuery, Category, Title, TitleListResult } from "./types";

export const getTitles = async (
  query: CatalogQuery = {},
): Promise<TitleListResult> => {
  const response = await api.get<TitleListResult>("/titles", { params: query });
  return response;
};

export const getTitle = async (id: string): Promise<Title> => {
  const response = await api.get<Title>(`/titles/${encodeURIComponent(id)}`);
  return response;
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<{ items: Category[] }>("/categories");
  return response.items;
};