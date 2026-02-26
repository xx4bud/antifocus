"use client";

import { IconArrowsSort } from "@tabler/icons-react";
import { useRouter } from "~/i18n/navigation";

interface SearchFiltersProps {
  currentQuery: string;
  currentSort: string;
}

const sortOptions = [
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
  { value: "price_asc", label: "Harga Terendah" },
  { value: "price_desc", label: "Harga Tertinggi" },
  { value: "name", label: "Nama A-Z" },
];

export function SearchFilters({
  currentQuery,
  currentSort,
}: SearchFiltersProps) {
  const router = useRouter();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const query: Record<string, string> = {};
    if (currentQuery) {
      query.q = currentQuery;
    }
    if (newSort !== "newest") {
      query.sort = newSort;
    }
    router.push({
      pathname: "/search",
      query,
    });
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <IconArrowsSort className="size-4" />
        <span className="hidden sm:inline">Urutkan:</span>
      </div>
      <select
        className="rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
        defaultValue={currentSort}
        onChange={handleSortChange}
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
