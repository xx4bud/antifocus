"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";

const sortArray = [
  {
    name: "Popular",
    query: "popular",
  },
  {
    name: "Latest",
    query: "latest",
  },
  {
    name: "Top Sales",
    query: "top-sales",
  },
  {
    name: "Top Rated",
    query: "top-rated",
  },
  {
    name: "Price low to high",
    query: "price-low-to-high",
  },
  {
    name: "Price High to low",
    query: "price-high-to-low",
  },
];

export function SortSelect() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();

  const { replace } = useRouter();

  const sortQuery = params.get("sort") || "most-popular";

  const [sort, setSort] = useState(sortQuery);

  useEffect(() => {
    setSort(sortQuery);
  }, [sortQuery]);

  const handleSort = (sort: string) => {
    params.set("sort", sort);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select
      value={sort}
      onValueChange={(value) => handleSort(value)}
    >
      <SelectTrigger className="w-full" defaultValue={sort}>
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {sortArray.map((opt) => (
          <SelectItem key={opt.query} value={opt.query}>
            {opt.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
