import { cloudinary } from "@/lib/cloudinary"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { CloudinaryUploadWidgetResults } from "next-cloudinary"
import { UseFormReturn } from "react-hook-form"

// Define the Photo interface
interface Photo {
  publicId: string
  url: string
}

interface DeleteResponse {
  message: string
  error?: string
}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    paramsToSign: Record<string, string>
  }
  const { paramsToSign } = body

  const signature = cloudinary.v2.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET as string
  )

  return Response.json({ signature })
}

export async function DELETE(req: Request): Promise<NextResponse<DeleteResponse>> {
  try {
    const { searchParams } = new URL(req.url)
    const publicId = searchParams.get("publicId")

    if (!publicId) {
      return NextResponse.json(
        { message: "Public ID is required" },
        { status: 400 }
      )
    }
    // Delete photo from Cloudinary
    await cloudinary.v2.uploader.destroy(publicId)

    // Delete photo from database
    await prisma.photo.deleteMany({ where: { publicId } })

    return NextResponse.json(
      { message: "Photo deleted" },
      { status: 200 }
    )
  } catch (error: any) {
    console.error(error)
    return NextResponse.json(
      { message: "An error occurred", error: error.message },
      { status: 500 }
    )
  }
}

export async function handleUploadPhoto(
  result: CloudinaryUploadWidgetResults,
  form: UseFormReturn<any>
): Promise<void> {
  if (result.info && typeof result.info === "object") {
    const { secure_url: url, public_id: publicId } = result.info

    const tempPhotos = JSON.parse(
      localStorage.getItem("tempPhotos") || "[]"
    ) as Photo[]

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

export async function handleRemovePhoto(
  publicId: string,
  form: UseFormReturn<any>, 
  setError: (message: string) => void,
  photos: Photo[]
): Promise<void> {
  const updatedPhotos = form
    .getValues("photos")
    .filter((photo: Photo) => photo.publicId !== publicId)

  form.setValue("photos", updatedPhotos)

  try {
    const response = await fetch(
      `/api/cloudinary?publicId=${encodeURIComponent(publicId)}`,
      {
        method: "DELETE",
      }
    )

    if (!response.ok) {
      setError("Failed to delete image")
    }
  } catch (error) {
    console.error(`Error deleting photo:`, error)
    setError("Failed to delete image")
  }
}

export async function cleanUpPhotos(
  publicId: string,
  form: UseFormReturn<any>,
  setError: (message: string) => void,
  photos: Photo[]
): Promise<void> {
  const tempPhotos = JSON.parse(
    localStorage.getItem("tempPhotos") || "[]"
  ) as Photo[]

  if (tempPhotos.length > 0) {
    for (const photo of tempPhotos) {
      try {
        const response = await fetch(
          `/api/cloudinary?publicId=${encodeURIComponent(photo.publicId)}`,
          {
            method: "DELETE",
          }
        )

        if (!response.ok) {
          setError("Failed to delete image")
        }
      } catch (error) {
        console.error(`Error deleting photo:`, error)
      }
    }
    localStorage.removeItem("tempPhotos")
  }
}
