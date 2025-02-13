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
import { Prelink } from "@/components/ui/prelink";
import { Component, Search } from "lucide-react";
import { useEffect, useState } from "react";

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

  const accordionContent = (
    <CategoryList
      filteredCategories={filteredCategories}
      openItems={openItems}
      setOpenItems={setOpenItems}
      filterSubCategories={filterSubCategories}
    />
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Versi Desktop */}
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
        {accordionContent}
      </div>
      {/* Versi Mobile */}
      <div className="flex w-full flex-1 md:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="w-full" variant={"outline"}>
              <Component />
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
              {accordionContent}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function CategoryList({
  filteredCategories,
  openItems,
  setOpenItems,
  filterSubCategories,
}: {
  filteredCategories?: Category[];
  openItems: string[];
  setOpenItems: (items: string[]) => void;
  filterSubCategories: (
    subs: SubCategory[]
  ) => SubCategory[];
}) {
  return (
    <Accordion
      type="multiple"
      value={openItems}
      onValueChange={(values) => setOpenItems(values)}
    >
      {filteredCategories?.map((cat) => (
        <AccordionItem key={cat.id} value={cat.id}>
          <AccordionTrigger>{cat.name}</AccordionTrigger>
          {filterSubCategories(cat.subCategories).map(
            (sub) => (
              <Prelink
                key={sub.id}
                prefetch={true}
                href={`/${cat.slug}/${sub.slug}`}
              >
                <AccordionContent>
                  {sub.name}
                </AccordionContent>
              </Prelink>
            )
          )}
          <Prelink prefetch={true} href={`/${cat.slug}`}>
            <AccordionContent>
              All {cat.name}
            </AccordionContent>
          </Prelink>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
