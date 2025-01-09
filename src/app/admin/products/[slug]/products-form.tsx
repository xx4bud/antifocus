"use client";

import { CategoryData, ProductData } from "@/lib/queries";
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
  ProductsSchema,
  ProductsValues,
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
// import {
//   createCategory,
//   deleteCategory,
//   updateCategory,
// } from "./actions";
import { AlertModal } from "@/components/ui/alert-modal";
import { ProductStatus } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
// import { SubCategoriesForm } from "./subcategories-form";

interface ProductsFormProps {
  product: ProductData | null;
  categories: CategoryData[];
}

export default function ProductsForm({
  product,
  categories,
}: ProductsFormProps) {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [photosToDelete, setPhotosToDelete] = useState<
    string[]
  >([]);
  const [removedVariants, setRemovedVariants] = useState<
    any[]
  >([]);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ProductsValues>({
    resolver: zodResolver(ProductsSchema),
    defaultValues: product
      ? {
          ...product,
          status: product.status || ProductStatus.AVAILABLE,
          price: product.price.toNumber(),
          variants: product.variants.map((variant) => ({
            ...variant,
            price: variant.price.toNumber(),
          })),
        }
      : {
          photos: [],
          name: "",
          description: "",
          categories: [],
          status: ProductStatus.AVAILABLE,
          price: 0,
          stock: 0,
          variants: [],
        },
  });

  const {
    fields: variants,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "variants",
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

  const handleSubmit = async (data: ProductsValues) => {
    console.log(data);
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
        ...form.getValues(`variants.${index}.photos`),
        { url, publicId },
      ];
      form.setValue(
        `variants.${index}.photos`,
        updatedPhotos
      );
      form.trigger(`variants.${index}.photos`);
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
      .getValues(`variants.${index}.photos`)
      .filter((photo) => photo.publicId !== publicId);
    form.setValue(
      `variants.${index}.photos`,
      updatedPhotos
    );
    form.trigger(`variants.${index}.photos`);

    setPhotosToDelete((prev) => [...prev, publicId]);
  };

  const handleAddVariant = () => {
    const lastRemoved = removedVariants.pop();
    const newVariant = lastRemoved || {
      name: "",
      price: 0,
      stock: 0,
      photos: [],
    };

    append(newVariant);
    setRemovedVariants(removedVariants);
  };

  const handleRemoveSubCategory = (index: number) => {
    const removedData = form.getValues(
      `variants.${index}`
    );
    setRemovedVariants((prev) => [
      ...prev,
      removedData,
    ]);
    remove(index);
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-8"
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
                    onUpload={(photo) =>
                      field.onChange([
                        ...field.value,
                        photo,
                      ])
                    }
                    onRemove={(publicId) =>
                      field.onChange(
                        field.value.filter(
                          (p) => p.publicId !== publicId
                        )
                      )
                    }
                    onChange={(newPhotos) =>
                      field.onChange(newPhotos)
                    }
                    max={5}
                    disabled={isLoading}
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
                    disabled={isLoading}
                    placeholder="Product Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isLoading}
                    placeholder="Product Description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categories</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="Product Categories"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <select {...field}>
                    <option value={ProductStatus.AVAILABLE}>
                      Available
                    </option>
                    <option
                      value={ProductStatus.OUT_OF_STOCK}
                    >
                      Out of Stock
                    </option>
                    <option
                      value={ProductStatus.DISCONTINUED}
                    >
                      Discontinued
                    </option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between">
              <Heading title="Variants" />
              <Button
                type="button"
                onClick={() =>
                  append({
                    name: "",
                    price: 0,
                    stock: 0,
                    photos: [],
                  })
                }
              >
                <Plus className="mr-2" />
                Add Variant
              </Button>
            </div>
            {variants.map((variant, index) => (
              <div
                key={variant.id}
                className="mt-4 rounded-lg border p-4"
              >
                <FormField
                  control={form.control}
                  name={`variants.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variant Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Variant name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Additional fields for variant */}
              </div>
            ))}
          </div>
        </form>
      </Form>
    </div>
  );
}
