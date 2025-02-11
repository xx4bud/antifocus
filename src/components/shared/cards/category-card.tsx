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
        alt={category.name}
        loading="eager"
        width={200}
        height={200}
        quality={50}
        className="aspect-square h-full w-full rounded-full object-cover"
      />
      <p className="line-clamp-2 pt-2 text-center text-sm font-medium md:text-lg">
        {category.name}
      </p>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="flex gap-2 w-full">
      <Skeleton className="aspect-square h-20 rounded-full"/>
    </div>
  );
}
