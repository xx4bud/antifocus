"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Prelink } from "@/components/ui/prelink";

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
  const pathname = usePathname();

  const sortQuery = searchParams.get("sort") || "popular";

  // Tentukan active tab: jika sortQuery diawali "price-", maka active tab adalah "price"
  const currentTab = sortQuery.startsWith("price-") ? "price" : sortQuery;
  const isPriceSort = sortQuery.startsWith("price-");

  const PriceIcon =
    !isPriceSort || sortQuery === "price-low-to-high" ? ArrowUp : ArrowDown;

  // Fungsi untuk menghasilkan URL baru dengan query sort yang baru
  const getSortLink = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    return `${pathname}?${params.toString()}`;
  };

  // Untuk tab Price, toggle antara ascending dan descending
  const getPriceToggleLink = () => {
    const newSort =
      isPriceSort && sortQuery === "price-low-to-high"
        ? "price-high-to-low"
        : "price-low-to-high";
    return getSortLink(newSort);
  };

  return (
    <Tabs value={currentTab} className="flex w-full flex-1">
      <TabsList className={cn("flex w-full p-1", className)}>
        {sortOptions.map((opt) => (
          <TabsTrigger
            key={opt.query}
            value={opt.query}
            className="flex basis-1/4 items-center justify-center"
          >
            <Prelink
              href={getSortLink(opt.query)}
              className="w-full text-center"
            >
              {opt.name}
            </Prelink>
          </TabsTrigger>
        ))}
        <TabsTrigger
          value="price"
          className="flex basis-1/4 items-center justify-center"
        >
          <Prelink
            href={getPriceToggleLink()}
            className="w-full text-center flex items-center justify-center"
          >
            <span className="mr-2">Price</span>
            <PriceIcon size={16} />
          </Prelink>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
