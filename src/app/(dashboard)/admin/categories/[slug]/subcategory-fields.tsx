"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CloudinaryUpload } from "@/components/ui/cloudinary-upload";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Loader2, Trash } from "lucide-react";
import { CloudinaryUploadWidgetResults } from "next-cloudinary";

interface SubCategoryFieldsProps {
  index: number;
  onRemove: () => void;
  onUploadPhoto: (
    result: CloudinaryUploadWidgetResults,
    index: number
  ) => void;
  onRemovePhoto: (publicId: string, index: number) => void;
  loading?: boolean;
}

export function SubCategoryFields({
  index,
  onRemove,
  onUploadPhoto,
  onRemovePhoto,
  loading,
}: SubCategoryFieldsProps) {
  return (
    <div className="space-y-2 rounded-lg border bg-card p-4">
      <Heading
        title={`SubCategory ${index + 1}`}
        button={
          <Button
            size="icon"
            onClick={() => onRemove()}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Trash />
            )}
          </Button>
        }
      />
      <FormField
        name={`subCategories.${index}.photos`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Photos</FormLabel>
            <FormControl>
              <CloudinaryUpload
                disabled={loading}
                value={field.value}
                onChange={(newPhotos) =>
                  field.onChange(newPhotos)
                }
                onRemove={(publicId) =>
                  onRemovePhoto(publicId, index)
                }
                onUpload={(result) =>
                  onUploadPhoto(result, index)
                }
                max={10}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name={`subCategories.${index}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Subcategory Name"
                disabled={loading}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name={`subCategories.${index}.isFeatured`}
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-2 space-y-0 py-1">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>

            <FormLabel>Featured</FormLabel>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
