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
import { Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { createCategory, updateCategory } from "./actions";

interface CategoriesFormProps {
  category: CategoryData | null;
}

export default function CategoriesForm({
  category,
}: CategoriesFormProps) {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const [openAlert, setOpenAlert] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<CategoriesValues>({
    resolver: zodResolver(CategoriesSchema),
    defaultValues: category
      ? {
          ...category,
        }
      : {
          photos: [],
          name: "",
          subCategories: [{ name: "", description: "" }],
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

            if (res.ok) {
              console.log(
                "temp photo deleted successfully"
              );
            }
          } catch (error) {
            console.error(
              `Error deleting temp photo:`,
              error
            );
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
      console.log(data);
      let res;
      if (category) {
        res = await updateCategory({
          id: category.id,
          ...data,
        });
      } else {
        res = await createCategory(data);
      }

      if (res.success) {
        toast({
          title: "Success",
          description: category
            ? "Category updated successfully"
            : "Category created successfully",
        });
        router.push("/admin/categories");
        localStorage.removeItem("tempPhotos");
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

      const newPhotos = [...tempPhotos, { url, publicId }];
      localStorage.setItem(
        "tempPhotos",
        JSON.stringify(newPhotos)
      );

      form.setValue("photos", [
        ...form.getValues("photos"),
        { url, publicId },
      ]);
      console.log(form.getValues("photos"));
    }
  };

  // const handleUploadSubPhoto = async (
  //   result: CloudinaryUploadWidgetResults,
  //   index: number
  // ) => {
  //   if (result.info && typeof result.info === "object") {
  //     const { secure_url: url, public_id: publicId } =
  //       result.info;

  //     const tempPhotos = JSON.parse(
  //       localStorage.getItem("tempPhotos") || "[]"
  //     );

  //     const newPhotos = [...tempPhotos, { url, publicId }];
  //     localStorage.setItem(
  //       "tempPhotos",
  //       JSON.stringify(newPhotos)
  //     );

  //     const updatedPhotos = [
  //       ...form.getValues(`subCategories.${index}.photos`),
  //       { url, publicId },
  //     ];
  //     form.setValue(
  //       `subCategories.${index}.photos`,
  //       updatedPhotos
  //     );
  //   }
  // };

  const handleRemovePhoto = async (publicId: string) => {
    const updatedPhotos = form
      .getValues("photos")
      .filter((photo) => photo.publicId !== publicId);
    form.setValue("photos", updatedPhotos);

    try {
      const res = await fetch(
        `/api/cloudinary?publicId=${publicId}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        console.log("temp photo deleted successfully");
      }
    } catch (error) {
      console.error(`Error deleting temp photo:`, error);
    }
  };

  // const handleRemoveSubPhoto = async (
  //   publicId: string,
  //   index: number
  // ) => {
  //   const updatedPhotos = form
  //     .getValues(`subCategories.${index}.photos`)
  //     .filter((photo) => photo.publicId !== publicId);
  //   form.setValue(
  //     `subCategories.${index}.photos`,
  //     updatedPhotos
  //   );

  //   try {
  //     const res = await fetch(
  //       `/api/cloudinary?publicId=${publicId}`,
  //       { method: "DELETE" }
  //     );

  //     if (res.ok) {
  //       console.log("temp photo deleted successfully");
  //     }
  //   } catch (error) {
  //     console.error(`Error deleting temp photo:`, error);
  //   }
  // };

  return (
    <div className="flex flex-col overflow-auto rounded-lg border bg-card p-4">
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
              onClick={() => setOpenAlert(true)}
            >
              <Trash />
              <span className="sr-only">Delete</span>
            </Button>
          )
        }
      />
      <Separator className="my-3" />

      <div className="space-y-2">
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

                {/* <Button
                  type="button"
                  onClick={() => remove(index)}
                  variant="outline"
                >
                  Remove Subcategory
                </Button> */}
              </div>
            ))}

            {/* <Button
              type="button"
              onClick={() =>
                append({
                  name: "",
                  description: "",
                  photos: [],
                })
              }
            >
              Add Subcategory
            </Button> */}

            <div className="flex justify-end gap-4 pt-2">
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/admin/categories");
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
          </form>
        </Form>
      </div>
    </div>
  );
}
