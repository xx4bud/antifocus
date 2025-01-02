"use server";

import { prisma } from "@/lib/prisma";
import { CampaignsSchema } from "@/lib/schemas";
import { slugify } from "@/lib/utils";
import { cloudinary } from "@/lib/cloudinary";
import { revalidatePath, revalidateTag } from "next/cache";

export async function submitCampaign(data: {
  name: string;
  description: string;
  photos: {
    url: string;
    publicId: string;
  }[];
}) {
  try {
    CampaignsSchema.parse(data);

    const { name, description, photos } = data;

    if (!name) {
      return {
        success: false,
        message: "Name is required",
      };
    }

    if (!description) {
      return {
        success: false,
        message: "Description is required",
      };
    }

    if (!photos || photos.length === 0) {
      return {
        success: false,
        message: "Photos is required",
      };
    }

    let campaignSlug = slugify(name);

    const existedSlug = await prisma.campaign.findUnique({
      where: { slug: campaignSlug },
    });

    if (existedSlug) {
      campaignSlug = `${campaignSlug}-${Math.floor(Math.random() * 100)}`;
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
                url: string;
                publicId: string;
              }) => ({
                url: photo.url,
                publicId: photo.publicId,
              })
            ),
          },
        },
      },
    });

    return {
      success: true,
      data: newCampaign,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function updateCampaign(data: {
  id: string;
  name: string;
  description: string;
  photos: {
    url: string;
    publicId: string;
  }[];
}) {
  try {
    CampaignsSchema.parse(data);

    const { id, name, description, photos } = data;

    if (!id) {
      return {
        success: false,
        message: "Campaign not found",
      };
    }

    if (!name) {
      return {
        success: false,
        message: "Name is required",
      };
    }

    if (!description) {
      return {
        success: false,
        message: "Description is required",
      };
    }

    if (!photos || photos.length === 0) {
      return {
        success: false,
        message: "Photos is required",
      };
    }

    const existingCampaign =
      await prisma.campaign.findUnique({
        where: { id },
        include: { photos: true },
      });

    if (!existingCampaign) {
      return {
        success: false,
        message: "Campaign not found",
      };
    }

    let campaignSlug = slugify(name);

    const existedSlug = await prisma.campaign.findUnique({
      where: { slug: campaignSlug },
      include: {
        photos: true,
      },
    });

    if (existedSlug && existedSlug.id !== id) {
      campaignSlug = `${campaignSlug}-${Math.floor(Math.random() * 100)}`;
    }

    const currentPhotoPublicIds =
      existingCampaign.photos.map(
        (photo) => photo.publicId
      );
    const photoIds = photos.map((photo) => photo.publicId);
    const photosToDelete = currentPhotoPublicIds.filter(
      (photo) => {
        return !photoIds.includes(photo);
      }
    );

    if (photosToDelete.length > 0) {
      for (const publicId of photosToDelete) {
        try {
          await cloudinary.v2.uploader.destroy(publicId);
        } catch (error) {
          console.error(`Error deleting photo:`, error);
        }
      }
    }

    await prisma.photo.deleteMany({
      where: {
        campaignSlug: existingCampaign.slug,
      },
    });

    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: {
        name,
        description,
        slug: campaignSlug,
        photos: {
          deleteMany: {
            NOT: {
              publicId: {
                in: currentPhotoPublicIds,
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
    });

    revalidatePath("/");
    revalidateTag("campaigns");

    return {
      success: true,
      data: updatedCampaign,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function deleteCampaign(id: string) {
  try {
    const existingCampaign =
      await prisma.campaign.findUnique({
        where: { id },
        include: { photos: true },
      });

    if (!existingCampaign) {
      return {
        success: false,
        message: "Campaign not found",
      };
    }

    for (const { publicId } of existingCampaign.photos) {
      try {
        await cloudinary.v2.uploader.destroy(publicId);
      } catch (error) {
        console.error(`Error deleting photo:`, error);
      }
    }

    const deletedCampaign = await prisma.campaign.delete({
      where: { id },
    });

    return {
      success: true,
      data: deletedCampaign,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}
