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
import { Plus, Trash } from "lucide-react";
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

            {fields.map((field, index) => {
              const nameError = form.getFieldState(
                `subCategories.${index}.name`,
                form.formState
              ).error;
              const descriptionError = form.getFieldState(
                `subCategories.${index}.description`,
                form.formState
              ).error;

              const isFirstField = index === 0;

              return (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`subCategories.${index}`}
                  render={() => (
                    <FormItem>
                      {/* Conditionally apply destructive style to label */}
                      <FormLabel
                        className={
                          isFirstField && nameError
                            ? "text-destructive"
                            : ""
                        }
                      >
                        {isFirstField
                          ? "Sub Categories"
                          : ""}
                      </FormLabel>
                      <div className="flex flex-col gap-4">
                        {/* Sub Category Name */}
                        <div className="flex flex-col">
                          <FormControl>
                            <Textarea
                              disabled={isPending}
                              placeholder="Sub Category Name"
                              {...form.register(
                                `subCategories.${index}.name`
                              )}
                            />
                          </FormControl>
                          {nameError && (
                            <p className="text-sm text-destructive">
                              {nameError.message}
                            </p>
                          )}
                        </div>

                        {/* Sub Category Description */}
                        <div className="flex flex-col">
                          <FormControl>
                            <Textarea
                              disabled={isPending}
                              placeholder="Sub Category Description"
                              {...form.register(
                                `subCategories.${index}.description`
                              )}
                            />
                          </FormControl>
                          {descriptionError && (
                            <p className="text-sm text-destructive">
                              {descriptionError.message}
                            </p>
                          )}
                        </div>

                        {/* Remove Button */}
                        <Button
                          type="button"
                          onClick={() => {
                            remove(index); // Remove field
                            form.trigger("subCategories"); // Force validation
                          }}
                          variant="outline"
                          size="sm"
                          className="h-8 w-8"
                        >
                          <Trash />
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />
              );
            })}

            {/* Global Error Message for Sub Categories */}
            {form.formState.errors.subCategories && (
              <p className="mt-2 text-sm text-destructive">
                {
                  form.formState.errors.subCategories
                    .message
                }
              </p>
            )}

            {/* Add Sub Category Button */}
            <Button
              type="button"
              onClick={handleAddSubCategory}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              <Plus className="h-4 w-4" />
              Add Sub Category
            </Button>

            {/* {fields.map((field, index) => (
              <div key={field.id}>
                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      onClick={() => remove(index)}
                      disabled={isPending}
                    >
                      <Trash />
                    </Button>
                    <FormLabel>#{field.name}</FormLabel>
                  </div>

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
            ))} */}

            <div className="flex flex-col gap-2">
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
