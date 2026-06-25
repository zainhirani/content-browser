import { CATALOG } from "@/constants/catalog";
import type { Title } from "./types";

export const catalogRepository = {
  getAll(): readonly Title[] {
    return CATALOG;
  },

  findById(id: string): Title | null {
    return CATALOG.find((title) => title.id === id) ?? null;
  },
};