"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

const sortOptions = [
  { name: "Popular", query: "popular" },
  { name: "Latest", query: "latest" },
  { name: "Top Sales", query: "top-sales" },
];

interface SortFilterProps {
  className?: string;
}

export function SortFilter({ className }: SortFilterProps) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { push } = useRouter();

  const sortQuery = params.get("sort") || "popular";
  const [sort, setSort] = useState(sortQuery);

  useEffect(() => {
    setSort(sortQuery);
  }, [sortQuery]);

  const handleSort = (newSort: string) => {
    params.set("sort", newSort);
    push(`${pathname}?${params.toString()}`);
  };

  const currentTab = sort.startsWith("price-")
    ? "price"
    : sort;
  const isPriceSort = sort.startsWith("price-");

  const PriceIcon =
    !isPriceSort || sort === "price-low-to-high"
      ? ArrowUp
      : ArrowDown;

  const handlePriceToggle = () => {
    if (!isPriceSort) {
      handleSort("price-low-to-high");
    } else {
      if (sort === "price-low-to-high") {
        handleSort("price-high-to-low");
      } else {
        handleSort("price-low-to-high");
      }
    }
  };

  return (
    <Tabs
      value={currentTab}
      onValueChange={(value) => {
        if (value !== "price") {
          handleSort(value);
        }
      }}
      className="flex w-full flex-1"
    >
      <TabsList
        className={cn("flex w-full p-1", className)}
      >
        {sortOptions.map((opt) => (
          <TabsTrigger
            key={opt.query}
            value={opt.query}
            className="basis-1/4"
          >
            {opt.name}
          </TabsTrigger>
        ))}
        <TabsTrigger
          value="price"
          className="flex basis-1/4 items-center justify-center"
          onClick={(e) => {
            e.preventDefault();
            handlePriceToggle();
          }}
        >
          <span className="mr-2">Price</span>
          <PriceIcon size={16} />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
