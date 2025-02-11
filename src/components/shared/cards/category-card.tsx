import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { FeaturedCategoriesData } from "@/lib/queries/slug";

interface CategoryCardProps {
  category: FeaturedCategoriesData;
}

export function CategoryCard({
  category,
}: CategoryCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border p-6 transition-transform duration-300 hover:scale-[1.03]">
      <Image
        src={category.media[0]?.url || "/placeholder.svg"}
        alt={
          category.name.length > 50
            ? category.name.slice(0, 50) + "..."
            : category.name
        }
        loading="eager"
        width={200}
        height={200}
        quality={50}
        sizes="(max-width: 600px) 100vw, 200px"
        className="aspect-square h-full w-full rounded-full object-cover"
      />
      <p className="line-clamp-2 min-h-10 pt-2 text-center text-sm font-medium md:text-md">
        {category.name}
      </p>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="flex w-full gap-2">
      <Skeleton className="aspect-square h-20 rounded-full" />
    </div>
  );
}
