'use client';
import { CategoryData } from "@/lib/types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { submitCategory, editCategory, deleteCategory } from "./actions";
import { AlertModal } from "@/components/ui/alert-modal";
import { useRouter } from "next/navigation";
import { Heading } from "@/components/ui/heading";
import { Trash } from "lucide-react";
import { CategoryFormSchema, CategoryFormValue } from "@/lib/schemas";
import { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { CloudinaryUpload } from "@/components/ui/cloudinary-upload";

interface CategoryFormProps {
  category: CategoryData | null;
  categories: CategoryData[];
}

export function CategoryForm({ category, categories = [] }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const cleanUpMedia = async () => {
      try {
        const tempMedia = JSON.parse(
          localStorage.getItem("tempMedia") || "[]"
        );
        if (tempMedia.length > 0) {
          for (const media of tempMedia) {
            await fetch(
              `/api/cloudinary?publicId=${media.publicId}`,
              {
                method: "DELETE",
              }
            );
          }
          localStorage.removeItem("tempMedia");
        }
      } catch (err) {
        console.error("Error parsing tempMedia:", err);
      }
    };
    cleanUpMedia();
    return () => {
      cleanUpMedia();
    };
  }, []);

  const form = useForm<CategoryFormValue>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      media:
        category?.media?.map((media) => ({
          format: media.format ?? "",
          url: media.url ?? "",
          publicId: media.publicId ?? "",
          alt: media.alt ?? "",
          order: media.order ?? 0,
          width: media.width ?? 0,
          height: media.height ?? 0,
          size: media.size ?? 0,
          metadata:
            media.metadata &&
            typeof media.metadata === "object" &&
            !Array.isArray(media.metadata)
              ? (media.metadata as {
                  [key: string]: unknown;
                })
              : undefined,
        })) ?? [],
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      description: category?.description ?? "",
      featured: category?.featured ?? false,
      parentId: category?.parentId ?? "",
    },
  });

  const onUpload = async (
    result: CloudinaryUploadWidgetResults
  ) => {
    try {
      if (result.info && typeof result.info === "object") {
        const info = result.info as any;
        const {
          secure_url: url,
          public_id: publicId,
          format,
          bytes: size,
          width,
          height,
          original_filename,
          ...metadata
        } = info;

        const tempMedia = JSON.parse(
          localStorage.getItem("tempMedia") || "[]"
        );

        const newMedia = [
          ...tempMedia,
          { url, publicId, order: tempMedia.length },
        ];
        localStorage.setItem(
          "tempMedia",
          JSON.stringify(newMedia)
        );

        const currentMedia = form.getValues("media") || [];
        const updatedMedia = [
          ...currentMedia,
          {
            format: format?.toUpperCase() || "OTHER",
            url,
            publicId,
            alt:
              `${category?.name || "Category"} ${original_filename}` ||
              `Media ${original_filename}`,
            order: currentMedia.length,
            width: width || 0,
            height: height || 0,
            size: size || 0,
            metadata: metadata || undefined,
          },
        ];

        form.setValue("media", updatedMedia);
        await form.trigger("media");
        toast.success("Media berhasil diunggah");
      }
    } catch (error) {
      console.error("Error uploading media:", error);
      toast.error("Gagal mengunggah media");
    }
  };

  const onRemove = async (publicId: string) => {
    try {
      const currentMedia = form.getValues("media") || [];
      const updatedMedia = currentMedia.filter(
        (media) => media?.publicId !== publicId
      );
      form.setValue("media", updatedMedia);
      await form.trigger("media");
      setMediaToDelete((prev) => [...prev, publicId]);
      toast.success("Media berhasil dihapus");
    } catch (error) {
      console.error("Error removing media:", error);
      toast.error("Gagal menghapus media");
    }
  };

  const onSubmit = async (data: CategoryFormValue) => {
    try {
      setLoading(true);
      if (mediaToDelete.length > 0) {
        for (const publicId of mediaToDelete) {
          await fetch(`/api/cloudinary?publicId=${publicId}`, {
            method: "DELETE",
          });
        }
      }

      if (category) {
        const result = await editCategory(category.id, {
          ...data,
          parentId: data.parentId === "none" ? undefined : data.parentId,
        });
        if (result.success) {
          toast.success("Category updated successfully");
          router.refresh();
          router.push("/admin/category");
        } else {
          toast.error(result.message || "Failed to update category");
        }
      } else {
        const result = await submitCategory({
          ...data,
          parentId: data.parentId === "none" ? undefined : data.parentId,
        });
        if (result.success) {
          toast.success("Category created successfully");
          router.refresh();
          router.push("/admin/category");
        } else {
          toast.error(result.message || "Failed to create category");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      // Reset mediaToDelete after successful submission
      setMediaToDelete([]);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      if (!category) return;

      const result = await deleteCategory(category.id);
      if (result.success) {
        toast.success("Category deleted successfully");
        router.refresh();
        router.push("/admin/category");
      } else {
        toast.error(result.message || "Failed to delete category");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <Heading
        title={category ? `${category.name}` : "Create Category"}
        button={
          category && (
            <Button
              type="button"
              onClick={() => setOpen(true)}
              size={"icon"}
              variant={"destructive"}
            >
              <Trash />
            </Button>
          )
        }
      />
      <div className="flex flex-col py-1">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="media"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media</FormLabel>
                  <FormControl>
                    <CloudinaryUpload
                      value={field.value || []}
                      onChange={(newMedia) => {
                        field.onChange(newMedia);
                        form.trigger("media");
                      }}
                      onRemove={onRemove}
                      onUpload={onUpload}
                      disabled={loading}
                      max={5}
                      resourceType="image"
                      allowedFormats={[
                        "webp",
                        "png",
                        "jpeg",
                        "jpg",
                      ]}
                      maxFileSize={5000000} // 5MB
                      folder="antifocus/categories"
                      multiple={true}
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
                      placeholder="Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Slug"
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
                    <Input
                      placeholder="Description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Featured
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Category</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        {field.value ? categories.find(c => c.id === field.value)?.name || "Select parent" : "Root category"}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Root category</SelectItem>
                        {categories
                          .filter(c => c.id !== category?.id)
                          .map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-4 pt-2">
              <Separator />
              <div className="flex items-center gap-2">
                <Button
                  disabled={loading}
                  className="flex-1"
                  type="submit"
                >
                  {loading ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
      <AlertModal
        loading={loading}
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        title="Apakah Anda yakin?"
        description="Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  );
}
