"use client"

import { Campaign, Photo } from "@prisma/client"
import { useEffect, useState, useTransition } from "react"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/ui/loading-button"
import {
  CampaignsSchema,
  CampaignsValues,
} from "@/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { UploadPhoto } from "@/components/ui/upload-photo"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { CloudinaryUploadWidgetResults } from "next-cloudinary"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { cleanUpPhotos } from "@/app/admin/campaigns/[slug]/actions"

interface CampaignsFormProps {
  initialData: (Campaign & { photos: Photo[] }) | null
}

export default function CampaignsForm({
  initialData,
}: CampaignsFormProps) {
  const [error, setError] = useState<string>()
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<CampaignsValues>({
    resolver: zodResolver(CampaignsSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          photos: initialData.photos.map((photo) => ({
            url: photo.url,
            publicId: photo.publicId,
          })),
        }
      : {
          name: "",
          description: "",
          photos: [],
        },
  })

  useEffect(() => {
    const cleanupPhotos = async () => {
      const tempPhotos = JSON.parse(
        localStorage.getItem("tempPhotos") || "[]"
      )

      if (tempPhotos.length > 0) {
        for (const photo of tempPhotos) {
          try {
            const res = await axios.delete(
              `/api/cloudinary?publicId=${photo.publicId}`
            )
            if (res.status !== 200) {
              console.error(
                `Failed to delete photo ${photo.publicId}`
              )
            }
          } catch (error) {
            console.error(`Error deleting photo:`, error)
          }
        }
        localStorage.removeItem("tempPhotos")
      }
    }

    cleanUpPhotos()
  }, [])

  const handleSubmit = async (data: CampaignsValues) => {
    try {
      setError(undefined)
      startTransition(async () => {
        if (initialData) {
          await axios.patch(
            `/api/admin/campaigns/${initialData.slug}`,
            data
          )
        } else {
          await axios.post("/admin/campaigns", data)
        }
        toast({
          title: "Success",
          description: "Campaign saved successfully",
        })
        localStorage.removeItem("tempPhotos")
        router.push("/admin/campaigns")
        router.refresh()
      })
    } catch (error) {
      console.error(`Error saving campaign:`, error)
    }
  }

  const handleCancel = () => {
    router.push("/admin/campaigns")
  }

  const handleUploadPhoto = async (
    result: CloudinaryUploadWidgetResults
  ) => {
    if (result.info && typeof result.info === "object") {
      const { secure_url: url, public_id: publicId } =
        result.info

      const tempPhotos = JSON.parse(
        localStorage.getItem("tempPhotos") || "[]"
      )

      localStorage.setItem(
        "tempPhotos",
        JSON.stringify([...tempPhotos, { url, publicId }])
      )
      form.setValue("photos", [
        ...form.getValues("photos"),
        { url, publicId },
      ])
    }
  }

  const handleRemovePhoto = async (publicId: string) => {
    const updatedPhotos = form
      .getValues("photos")
      .filter((photo) => photo.publicId !== publicId)
    form.setValue("photos", updatedPhotos)

    try {
      const res = await axios.delete(
        `/api/cloudinary?publicId=${publicId}`
      )
      if (res.status !== 200) {
        setError("Failed to delete image")
      }
    } catch (error) {
      console.error(`Error deleting photo:`, error)
    }
  }

  return (
    <div className="flex h-fit w-full flex-col items-center overflow-auto rounded-lg border bg-card p-4">
      <Heading
        title={
          initialData ? "Edit Campaign" : "Create Campaign"
        }
        description={
          initialData
            ? "Edit your campaign"
            : "Create a new campaign"
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
                  <FormLabel>Photo</FormLabel>
                  <FormControl>
                    <UploadPhoto
                      disabled={isPending}
                      value={field.value}
                      onChange={(newPhotos) => {
                        field.onChange(newPhotos)
                      }}
                      onRemove={handleRemovePhoto}
                      onUpload={handleUploadPhoto}
                      max={1}
                      className="w-full"
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
                      disabled={isPending}
                      placeholder="Campaign Description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-4 py-3">
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault()
                  handleCancel()
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
  )
}
