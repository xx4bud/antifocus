import { FiltersQuery } from "@/lib/types";
import { CategorySelect } from "./category-select";
import { SortSelect } from "./sort-select";
import { SelectFilter } from "./select-filter";
import { getCategories } from "@/app/actions/category";

interface ProductFilterProps {
  queries: FiltersQuery;
}

export async function ProductFilter({
  queries,
}: ProductFilterProps) {
  const categories = await getCategories();
  return (
    <div className="flex flex-col gap-2">
      <CategorySelect categories={categories} />
      <SelectFilter queries={queries} />
      <SortSelect />
    </div>
  );
}
