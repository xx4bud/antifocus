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
  const { replace } = useRouter();

  // Ambil query "sort" dari URL, default ke "popular"
  const sortQuery = params.get("sort") || "popular";
  const [sort, setSort] = useState(sortQuery);

  useEffect(() => {
    setSort(sortQuery);
  }, [sortQuery]);

  // Fungsi untuk mengupdate query param "sort"
  const handleSort = (newSort: string) => {
    params.set("sort", newSort);
    replace(`${pathname}?${params.toString()}`);
  };

  // Jika sort merupakan price sort, kita anggap currentTab sebagai "price"
  const currentTab = sort.startsWith("price-")
    ? "price"
    : sort;
  const isPriceSort = sort.startsWith("price-");

  // Jika belum memilih price sort, default ikon panah ke atas (ascending)
  const PriceIcon =
    !isPriceSort || sort === "price-low-to-high"
      ? ArrowUp
      : ArrowDown;

  // Handler khusus untuk tab Price
  const handlePriceToggle = () => {
    if (!isPriceSort) {
      // Jika belum aktif, pilih ascending (harga terendah)
      handleSort("price-low-to-high");
    } else {
      // Toggle antara ascending dan descending
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
        {/* Tab Price khusus */}
        <TabsTrigger
          value="price"
          className="flex basis-1/4 items-center justify-center"
          onClick={(e) => {
            e.preventDefault(); // cegah pemilihan otomatis dari Tabs
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
