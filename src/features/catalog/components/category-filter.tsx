"use client";

import type { Category } from "@/modules/catalog";

interface CategoryFilterProps {
  categories: Category[];
  selected: Category | null;
  onSelect: (category: Category | null) => void;
}

export function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  const chips: { label: string; value: Category | null }[] = [
    { label: "All", value: null },
    ...categories.map((c) => ({ label: c, value: c })),
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Filter by category"
      className="flex gap-2 overflow-x-auto pb-1"
    >
      {chips.map(({ label, value }) => {
        const isActive = selected === value;
        return (
          <button
            key={label}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onSelect(value)}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              isActive
                ? "bg-brand text-white"
                : "bg-surface-raised text-neutral-300 hover:bg-surface-hover"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}