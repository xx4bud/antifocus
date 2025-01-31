import Image from "next/image";
import { Card } from "@/components/ui/card";
import { CategoryValues } from "@/schemas/category.schemas";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

interface CategoryPreviewProps {
  category: CategoryValues;
}

export function CategoryPreview({
  category,
}: CategoryPreviewProps) {
  return (
    <>
      <Heading
        title="Preview"
        description="This our category card preview."
      />
      <Separator className="my-3" />
      <div className="pt-2">
        <Card className="space-y-2 p-4 pt-2">
          <p className="font-medium text-foreground">
            {category.name || "Category Name"}
          </p>
          {category.photos.length > 0 ? (
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
              <Image
                src={category.photos[0].url}
                alt="Category Image"
                layout="fill"
                objectFit="cover"
              />
            </div>
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-lg border">
             <span className="text-sm text-muted-foreground">No image</span>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
