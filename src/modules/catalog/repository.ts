import type { Title } from "./index";
import { CATALOG } from "@/constants/catalog";

export const catalogRepository = {
  getAll(): readonly Title[] {
    return CATALOG;
  },

  findById(id: string): Title | null {
    return CATALOG.find((title) => title.id === id) ?? null;
  },
};