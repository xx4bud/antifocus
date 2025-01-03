"use client";

import { CategoryData } from "@/lib/queries";
import {
  CategoriesSchema,
  CategoriesValues,
} from "@/lib/schemas";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadPhoto } from "@/components/ui/upload-photo";
import { CloudinaryUploadWidgetResults } from "next-cloudinary";
import axios from "axios";
import { useEffect, useState, useTransition } from "react";
import { createCategory, updateCategory } from "./actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { LoadingButton } from "@/components/ui/loading-button";

interface CategoriesFormProps {
  categories: CategoryData | null;
}

export default function CategoriesForm({
  categories,
}: CategoriesFormProps) {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<CategoriesValues>({
    resolver: zodResolver(CategoriesSchema),
    defaultValues: categories
      ? {
          ...categories,
        }
      : {
          photos: [],
          name: "",
          subCategories: [
            { name: "", description: "", photos: [] },
          ],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subCategories",
  });

  useEffect(() => {
    const cleanUpPhotos = async () => {
      const tempPhotos = JSON.parse(
        localStorage.getItem("tempPhotos") || "[]"
      );

      if (tempPhotos.length > 0) {
        for (const photo of tempPhotos) {
          try {
            const res = await fetch(
              `/api/cloudinary?publicId=${photo.publicId}`,
              { method: "DELETE" }
            );

            if (!res.ok) {
              throw new Error("Failed to delete image");
            }
          } catch (error) {
            console.error(`Error deleting photo:`, error);
          }
        }

        localStorage.removeItem("tempPhotos");
      }
    };

    cleanUpPhotos();
  }, []);

  const handleSubmit = async (data: CategoriesValues) => {
    setError(undefined);
    startTransition(async () => {
      let res;
      if (categories) {
        res = await updateCategory({
          ...data,
          id: categories.id,
          subCategories: categories.subCategories.map(
            (subCategory) => ({
              ...subCategory,
            })
          ),
        });
      } else {
        res = await createCategory(data);
      }

      if (res.success) {
        toast({
          title: "Success",
          description: categories
            ? "Category updated successfully"
            : "Category created successfully",
        });
        localStorage.removeItem("tempPhotos");
        router.push("/admin/categories");
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: res.message,
        });
      }
    });
  };

  const handleUploadCategoryPhoto = async (
    result: CloudinaryUploadWidgetResults
  ) => {
    if (result.info && typeof result.info === "object") {
      const { secure_url: url, public_id: publicId } =
        result.info;

      const tempPhotos = JSON.parse(
        localStorage.getItem("tempPhotos") || "[]"
      );

      localStorage.setItem(
        "tempPhotos",

        JSON.stringify([...tempPhotos, { url, publicId }])
      );

      form.setValue("photos", [
        ...form.getValues("photos"),

        { url, publicId },
      ]);
    }
  };

  const handleUploadSubCategoryPhoto = async (
    result: CloudinaryUploadWidgetResults,

    subCategoryIndex: number
  ) => {
    if (result.info && typeof result.info === "object") {
      const { secure_url: url, public_id: publicId } =
        result.info;

      const tempPhotos = JSON.parse(
        localStorage.getItem("tempPhotos") || "[]"
      );

      localStorage.setItem(
        "tempPhotos",

        JSON.stringify([...tempPhotos, { url, publicId }])
      );

      const updatedSubCategories = [
        ...form.getValues("subCategories"),
      ];

      if (!updatedSubCategories[subCategoryIndex].photos) {
        updatedSubCategories[subCategoryIndex].photos = [];
      }

      updatedSubCategories[subCategoryIndex].photos.push({
        url,

        publicId,
      });

      form.setValue("subCategories", updatedSubCategories);
    }
  };

  const handleRemoveCategoryPhoto = async (
    publicId: string
  ) => {
    const updatedPhotos = form

      .getValues("photos")

      .filter((photo) => photo.publicId !== publicId);

    form.setValue("photos", updatedPhotos);

    try {
      const res = await fetch(
        `/api/cloudinary?publicId=${publicId}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        // setError("Failed to delete image");
      }
    } catch (error) {
      console.error(`Error deleting photo:`, error);
    }
  };

  const handleRemoveSubCategoryPhoto = async (
    publicId: string,

    subCategoryIndex: number
  ) => {
    const updatedSubCategories = [
      ...form.getValues("subCategories"),
    ];

    updatedSubCategories[subCategoryIndex].photos =
      updatedSubCategories[subCategoryIndex].photos?.filter(
        (photo) => photo.publicId !== publicId
      ) || [];

    form.setValue("subCategories", updatedSubCategories);

    try {
      const res = await fetch(
        `/api/cloudinary?publicId=${publicId}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        // setError("Failed to delete image");
      }
    } catch (error) {
      console.error(`Error deleting photo:`, error);
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-auto rounded-lg border bg-card p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="photos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photos</FormLabel>
                <FormControl>
                  <UploadPhoto
                    value={field.value}
                    onChange={(newPhotos) =>
                      field.onChange(newPhotos)
                    }
                    onRemove={handleRemoveCategoryPhoto}
                    onUpload={handleUploadCategoryPhoto}
                    max={1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Category Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {fields.map((field, index) => (
            <div key={field.id}>
              <FormField
                control={form.control}
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
                          handleRemoveSubCategoryPhoto(
                            publicId,

                            index
                          )
                        }
                        onUpload={(result) =>
                          handleUploadSubCategoryPhoto(
                            result,

                            index
                          )
                        }
                        max={1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`subCategories.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Sub Category Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`subCategories.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub Description</FormLabel>

                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Sub Category Description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}

          <div className="flex w-full justify-end pt-2">
            <LoadingButton
              loading={isPending}
              type="submit"
            >
              Save
            </LoadingButton>
          </div>
        </form>
      </Form>
    </div>
  );
}
