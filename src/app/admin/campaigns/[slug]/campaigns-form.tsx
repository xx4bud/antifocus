"use client";

import { CampaignData } from "@/lib/queries";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CampaignsSchema,
  CampaignsValues,
} from "@/lib/schemas";
import { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { AlertModal } from "@/components/ui/alert-modal";
import { Heading } from "@/components/ui/heading";
import { LoadingButton } from "@/components/ui/loading-button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UploadPhoto } from "@/components/ui/upload-photo";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  createCampaign,
  deleteCampaign,
  updateCampaign,
} from "./actions";

interface CampaignsFormProps {
  campaign: CampaignData | null;
}
export default function CampaignsForm({
  campaign,
}: CampaignsFormProps) {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [photosToDelete, setPhotosToDelete] = useState<
    string[]
  >([]);
  const router = useRouter();
  const { toast } = useToast();

  // Form Register
  const form = useForm<CampaignsValues>({
    resolver: zodResolver(CampaignsSchema),
    defaultValues: campaign
      ? {
          ...campaign,
        }
      : {
          photos: [],
          name: "",
          description: "",
        },
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

  const handleSubmit = async (data: CampaignsValues) => {
    setError(undefined);
    setIsLoading(true);
    let res;
    if (campaign) {
      res = await updateCampaign({
        ...data,
        id: campaign.id,
      });
    } else {
      res = await createCampaign(data);
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
        title: "Success",
        description: campaign
          ? "Campaign updated successfully"
          : "Campaign created successfully",
      });
      localStorage.removeItem("tempPhotos");
      router.push("/admin/campaigns");
      router.refresh();
    } else {
      setError(res.message);
    }
    setIsLoading(false);
  };

  const handleDeleteConfirm = async () => {
    setOpenAlert(false);
    handleDelete();
  };

  const handleDelete = async () => {
    setError(undefined);
    setIsDeleting(true);
    if (!campaign) return;

    const res = await deleteCampaign(campaign.id);

    if (res.success) {
      toast({
        title: "Success",
        description: "Campaign deleted successfully",
      });
      router.push("/admin/campaigns");
      router.refresh();
    } else {
      setError(res.message);
    }
    setIsDeleting(false);
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
      <AlertModal
        open={openAlert}
        title="Are you sure?"
        description="This action cannot be undone. It will permanently delete the campaign."
        loading={isDeleting}
        onClose={() => setOpenAlert(false)}
        onConfirm={handleDeleteConfirm}
      />

      <div className="flex h-full w-full flex-col rounded-lg border bg-card p-4">
        <Heading
          title={
            campaign ? "Edit Campaign" : "Create Campaign"
          }
          description={
            campaign
              ? "Edit campaign details"
              : "Create a new campaign"
          }
          button={
            campaign && (
              <LoadingButton
                variant="destructive"
                size="icon"
                onClick={() => setOpenAlert(true)}
                disabled={isDeleting}
                loading={isDeleting}
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
                        type="text"
                        disabled={isLoading}
                        placeholder="Campaign Name"
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
                        placeholder="Campaign Description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col">
                <Separator className="my-4 mt-2" />
                <div className="flex items-center justify-end gap-4">
                  <Button
                    variant="outline"
                    disabled={isLoading}
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/admin/campaigns");
                    }}
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    type="submit"
                    disabled={isLoading}
                    loading={isLoading}
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
  );
}
