"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { CloudinaryUpload } from "@/components/ui/cloudinary-upload";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  CategorySchema,
  CategoryValues,
} from "@/lib/validation";
import { CategoryData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  deleteCategory,
  submitCategory,
  updateCategory,
} from "./actions";
import { AlertModal } from "@/components/shared/alert-modal";
import { Loader2, Trash } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { SubCategoryFields } from "./subcategory-fields";

interface CategoryFormProps {
  category: CategoryData | null;
}

export function CategoryForm({
  category,
}: CategoryFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [photosToDelete, setPhotosToDelete] =
    React.useState<string[]>([]);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [removedSubcategories, setRemovedSubcategories] =
    React.useState<any[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const cleanUpPhotos = async () => {
      try {
        const tempPhotos = JSON.parse(
          localStorage.getItem("tempPhotos") || "[]"
        );
        if (tempPhotos.length > 0) {
          for (const photo of tempPhotos) {
            try {
              const res = await fetch(
                `/api/cloudinary?publicId=${photo.publicId}`,
                {
                  method: "DELETE",
                }
              );
              if (res.ok) {
                console.log(
                  "Temp photo deleted successfully."
                );
              }
            } catch (error) {
              console.error(
                "Error deleting temp photo:",
                error
              );
            }
          }
          localStorage.removeItem("tempPhotos");
        }
      } catch (err) {
        console.error("Error parsing tempPhotos:", err);
      }
    };

    cleanUpPhotos();
  }, []);

  const form = useForm<CategoryValues>({
    resolver: zodResolver(CategorySchema),
    mode: "onChange",
    defaultValues: category
      ? {
          ...category,
        }
      : {
          name: "",
          photos: [],
          isFeatured: true,
          subCategories: [
            {
              name: "",
              photos: [],
              isFeatured: true,
            },
          ],
        },
  });

  const {
    fields: subCategoriesFields,
    append: appendSubCategory,
    remove: removeSubCategory,
  } = useFieldArray({
    control: form.control,
    name: "subCategories",
  });

  const handleAddSubcategory = () => {
    const lastRemoved = removedSubcategories.pop();
    const newSubCategory = lastRemoved || {
      name: "",
      photos: [],
      isFeatured: true,
    };

    appendSubCategory(newSubCategory);
    setRemovedSubcategories(removedSubcategories);
  };

  const handleRemoveSubCategory = (index: number) => {
    const removedData = form.getValues(
      `subCategories.${index}`
    );
    setRemovedSubcategories((prev) => [
      ...prev,
      removedData,
    ]);
    removeSubCategory(index);
  };

  const handleUploadPhoto = (
    result: CloudinaryUploadWidgetResults
  ) => {
    if (result.info && typeof result.info === "object") {
      const { secure_url: url, public_id: publicId } =
        result.info;

      const tempPhotos = JSON.parse(
        localStorage.getItem("tempPhotos") || "[]"
      );
      const newPhotos = [
        ...tempPhotos,
        { url, publicId, position: tempPhotos.length },
      ];
      localStorage.setItem(
        "tempPhotos",
        JSON.stringify(newPhotos)
      );

      const currentPhotos = form.getValues("photos");
      form.setValue("photos", [
        ...currentPhotos,
        { url, publicId, position: currentPhotos.length },
      ]);
      form.trigger("photos");
    }
  };

  const handleUploadSubPhoto = (
    result: CloudinaryUploadWidgetResults,
    index: number
  ) => {
    if (result.info && typeof result.info === "object") {
      const { secure_url: url, public_id: publicId } =
        result.info;

      const tempPhotos = JSON.parse(
        localStorage.getItem("tempPhotos") || "[]"
      );
      const newPhotos = [
        ...tempPhotos,
        { url, publicId, position: tempPhotos.length },
      ];
      localStorage.setItem(
        "tempPhotos",
        JSON.stringify(newPhotos)
      );

      const currentPhotos = form.getValues(
        `subCategories.${index}.photos`
      );
      form.setValue(`subCategories.${index}.photos`, [
        ...currentPhotos,
        { url, publicId, position: currentPhotos.length },
      ]);
      form.trigger(`subCategories.${index}.photos`);
    }
  };

  const handleRemovePhoto = async (publicId: string) => {
    const updatedPhotos = form
      .getValues("photos")
      .filter((photo) => photo.publicId !== publicId);
    form.setValue("photos", updatedPhotos);
    form.trigger("photos");

    setPhotosToDelete((prev) => [...prev, publicId]);
  };

  const handleRemoveSubPhoto = async (
    publicId: string,
    index: number
  ) => {
    const updatedPhotos = form
      .getValues(`subCategories.${index}.photos`)
      .filter((photo) => photo.publicId !== publicId);
    form.setValue(
      `subCategories.${index}.photos`,
      updatedPhotos
    );
    form.trigger(`subCategories.${index}.photos`);

    setPhotosToDelete((prev) => [...prev, publicId]);
  };

  const handleSubmit = async (data: CategoryValues) => {
    console.log(JSON.stringify(data, null, 2));
    setIsLoading(true);
    let res;
    if (category) {
      res = await updateCategory({
        ...data,
        id: category.id,
      });
    } else {
      res = await submitCategory(data);
    }

    if (res.success) {
      if (photosToDelete.length > 0) {
        for (const publicId of photosToDelete) {
          try {
            await fetch(
              `/api/cloudinary?publicId=${publicId}`,
              {
                method: "DELETE",
              }
            );
          } catch (error) {
            console.error("Error deleting photo:", error);
          }
        }
      }
      toast({
        description: res.message,
      });
      localStorage.removeItem("tempPhotos");
      router.push("/admin/categories");
      router.refresh();
    } else {
      console.log(res);
      toast({
        variant: "destructive",
        description: res.message,
      });
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    const res = await deleteCategory(category!.id);
    if (res.success) {
      toast({
        description: res.message,
      });
      router.push("/admin/categories");
      router.refresh();
    } else {
      toast({
        variant: "destructive",
        description: res.message,
      });
    }
    setIsLoading(false);
  };

  return (
    <>
      <AlertModal
        open={openAlert}
        title="Are you sure?"
        description="This action cannot be undone. It will permanently delete the category and its subcategories."
        onConfirm={handleDelete}
        onClose={() => setOpenAlert(false)}
      />
      <div className="flex flex-1 flex-col md:flex-row sm:space-x-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-1 flex-col space-y-4"
          >
            <div className="space-y-2 rounded-lg border bg-card p-4 pt-3">
              <Heading
                title={
                  category
                    ? "Edit Category"
                    : "Create Category"
                }
                description={
                  category
                    ? "Edit category details"
                    : "Create a new category"
                }
                button={
                  category && (
                    <Button
                      variant="destructive"
                      size="icon"
                      type="button"
                      onClick={() => setOpenAlert(true)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Trash />
                      )}
                    </Button>
                  )
                }
              />
              <Separator className="my-3" />
              <FormField
                control={form.control}
                name="photos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photos</FormLabel>
                    <FormControl>
                      <CloudinaryUpload
                        disabled={isLoading}
                        value={field.value}
                        onChange={(newPhotos) =>
                          field.onChange(newPhotos)
                        }
                        onRemove={handleRemovePhoto}
                        onUpload={handleUploadPhoto}
                        max={10}
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
                        disabled={isLoading}
                        placeholder="Categories Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isFeatured"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subCategoriesFields.map((_, index) => (
                <SubCategoryFields
                  key={index}
                  index={index}
                  onRemove={() =>
                    handleRemoveSubCategory(index)
                  }
                  onUploadPhoto={handleUploadSubPhoto}
                  onRemovePhoto={handleRemoveSubPhoto}
                  loading={isLoading}
                />
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <Button
                onClick={handleAddSubcategory}
                disabled={!form.formState.isValid || isLoading}
              >
                Add SubCategory
              </Button>
              <Separator />
              <div className="flex flex-1 flex-row gap-4">
                <Button
                  disabled={isLoading}
                  onClick={() => router.back()}
                  type="button"
                  variant={"outline"}
                  className="w-full"
                >
                  Cancel
                </Button>
                <LoadingButton
                  loading={isLoading}
                  disabled={isLoading}
                  type="submit"
                  className="w-full"
                >
                  Save
                </LoadingButton>
              </div>
            </div>
          </form>
        </Form>

        <div className="hidden h-fit w-1/3 flex-col border-l pl-4 sm:flex">
          {/* Category Preview */}
          <div className="flex flex-col gap-4">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
        </div>
      </div>
    </>
  );
}
