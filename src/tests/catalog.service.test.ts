import { describe, expect, it } from "vitest";
import {
  DEFAULT_PAGE_SIZE,
  getTitleById,
  listTitles,
  parseCategory,
  parsePositiveInt,
} from "@/modules/catalog";

describe("catalog.service", () => {
  describe("listTitles", () => {
    it("returns the first page by default", () => {
      const result = listTitles();
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(DEFAULT_PAGE_SIZE);
      expect(result.items.length).toBe(DEFAULT_PAGE_SIZE);
      expect(result.total).toBeGreaterThan(DEFAULT_PAGE_SIZE);
      expect(result.hasMore).toBe(true);
    });

    it("paginates: a later page continues where the previous ended, no overlap", () => {
      const pageSize = 5;
      const p1 = listTitles({ pageSize, page: 1 });
      const p2 = listTitles({ pageSize, page: 2 });
      const overlap = p1.items.filter((a) =>
        p2.items.some((b) => b.id === a.id),
      );
      expect(overlap).toHaveLength(0);
      expect(p1.total).toBe(p2.total);
    });

    it("reports hasMore=false on the last page", () => {
      const { total } = listTitles();
      const big = listTitles({ pageSize: total });
      expect(big.items).toHaveLength(total);
      expect(big.hasMore).toBe(false);
    });

    it("filters by category", () => {
      const { items } = listTitles({ category: "Sci-Fi", pageSize: 100 });
      expect(items.length).toBeGreaterThan(0);
      expect(items.every((t) => t.category === "Sci-Fi")).toBe(true);
    });

    it("searches by title, case-insensitively", () => {
      const { items } = listTitles({ search: "aurora" });
      expect(items.some((t) => t.title === "Aurora Protocol")).toBe(true);
      expect(items.every((t) => t.title.toLowerCase().includes("aurora"))).toBe(
        true,
      );
    });

    it("combines search and category (AND semantics)", () => {
      const { items } = listTitles({ search: "deep", category: "Comedy" });
      // "Deep Field" is a Documentary, so the Comedy filter excludes it.
      expect(items).toHaveLength(0);
    });

    it("returns an empty result for a non-matching search", () => {
      const { items, total } = listTitles({ search: "zzzznotreal" });
      expect(items).toHaveLength(0);
      expect(total).toBe(0);
      expect(listTitles({ search: "zzzznotreal" }).hasMore).toBe(false);
    });
  });

  describe("getTitleById", () => {
    it("returns the matching title", () => {
      expect(getTitleById("aurora-protocol")?.title).toBe("Aurora Protocol");
    });

    it("returns null for an unknown id", () => {
      expect(getTitleById("does-not-exist")).toBeNull();
    });
  });

  describe("parseCategory", () => {
    it("accepts a valid category", () => {
      expect(parseCategory("Action")).toBe("Action");
    });

    it("rejects unknown or empty values", () => {
      expect(parseCategory("Romance")).toBeUndefined();
      expect(parseCategory(null)).toBeUndefined();
    });
  });

  describe("parsePositiveInt", () => {
    it("accepts positive integers", () => {
      expect(parsePositiveInt("3")).toBe(3);
    });

    it("rejects zero, negatives, decimals, and junk", () => {
      expect(parsePositiveInt("0")).toBeUndefined();
      expect(parsePositiveInt("-1")).toBeUndefined();
      expect(parsePositiveInt("2.5")).toBeUndefined();
      expect(parsePositiveInt("abc")).toBeUndefined();
      expect(parsePositiveInt(null)).toBeUndefined();
    });
  });
});