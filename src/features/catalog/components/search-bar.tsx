"use client";

import { Input } from "@/components/ui";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative">
      <label htmlFor="search" className="sr-only">
        Search titles
      </label>
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M9 3.5a5.5 5.5 0 1 0 3.4 9.83l3.13 3.14a.75.75 0 1 0 1.06-1.06l-3.13-3.14A5.5 5.5 0 0 0 9 3.5ZM5 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"
          clipRule="evenodd"
        />
      </svg>
      <Input
        id="search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search titles…"
        className="pl-10 pr-3"
      />
    </div>
  );
}

export default SearchBar;