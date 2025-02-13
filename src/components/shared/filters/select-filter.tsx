"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FiltersQuery } from "@/lib/types";
import { FilterIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { PriceSelect } from "./price-select";

interface SelectFilterProps {
  queries: FiltersQuery;
}

export function SelectFilter({
  queries,
}: SelectFilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [currentParams, setCurrentParams] =
    useState<string>(searchParams.toString());

  useEffect(() => {
    setCurrentParams(searchParams.toString());
  }, [searchParams]);

  const queriesArray = Object.entries(queries);
  const queriesLength = queriesArray.reduce(
    (count, [queryKey, queryValue]) => {
      if (queryKey === "sort") return count;
      if (queryKey === "q" && queryValue === "")
        return count;
      return (
        count +
        (Array.isArray(queryValue) ? queryValue.length : 1)
      );
    },
    0
  );

  const handleClearQueries = () => {
    const params = new URLSearchParams(searchParams);
    params.forEach((_, key) => {
      params.delete(key);
    });
    replace(pathname);
  };

  const handleRemoveQuery = (
    query: string,
    array?: string[],
    specificValue?: string
  ) => {
    const params = new URLSearchParams(searchParams);

    if (specificValue && array) {
      const updatedArray = array.filter(
        (value) => value !== specificValue
      );
      params.delete(query);
      updatedArray.forEach((value) =>
        params.append(query, value)
      );
    } else {
      params.delete(query);
    }

    replace(`${pathname}?${params.toString()}`);
    setCurrentParams(params.toString());
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex w-full">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="w-full" variant={"outline"}>
              <FilterIcon />
              Filter Products
            </Button>
          </PopoverTrigger>
          <PopoverContent asChild sideOffset={8}>
            <div className="space-y-3">
              <PriceSelect />
              <Button
                onClick={handleClearQueries}
                variant={"outline"}
                className="w-full"
              >
                Clear
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
