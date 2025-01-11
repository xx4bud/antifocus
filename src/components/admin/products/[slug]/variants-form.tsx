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
import { UploadPhoto } from "@/components/ui/upload-photo";
import { XIcon } from "lucide-react";
import { CloudinaryUploadWidgetResults } from "next-cloudinary";

interface VariantsFormProps {
  index: number;
  onRemove: () => void;
  onUploadPhoto: (
    result: CloudinaryUploadWidgetResults,
    index: number
  ) => void;
  onRemovePhoto: (publicId: string, index: number) => void;
  loading?: boolean;
}

export const VariantsForm = ({
  index,
  onRemove,
  onUploadPhoto,
  onRemovePhoto,
  loading,
}: VariantsFormProps) => {
  return (
    <div className="space-y-2 py-0.5">
      <Separator className="relative my-4">
        <span className="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer bg-card pr-1 text-muted-foreground">
          # Variant {index + 1}
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
        name={`variants.${index}.photos`}
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
        name={`variants.${index}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Variant Name"
                disabled={loading}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          name={`variants.${index}.price`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Variant price"
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name={`variants.${index}.stock`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  disabled={loading}
                  placeholder="Variant stock"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
