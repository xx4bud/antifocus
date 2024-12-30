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
import { Trash } from "lucide-react";
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
import { submitCategory, updateCategory } from "./actions";
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
          subCategories: category.subCategories.map((subCategory) => ({
            ...subCategory,
          })),
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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subCategories",
  });

  const handleAddSubCategory = () => {
    append({
      name: "",
      description: "",
    } as SubCategory);
  };

  const handleUploadPhoto = async (
    result: CloudinaryUploadWidgetResults
  ) => {
    if (result.info && typeof result.info === "object") {
      const { secure_url: url, public_id: publicId } =
        result.info;
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

  return (
    <div className="flex h-auto w-full flex-col items-center overflow-auto rounded-lg border bg-card p-4">
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
          <div className="flex h-9 items-center justify-center rounded-md bg-destructive/10 text-destructive">
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
                      max={5}
                      disabled={isPending}
                      // className="w-full"
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
              <div key={field.id} className="space-y-2">
                      <div className="flex items-center justify-between">
              <FormLabel>SubCategory {index + 1}</FormLabel>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => remove(index)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>

                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled={isPending}
                      placeholder="SubCategory Name"
                      {...form.register(
                        `subCategories.${index}.name`
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isPending}
                      placeholder="SubCategory Description"
                      {...form.register(
                        `subCategories.${index}.description`
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            ))}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={handleAddSubCategory}
              >
                Add SubCategory
              </Button>

              <LoadingButton
                type="submit"
                loading={isPending}
                disabled={isPending}
              >
                {category
                  ? "Save Changes"
                  : "Create Category"}
              </LoadingButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
