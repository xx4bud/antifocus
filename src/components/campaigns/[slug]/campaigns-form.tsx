"use client"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Campaign, Photo } from "@prisma/client"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  CampaignsSchema,
  CampaignsValues,
} from "@/lib/schemas"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/ui/loading-button"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
  deleteCampaign,
  submitCampaign,
  updateCampaign,
} from "./actions"
import { Trash } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { UploadPhoto } from "@/components/ui/upload-photo"
import axios from "axios"
import { CloudinaryUploadWidgetResults } from "next-cloudinary"

interface CampaignsFormProps {
  campaign: (Campaign & { photos: Photo[] }) | null
}

export default function CampaignsForm({
  campaign,
}: CampaignsFormProps) {
  const [error, setError] = useState<string>()
  const [openAlert, setOpenAlert] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<CampaignsValues>({
    resolver: zodResolver(CampaignsSchema),
    defaultValues: campaign
      ? {
          ...campaign,
        }
      : {
          name: "",
          description: "",
          photos: [],
        },
  })

  useEffect(() => {
    const cleanUpPhotos = async () => {
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
    setError(undefined)
    startTransition(async () => {
      console.log(data)
      let res
      if (campaign) {
        res = await updateCampaign({
          id: campaign!.id,
          ...data,
        })
      } else {
        res = await submitCampaign({
          ...data,
          photos: data.photos.map((photo) => ({
            url: photo.url,
            publicId: photo.publicId,
          })),
        })
      }
      if (res.success) {
        toast({
          title: "Success",
          description: campaign
            ? "Campaign updated successfully"
            : "Campaign created successfully",
        })
        localStorage.removeItem("tempPhotos")
        router.push("/admin/campaigns")
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: res.message,
        })
      }
    })
  }

  const handleDelete = async () => {
    setError(undefined)
    setOpenAlert(false)
    startTransition(async () => {
      const res = await deleteCampaign(
        campaign!.id,
        campaign!.photos.map((photo) => ({
          url: photo.url,
          publicId: photo.publicId,
        }))
      )
      if (res.success) {
        toast({
          title: "Success",
          description: "Campaign deleted successfully",
        })
        localStorage.removeItem("tempPhotos")
        router.push("/admin/campaigns")
        router.refresh()
      } else {
        setError(res.message)
      }
    })
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
          campaign ? "Edit Campaign" : "Create Campaign"
        }
        description={
          campaign
            ? "Edit your campaign"
            : "Create a new campaign"
        }
        button={
          campaign && (
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
                      onChange={(newPhotos) => {
                        field.onChange(newPhotos)
                      }}
                      onRemove={handleRemovePhoto}
                      onUpload={handleUploadPhoto}
                      max={1}
                      disabled={isPending}
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
                  router.push("/admin/campaigns")
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
        <AlertDialog
          open={openAlert}
          onOpenChange={setOpenAlert}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => setOpenAlert(false)}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isPending}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}