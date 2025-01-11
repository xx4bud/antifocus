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
import { Plus, Trash, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { ProductStatus } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubCategoriesSelect } from "./subcategories-select";
import { AlertModal } from "@/components/ui/alert-modal";
import { VariantsForm } from "./variants-form";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "./actions";
import { superjson } from "@/lib/prisma";

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
          price: product?.price.toNumber(),
          stock: product?.stock,
          variants: product?.variants?.map((variant) => ({
            ...variant,
            price: variant.price.toNumber(),
          })),
        }
      : {
          name: "",
          photos: [],
          description: "",
          subCategories: [],
          status: ProductStatus.AVAILABLE,
          price: 0,
          stock: 0,
          variants: []
        },
  });

  // console.log("defaultValues", form.getValues());

  const handleSubmit = async (data: any) => {
    setError(undefined);
    setIsLoading(true);
    try {
      let res;
      // console.log("data", data);
      if (product) {
        res = await updateProduct({
          ...data,
          id: product.id,
        });
        toast({
          title: "Product updated successfully.",
        });
      } else {
        res = await createProduct(data);
        toast({
          title: "Product created successfully.",
        });
      }
      if (res.success) {
        // console.log("res", res);
        router.refresh()
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    console.log("handleDelete");
  }

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

  const {
    fields: variants,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "variants",
  });

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

  const handleUploadVariantPhoto = (
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

  const handleRemoveVariantPhoto = async (
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

  const handleRemoveVariant = (index: number) => {
    const removedData = form.getValues(`variants.${index}`);
    setRemovedVariants((prev) => [...prev, removedData]);
    remove(index);
  };

  const formattedCategories = categories.map(
    (category) => ({
      label: category.name,
      value: category.id,
      subCategories: category.subCategories.map(
        (subCategory) => ({
          label: subCategory.name,
          value: subCategory.id,
        })
      ),
    })
  );

  return (
    <>
     <AlertModal
        open={openAlert}
        title="Are you sure?"
        description="This action cannot be undone. It will permanently delete the product and its variants."
        loading={isLoading}
        onClose={() => setOpenAlert(false)}
        onConfirm={handleDelete}
      />
       <div className="flex h-full w-full flex-col rounded-lg border bg-card p-4">
        <Heading
          title={
            product ? "Edit Product" : "Create Product"
          }
          description={
            product
              ? "Edit product details"
              : "Create a new product"
          }
          button={
            product && (
              <LoadingButton
                variant="destructive"
                size="icon"
                onClick={() => setOpenAlert(true)}
                disabled={isLoading}
                loading={isLoading}
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
                        max={5}
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
                name="subCategories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategories</FormLabel>
                    <FormControl>
                      <SubCategoriesSelect
                        disabled={isLoading}
                        value={field.value || []}
                        onChange={field.onChange}
                        categories={formattedCategories}
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
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent side="top">
                          {Object.values(ProductStatus).map(
                            (status) => (
                              <SelectItem
                                key={status}
                                value={status}
                              >
                                {status
                                  .replace(/_/g, " ")
                                  .toLowerCase()
                                  .replace(
                                    /^(\w)/,
                                    (match) =>
                                      match.toUpperCase()
                                  )}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {variants.length === 0 && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Product Price"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Product Stock"
                            disabled={
                              isLoading ||
                              form.watch("status") ===
                                "ARCHIVED"
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {variants.map((field, index) => (
                <VariantsForm
                  key={field.id}
                  index={index}
                  onRemove={() =>
                    handleRemoveVariant(index)
                  }
                  onUploadPhoto={handleUploadVariantPhoto}
                  onRemovePhoto={handleRemoveVariantPhoto}
                  loading={isLoading}
                />
              ))}

              <div className="flex flex-col pt-1">
                <Button
                  type="button"
                  onClick={handleAddVariant}
                  disabled={isLoading}
                >
                  <Plus />
                  Add Variant
                </Button>

                <Separator className="my-4" />
                <div className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    disabled={isLoading}
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/admin/products");
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
  )
}
