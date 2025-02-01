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
import { PhotoUpload } from "@/components/ui/photo-upload";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  CategorySchema,
  CategoryValues,
} from "@/schemas/category.schemas";
import { CategoryData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import {
  deleteCategory,
  submitCategory,
  updateCategory,
} from "./actions";
import { AlertModal } from "@/components/shared/alert-modal";
import { Loader2, Trash } from "lucide-react";

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
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<CategoryValues>({
    resolver: zodResolver(CategorySchema),
    defaultValues: category
      ? {
          ...category,
        }
      : {
          name: "",
          photos: [],
        },
  });

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

  const handleRemovePhoto = async (publicId: string) => {
    const updatedPhotos = form
      .getValues("photos")
      .filter((photo) => photo.publicId !== publicId);
    form.setValue("photos", updatedPhotos);
    form.trigger("photos");

    setPhotosToDelete((prev) => [...prev, publicId]);
  };

  const handleSubmit = async (data: CategoryValues) => {
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
      toast({
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
    }
    setIsLoading(false);
  };

  return (
    <>
      <AlertModal
        open={openAlert}
        title="Are you sure?"
        description="This action cannot be undone. It will permanently delete the category and its subcategories."
        loading={isLoading}
        onConfirm={handleDelete}
        onClose={() => setOpenAlert(false)}
      />
      <div className="flex flex-1 flex-col sm:flex-row sm:space-x-4">
        <div className="flex flex-1 flex-col">
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
                <Button
                  variant="destructive"
                  size="icon"
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
                      <PhotoUpload
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
              <div className="grid grid-cols-2 justify-end gap-4 pt-2">
                <Button
                  disabled={isLoading}
                  onClick={() => router.back()}
                  type="button"
                  variant={"outline"}
                >
                  Cancel
                </Button>
                <LoadingButton
                  loading={isLoading}
                  disabled={isLoading}
                  type="submit"
                >
                  Save
                </LoadingButton>
              </div>
            </form>
          </Form>
        </div>
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
