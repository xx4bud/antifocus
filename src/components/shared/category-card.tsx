import { Skeleton } from "@/components/ui/skeleton";
import { CategoryData } from "@/lib/types";
import Image from "next/image";

interface CategoryCardProps {
  category: CategoryData;
}

export function CategoryCard({
  category,
}: CategoryCardProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 rounded-lg border py-4 transition-transform duration-300 hover:scale-[1.02]">
      <Image
        src={
          category.image ||
          category.media[0]?.url ||
          "/placeholder.svg"
        }
        alt={category.name}
        width={100}
        height={100}
        quality={50}
        sizes="(max-width: 600px) 100vw, 100px"
        className="aspect-square size-[80%] rounded-full object-cover"
      />
      <p className="line-clamp-2 text-center text-sm font-medium md:text-base">
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
