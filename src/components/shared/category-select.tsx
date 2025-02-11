// src/app/(main)/(collections)/[categorySlug]/filter-select.tsx
"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type SortOption =
  | "popular"
  | "bestSeller"
  | "latest"
  | "priceLowToHigh"
  | "priceHighToLow"
  | "rating";

interface Category {
  id: string;
  name: string;
  slug: string;
  subCategories: SubCategory[];
}

interface SubCategory {
  id: string;
  name: string;
  slug: string;
}

interface ProductsFilterProps {
  categories?: Category[];
subCategories?: SubCategory[];
onApply?: (filters: {
  query: string;
  sortOption: SortOption;
  minPrice: number | null;
  maxPrice: number | null;
  selectedCategoryIds: string[];
  selectedSubCategoryIds: string[];
}) => void;
}

export function CategorySelect({
  categories,
}: ProductsFilterProps) {
  const [query, setQuery] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);
  const normalizedQuery = query.trim().toLowerCase();

  const filteredCategories = categories?.filter((cat) => {
    if (normalizedQuery.length === 0) return true;
    const catMatch = cat.name
      .toLowerCase()
      .includes(normalizedQuery);
    const subMatch = cat.subCategories.some((sub) =>
      sub.name.toLowerCase().includes(normalizedQuery)
    );
    return catMatch || subMatch;
  });

  const filterSubCategories = (subs: SubCategory[]) =>
    subs.filter((sub) =>
      sub.name.toLowerCase().includes(normalizedQuery)
    );

  useEffect(() => {
    if (normalizedQuery.length > 0) {
      const matching = categories
        ?.filter((cat) =>
          cat.subCategories.some((sub) =>
            sub.name.toLowerCase().includes(normalizedQuery)
          )
        )
        .map((cat) => cat.id);
      setOpenItems(matching || []);
    } else {
      setOpenItems([]);
    }
  }, [normalizedQuery, categories]);

  return (
    <div className="flex flex-col gap-3">
      {/* Select on Desktop */}
      <div className="hidden flex-col gap-1.5 md:flex">
        <div className="relative">
          <Input
            type="text"
            placeholder="Category . . ."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pe-9"
          />
          <Search className="absolute right-2 top-2 size-5 text-muted-foreground" />
        </div>
        <Accordion
          type="multiple"
          value={openItems}
          onValueChange={(values) => setOpenItems(values)}
        >
          {filteredCategories?.map((cat) => (
            <AccordionItem key={cat.id} value={cat.id}>
              <AccordionTrigger>
                {cat.name}
              </AccordionTrigger>
              {filterSubCategories(cat.subCategories).map(
                (sub) => (
                  <AccordionContent key={sub.id}>
                    <Link href={`/${cat.slug}/${sub.slug}`}>
                      {sub.name}
                    </Link>
                  </AccordionContent>
                )
              )}
              <AccordionContent>
                <Link href={`/${cat.slug}`}>
                  All {cat.name}
                </Link>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      {/* Select on Mobile */}
      <div className="flex w-full flex-1 md:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="w-full" variant={"outline"}>
              Select Category
            </Button>
          </PopoverTrigger>
          <PopoverContent asChild sideOffset={8}>
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Category . . ."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pe-9"
                />
                <Search className="absolute right-2 top-2 size-5 text-muted-foreground" />
              </div>
              <Accordion
                type="multiple"
                value={openItems}
                onValueChange={(values) =>
                  setOpenItems(values)
                }
              >
                {filteredCategories?.map((cat) => (
                  <AccordionItem
                    key={cat.id}
                    value={cat.id}
                  >
                    <AccordionTrigger>
                      {cat.name}
                    </AccordionTrigger>
                    {filterSubCategories(
                      cat.subCategories
                    ).map((sub) => (
                      <AccordionContent key={sub.id}>
                        <Link
                          href={`/${cat.slug}/${sub.slug}`}
                        >
                          {sub.name}
                        </Link>
                      </AccordionContent>
                    ))}
                    <AccordionContent>
                      <Link href={`/${cat.slug}`}>
                        All {cat.name}
                      </Link>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
