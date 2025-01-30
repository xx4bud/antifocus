"use client";

import { CampaignData } from "@/types";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CampaignsSchema,
  CampaignsValues,
} from "@/lib/validation";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { PhotoUpload } from "@/components/ui/photo-upload";
import { LoadingButton } from "@/components/ui/loading-button";

interface CampaignsFormProps {
  campaign: CampaignData | null;
}

export function CampaignsForm({
  campaign,
}: CampaignsFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string>();
  const [photosToDelete, setPhotosToDelete] =
    React.useState<string[]>([]);

  const form = useForm<CampaignsValues>({
    resolver: zodResolver(CampaignsSchema),
    defaultValues: campaign
      ? {
          ...campaign,
          photos: campaign.photos.map((photo) => ({
            url: photo.url,
            publicId: photo.publicId ?? undefined,
            isCover: photo.isCover,
          })),
        }
      : {
          photos: [],
          name: "",
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

  const onSubmit = async (values: CampaignsValues) => {
    console.log(values);
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

  const handleRemovePhoto = async (publicId: string) => {
    const updatedPhotos = form
      .getValues("photos")
      .filter((photo) => photo.publicId !== publicId);
    form.setValue("photos", updatedPhotos);
    form.trigger("photos");

    setPhotosToDelete((prev) => [...prev, publicId]);
  };

  return (
    <>
      <div className="grid grid-cols-1 px-4 py-2">
        <Heading
          title="Campaigns"
          description="Manage our campaigns"
        />
        <Separator className="my-4" />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
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
                      value={field.value}
                      _onChange={(newPhotos) =>
                        field.onChange(newPhotos)
                      }
                      onRemove={handleRemovePhoto}
                      onUpload={handleUploadPhoto}
                      disabled={isLoading}
                      className="w-full"
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
                      placeholder="Enter campaign name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-1 flex-col gap-4 pt-2">
              <Separator className="my-2" />
              <LoadingButton
                type="submit"
                loading={isLoading}
              >
                Save
              </LoadingButton>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
