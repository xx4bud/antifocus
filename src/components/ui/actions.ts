"use server"

import { prisma } from "@/lib/prisma"
import { CampaignsSchema } from "@/lib/schemas"
import { generateSlug } from "@/lib/utils"
import axios from "axios"

export async function submitCampaign(data: {
  name: string
  description: string
  photos: {
    url: string
    publicId: string
  }[]
}) {
  try {
    CampaignsSchema.parse(data)

    const { name, description, photos } = data

    if (!name) {
      return {
        success: false,
        message: "Name is required",
      }
    }

    if (!description) {
      return {
        success: false,
        message: "Description is required",
      }
    }

    if (!photos) {
      return {
        success: false,
        message: "Photos is required",
      }
    }

    let campaignSlug = generateSlug(name)

    const existedSlug = await prisma.campaign.findUnique({
      where: { slug: campaignSlug },
    })

    if (existedSlug) {
      campaignSlug = `${campaignSlug}-${Math.floor(Math.random() * 100)}`
    }

    const newCampaign = await prisma.campaign.create({
      data: {
        name,
        description,
        slug: campaignSlug,
        photos: {
          createMany: {
            data: photos.map(
              (photo: {
                url: string
                publicId: string
              }) => ({
                url: photo.url,
                publicId: photo.publicId,
              })
            ),
          },
        },
      },
    })

    return {
      success: true,
      data: newCampaign,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    }
  }
}

export async function updateCampaign(data: {
  id: string
  name: string
  description: string
  photos: {
    url: string
    publicId: string
  }[]
}) {
  try {
    CampaignsSchema.parse(data)

    const { id, name, description, photos } = data

    if (!id) {
      return {
        success: false,
        message: "Campaign not found",
      }
    }

    if (!name) {
      return {
        success: false,
        message: "Name is required",
      }
    }

    if (!description) {
      return {
        success: false,
        message: "Description is required",
      }
    }

    let campaignSlug = generateSlug(name)

    const existedSlug = await prisma.campaign.findUnique({
      where: { slug: campaignSlug },
      include: {
        photos: true
      }
    })

    if (existedSlug) {
      campaignSlug = `${campaignSlug}-${Math.floor(Math.random() * 100)}`
    }

    const existingCampaign =
      await prisma.campaign.findUnique({
        where: { id },
        include: { photos: true },
      })

    if (!existingCampaign) {
      return {
        success: false,
        message: "Campaign not found",
      }
    }

   const existingPhotos = await prisma.photo.findMany({
      where: {
        campaignSlug: existingCampaign.slug
      }
    })

    const publicIds = existingPhotos.map((photo) => photo.publicId)

    const existingPhotoPublicIds = existingCampaign.photos.filter((photo) => {
      return !publicIds.includes(photo.publicId)
    })

    if (existingPhotoPublicIds.length > 0) {
      for (const photo of existingPhotoPublicIds) {
        try {
          const res = await axios.delete(
            `/api/cloudinary?publicId=${photo.publicId}`
          )
          if (res.status !== 200) {
            console.error(
              `Failed to delete photo ${photo}`
            )
          }
        } catch (error) {
          console.error(`Error deleting photo:`, error)
        }
      }
    }

    await prisma.photo.deleteMany({
      where: {
        campaignSlug: existingCampaign.slug
      }
    })

    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: {
        name,
        description,
        slug: campaignSlug,
        photos: {
          // Update atau buat foto baru di Prisma
          deleteMany: {
            NOT: {
              publicId: {
                in: photos.map((photo) => photo.publicId),
              },
            },
          },
          createMany: {
            data: photos.map((photo) => ({
              url: photo.url,
              publicId: photo.publicId,
            })),
          },
        },
      },
    })

    return {
      success: true,
      data: updatedCampaign,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    }
  }
}

export async function deleteCampaign(id: string) {
  try {
    const campaign = await prisma.campaign.findFirst({
      where: { id },
    })

    if (!campaign) {
      return {
        success: false,
        message: "Campaign not found",
      }
    }

    const deletedCampaign = await prisma.campaign.delete({
      where: { id },
    })

    return {
      success: true,
      data: deletedCampaign,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    }
  }
}

export async function cleanUpPhotos() {
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
  return tempPhotos
}
