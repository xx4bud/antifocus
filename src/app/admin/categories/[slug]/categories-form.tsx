"use client";

import { CategoryData } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CategoriesSchema,
  CategoriesValues,
} from "@/lib/schemas";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { UploadPhoto } from "@/components/ui/upload-photo";
import { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { Plus, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "./actions";
import { AlertModal } from "@/components/ui/alert-modal";
import { SubCategoriesForm } from "./subcategories-form";

interface CategoriesFormProps {
  category: CategoryData | null;
}

export default function CategoriesForm({
  category,
}: CategoriesFormProps) {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [photosToDelete, setPhotosToDelete] = useState<
    string[]
  >([]);
  const [removedSubcategories, setRemovedSubcategories] =
    useState<any[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  // Form Register
  const form = useForm<CategoriesValues>({
    resolver: zodResolver(CategoriesSchema),
    defaultValues: category
      ? {
          ...category,
        }
      : {
          photos: [],
          name: "",
          subCategories: [
            {
              photos: [],
              name: "",
              description: "",
            },
          ],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subCategories",
  });

  // Delete temp photos
  useEffect(() => {
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

  const handleSubmit = async (data: CategoriesValues) => {
    setError(undefined);
    setIsLoading(true);
    if (fields.length === 0) {
      setError("At least one subcategory is required.");
      setIsLoading(false);
      return;
    }

    let res;
    if (category) {
      res = await updateCategory({
        ...data,
        id: category.id,
      });
    } else {
      res = await createCategory(data);
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
        title: "Success",
        description: category
          ? "Category updated successfully"
          : "Category created successfully",
      });
      localStorage.removeItem("tempPhotos");
      router.push("/admin/categories");
      router.refresh();
    } else {
      setError(res.message);
    }
    setIsLoading(false);
  };

  const handleDeleteConfirm = () => {
    setOpenAlert(false);
    handleDelete();
  };

  const handleDelete = async () => {
    setError(undefined);
    setIsDeleting(true);
    if (!category) return;

    const res = await deleteCategory(category.id);

    if (res.success) {
      toast({
        title: "Deleted",
        description: "Category deleted successfully.",
      });
      router.push("/admin/categories");
      router.refresh();
    } else {
      setError(res.message);
    }
    setIsDeleting(false);
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

      const newPhotos = [...tempPhotos, { url, publicId }];
      localStorage.setItem(
        "tempPhotos",
        JSON.stringify(newPhotos)
      );

      form.setValue("photos", [
        ...form.getValues("photos"),
        { url, publicId },
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

      const newPhotos = [...tempPhotos, { url, publicId }];
      localStorage.setItem(
        "tempPhotos",
        JSON.stringify(newPhotos)
      );

      const updatedPhotos = [
        ...form.getValues(`subCategories.${index}.photos`),
        { url, publicId },
      ];
      form.setValue(
        `subCategories.${index}.photos`,
        updatedPhotos
      );
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

  const handleAddSubcategory = () => {
    const lastRemoved = removedSubcategories.pop();
    const newSubCategory = lastRemoved || {
      name: "",
      description: "",
      photos: [],
    };

    append(newSubCategory);
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
    remove(index);
  };

  return (
    <>
      <AlertModal
        open={openAlert}
        title="Are you sure?"
        description="This action cannot be undone. It will permanently delete the category and its subcategories."
        loading={isDeleting}
        onClose={() => setOpenAlert(false)}
        onConfirm={handleDeleteConfirm}
      />

      <div className="flex h-full w-full flex-col rounded-lg border bg-card p-4">
        <Heading
          title={
            category ? "Edit Category" : "Create Category"
          }
          description={
            category
              ? "Edit category details"
              : "Create a new category"
          }
          button={
            category && (
              <LoadingButton
                variant="destructive"
                size="icon"
                onClick={() => setOpenAlert(true)}
                disabled={isDeleting}
                loading={isDeleting}
              >
                <Trash />
              </LoadingButton>
            )
          }
        />
        <Separator className="my-3" />

        <div className="space-y-2">
          {error && (
            <div className="flex h-9 items-center justify-center overflow-hidden rounded-md bg-destructive/10 text-destructive">
              <span>{error}</span>
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-2"
            >
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
                        onRemove={handleRemovePhoto}
                        onUpload={handleUploadPhoto}
                        disabled={isLoading}
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
                        disabled={isLoading}
                        placeholder="Category Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {fields.map((field, index) => (
                <SubCategoriesForm
                  key={field.id}
                  index={index}
                  onRemove={() =>
                    handleRemoveSubCategory(index)
                  }
                  onUploadPhoto={handleUploadSubPhoto}
                  onRemovePhoto={handleRemoveSubPhoto}
                  loading={isLoading}
                />
              ))}

              {fields.length === 0 && (
                <p className="text-sm text-destructive">
                  At least one subcategory is required.
                </p>
              )}

              <div className="flex flex-col pt-1">
                <Button
                  type="button"
                  onClick={handleAddSubcategory}
                  disabled={isLoading}
                >
                  <Plus />
                  Add Subcategory
                </Button>

                <Separator className="my-4" />

                <div className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    disabled={isLoading}
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/admin/categories");
                    }}
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    disabled={isLoading}
                    loading={isLoading}
                    type="submit"
                  >
                    Save
                  </LoadingButton>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
