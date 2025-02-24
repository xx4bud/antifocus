"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  MediaFormSchema,
  MediaFormValue,
} from "@/lib/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/ui/alert-modal";
import { CloudinaryUpload } from "@/components/ui/cloudinary-upload";
import { Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { Media } from "@prisma/client";
import {
  submitMedia,
  editMedia,
  deleteMedia,
} from "./actions";

interface MediaFormProps {
  media: Media | null;
}

export function MediaForm({ media }: MediaFormProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<
    string[]
  >([]);
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

  const form = useForm<MediaFormValue>({
    resolver: zodResolver(MediaFormSchema),
    defaultValues: {
      media: media
        ? {
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
          }
        : undefined,
    },
  });

  // const formState = form.formState;
  // console.log("Form State after upload:", {
  //   values: form.getValues(),
  //   errors: formState.errors,
  //   isDirty: formState.isDirty,
  //   dirtyFields: formState.dirtyFields,
  //   touchedFields: formState.touchedFields,
  // });

  const onUpload = async (
    result: CloudinaryUploadWidgetResults
  ) => {
    try {
      if (!result.info || typeof result.info !== "object") {
        throw new Error("Invalid upload result");
      }

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
      const newTempMedia = [
        ...tempMedia,
        { url, publicId },
      ];
      localStorage.setItem(
        "tempMedia",
        JSON.stringify(newTempMedia)
      );

      const updatedMedia = {
        format: format?.toUpperCase() || "",
        url,
        publicId,
        alt: original_filename || "Media",
        order: 0,
        width: width || 0,
        height: height || 0,
        size: size || 0,
        metadata:
          typeof metadata === "object" &&
          !Array.isArray(metadata)
            ? (metadata as Record<string, unknown>)
            : undefined,
      };

      form.setValue("media", updatedMedia);
      await form.trigger("media");
      toast.success("Media berhasil diunggah");
    } catch (error) {
      console.error("Error uploading media:", error);
      toast.error("Gagal mengunggah media");
    }
  };

  const onRemove = async (publicId: string) => {
    try {
      form.setValue("media", null);
      setMediaToDelete((prev) => [...prev, publicId]);
      const tempMedia = JSON.parse(
        localStorage.getItem("tempMedia") || "[]"
      );
      const updatedTempMedia = tempMedia.filter(
        (item: any) => item.publicId !== publicId
      );
      localStorage.setItem(
        "tempMedia",
        JSON.stringify(updatedTempMedia)
      );
      await form.trigger("media");
      toast.success("Media berhasil dihapus");
    } catch (error) {
      console.error("Error removing media:", error);
      toast.error("Gagal menghapus media");
    }
  };

  const onSubmit = async (data: MediaFormValue) => {
    try {
      setLoading(true);
      if (mediaToDelete.length > 0) {
        for (const publicId of mediaToDelete) {
          await fetch(
            `/api/cloudinary?publicId=${publicId}`,
            {
              method: "DELETE",
            }
          );
        }
      }
      const result = media
        ? await editMedia(media.id, data)
        : await submitMedia(data);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      localStorage.removeItem("tempMedia");
      setMediaToDelete([]);
      toast.success(
        media
          ? "Media berhasil diperbarui"
          : "Media berhasil dibuat"
      );
      router.push("/admin/media");
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        "Terjadi kesalahan saat menyimpan data media"
      );
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      if (!media?.id) {
        toast.error("ID media tidak valid");
        return;
      }
      const result = await deleteMedia(media.id);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success("Media berhasil dihapus");
      router.push("/admin/media");
      router.refresh();
    } catch (error) {
      console.error("Error deleting media:", error);
      toast.error("Terjadi kesalahan saat menghapus media");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <Heading
        title={media ? "Edit Media" : "Create Media"}
        button={
          media && (
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
                      value={
                        field.value ? [field.value] : []
                      }
                      onChange={(newMedia) => {
                        field.onChange(newMedia[0]);
                        form.trigger("media");
                      }}
                      onRemove={onRemove}
                      onUpload={onUpload}
                      disabled={loading}
                      max={1}
                      resourceType="image"
                      allowedFormats={[
                        "webp",
                        "png",
                        "jpeg",
                        "jpg",
                      ]}
                      maxFileSize={5000000} // 5MB
                      folder="antifocus/media"
                      multiple={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="media.alt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alt Text</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan teks alternatif untuk media"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="media.order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Masukkan urutan tampilan (0 untuk sampul)"
                      {...field}
                      disabled={loading}
                      min={0}
                    />
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
