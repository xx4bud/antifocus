"use client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UploadPhoto } from "@/components/ui/upload-photo";
import { CloudinaryUploadWidgetResults } from "next-cloudinary";
import {
  deleteCategory,
  submitCategory,
  updateCategory,
} from "./actions";
import {
  CategoriesSchema,
  CategoriesValues,
} from "@/lib/schemas"; // Assuming this is your form schema
import {
  Category,
  Photo,
  SubCategory,
} from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

interface CategoryFormProps {
  category:
    | (Category & {
        photos: Photo[];
        subCategories: SubCategory[];
      })
    | null;
}

export default function CategoryForm({
  category,
}: CategoryFormProps) {
  const [error, setError] = useState<string>();
  const [openAlert, setOpenAlert] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<CategoriesValues>({
    resolver: zodResolver(CategoriesSchema),
    defaultValues: category
      ? {
          ...category,
          subCategories: category.subCategories.map(
            (subCategory) => ({
              ...subCategory,
            })
          ),
          photos: category.photos.map((photo) => ({
            url: photo.url,
            publicId: photo.publicId,
          })),
        }
      : {
          name: "",
          subCategories: [{ name: "", description: "" }],
          photos: [],
        },
  });

  useEffect(() => {
    const cleanUpPhotos = async () => {
      const tempPhotos = JSON.parse(
        localStorage.getItem("tempPhotos") || "[]"
      );

      if (tempPhotos.length > 0) {
        for (const photo of tempPhotos) {
          try {
            const res = await axios.delete(
              `/api/cloudinary?publicId=${photo.publicId}`
            );
            if (res.status !== 200) {
              console.error(
                `Failed to delete photo ${photo.publicId}`
              );
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

  const { fields, append, remove, prepend } = useFieldArray(
    {
      control: form.control,
      name: "subCategories",
    }
  );

  const handleAddSubCategory = () => {
    append({
      name: "",
      description: "",
    } as SubCategory);
  };

  const handleSubmit = async (data: CategoriesValues) => {
    setError(undefined);
    startTransition(async () => {
      let res;
      if (category) {
        res = await updateCategory({
          id: category.id,
          ...data,
        });
      } else {
        res = await submitCategory(data);
      }

      if (res.success) {
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
        toast({
          title: "Error",
          description: res.message,
        });
      }
    });
  };

  const handleDelete = async () => {
    setError(undefined);
    setOpenAlert(false);
    startTransition(async () => {
      const res = await deleteCategory(category!.id);
      if (res.success) {
        toast({
          title: "Success",
          description: "Category deleted successfully",
        });
        localStorage.removeItem("tempPhotos");
        router.push("/admin/categories");
        router.refresh();
      } else {
        setError(res.message);
      }
    });
  };

  const handleUploadPhoto = async (
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

  const handleRemovePhoto = async (publicId: string) => {
    const updatedPhotos = form
      .getValues("photos")
      .filter((photo) => photo.publicId !== publicId);
    form.setValue("photos", updatedPhotos);

    try {
      const res = await axios.delete(
        `/api/cloudinary?publicId=${publicId}`
      );
      if (res.status !== 200) {
        setError("Failed to delete image");
      }
    } catch (error) {
      console.error(`Error deleting photo:`, error);
    }
  };

  return (
    <div className="flex flex-col overflow-auto rounded-lg border bg-card p-4">
      <Heading
        title={
          category ? "Edit Category" : "Create Category"
        }
        description={
          category
            ? "Edit your category"
            : "Create a new category"
        }
        button={
          category && (
            <Button
              variant="destructive"
              size="icon"
              onClick={() => setOpenAlert(true)}
            >
              <Trash />
            </Button>
          )
        }
      />
      <Separator className="my-4" />

      <div className="flex w-full flex-col gap-2">
        {error && (
          <div className="flex h-9 items-center justify-center overflow-auto rounded-md bg-destructive/10 text-destructive">
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
                      max={1}
                      disabled={isPending}
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
                      disabled={isPending}
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
                <div className="pt-2">
                  <Separator className="relative mb-3 mt-2">
                    <FormLabel className="absolute left-0 top-1/2 -translate-y-1/2 bg-card pr-2 text-muted-foreground">
                      #{field.name}
                    </FormLabel>
                    <button
                      className="absolute right-0 top-1/2 -translate-y-1/2 bg-card pl-1 text-muted-foreground"
                      onClick={() => remove(index)}
                      disabled={isPending}
                    >
                      <X className="size-4" />
                    </button>
                  </Separator>
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name={`subCategories.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sub Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            disabled={isPending}
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
                        <FormLabel>
                          Sub Description
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            disabled={isPending}
                            placeholder="Sub Category Description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}

            {form.formState.errors.subCategories && (
              <p className="text-sm text-destructive">
                {
                  form.formState.errors.subCategories
                    .message
                }
              </p>
            )}

            <div className="flex flex-col pt-2 gap-2">
              <Button
                type="button"
                onClick={handleAddSubCategory}
              >
                <Plus className="h-4 w-4" />
                Add Sub Category
              </Button>
              <Separator className="my-2" />
              <div className="flex items-center justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/admin/campaigns");
                  }}
                >
                  Cancel
                </Button>
                <LoadingButton
                  loading={isPending}
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
  );
}
