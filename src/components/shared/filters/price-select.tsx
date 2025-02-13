"use client";
import { FC, useState, useEffect } from "react";
import {
  useSearchParams,
  usePathname,
  useRouter,
} from "next/navigation";
import { Input } from "@/components/ui/input";

export const PriceSelect: FC = () => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const [minPrice, setMinPrice] = useState<string | number>(
    ""
  ); // Initial value as empty string
  const [maxPrice, setMaxPrice] = useState<string | number>(
    ""
  );

  const [debounceTimeout, setDebounceTimeout] =
    useState<NodeJS.Timeout | null>(null);

  // Update URL params
  const updateUrlParams = () => {
    const params = new URLSearchParams(searchParams);
    if (minPrice) {
      params.set("minPrice", String(minPrice));
    } else {
      params.delete("minPrice");
    }

    if (maxPrice) {
      params.set("maxPrice", String(maxPrice));
    } else {
      params.delete("maxPrice");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  // Handle minPrice change
  const handleMinPriceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMinPrice(e.target.value);
  };
  
  const handleMaxPriceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMaxPrice(e.target.value);
  };

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      updateUrlParams();
    }, 500); 

    setDebounceTimeout(timeout);

  return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPrice, maxPrice]);

  return (
    <div className="grid grid-cols-2 gap-x-4">
      <Input
        name="minPrice"
        type="number"
        value={minPrice}
        onChange={handleMinPriceChange}
        placeholder="Min Price (e.g., 100000)"
      />
      <Input
        name="maxPrice"
        type="number"
        value={maxPrice}
        onChange={handleMaxPriceChange}
        placeholder="Max Price (e.g., 500000)"
      />
    </div>
  );
};
