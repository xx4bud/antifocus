"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { UploadPhoto } from "@/components/ui/upload-photo";
import { XIcon } from "lucide-react";
import { CloudinaryUploadWidgetResults } from "next-cloudinary";

interface SubCategoriesFormProps {
  index: number;
  onRemove: () => void;
  onUploadPhoto: (
    result: CloudinaryUploadWidgetResults,
    index: number
  ) => void;
  onRemovePhoto: (publicId: string, index: number) => void;
  loading?: boolean;
}

export const SubCategoriesForm = ({
  index,
  onRemove,
  onUploadPhoto,
  onRemovePhoto,
  loading,
}: SubCategoriesFormProps) => {
  return (
    <div className="space-y-2 py-0.5">
      <Separator className="relative my-4">
        <span className="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer bg-card pr-1 text-muted-foreground">
          # Subcategory {index + 1}
        </span>
        <XIcon
          className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer bg-card pl-1 text-muted-foreground"
          onClick={() => {
            if (!loading) {
              onRemove();
            }
          }}
        />
      </Separator>

      <FormField
        name={`subCategories.${index}.photos`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Photos</FormLabel>
            <FormControl>
              <UploadPhoto
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
                max={1}
                disabled={loading}
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
        name={`subCategories.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Subcategory Description"
                disabled={loading}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
