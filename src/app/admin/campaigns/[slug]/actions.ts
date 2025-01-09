"use server";

import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import {
  getCampaignDataInclude,
  getSession,
} from "@/lib/queries";
import { CampaignsSchema } from "@/lib/schemas";
import { slugify } from "@/lib/utils";
import { revalidatePath, revalidateTag } from "next/cache";

export async function createCampaign(data: {
  name: string;
  description: string;
  photos: { url: string; publicId: string }[];
}) {
  try {
    // permissions
    const session = await getSession();
    const admin = session?.user.role === "ADMIN";

    if (!admin) {
      return {
        success: false,
        message: "You are not authorized",
      };
    }

    // validate input data
    CampaignsSchema.parse(data);
    const { name, description, photos } = data;

    if (!name || !description || !photos) {
      return {
        success: false,
        message: "All campaign fields are required",
      };
    }

    // existing campaign slug
    let campaignSlug = slugify(name);
    const existingCampaignsSlug =
      await prisma.campaign.findUnique({
        where: {
          slug: campaignSlug,
        },
      });
    if (existingCampaignsSlug) {
      return {
        success: false,
        message: `Campaign slug "${campaignSlug}" already exists`,
      };
    }

    // create campaign
    const newCampaign = await prisma.campaign.create({
      data: {
        slug: campaignSlug,
        name,
        description,
        photos: {
          create: photos.map((photo) => ({
            url: photo.url,
            publicId: photo.publicId,
          })),
        },
      },
    });

    revalidatePath("/");
    revalidateTag("campaigns");

    return {
      success: true,
      data: newCampaign,
    };
  } catch (error: any) {
    console.error("Error creating campaign:", error);
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
  photos: { url: string; publicId: string }[];
}) {
  try {
    // permissions
    const session = await getSession();
    const admin = session?.user.role === "ADMIN";

    if (!admin) {
      return {
        success: false,
        message: "You are not authorized",
      };
    }

    // validate input data
    CampaignsSchema.parse(data);
    const {
      id: campaignId,
      name,
      description,
      photos,
    } = data;

    if (!campaignId) {
      return {
        success: false,
        message: "Campaign ID is required",
      };
    }

    if (!name || !description || !photos) {
      return {
        success: false,
        message: "All campaign fields are required",
      };
    }

    // existing campaign
    const existingCampaign =
      await prisma.campaign.findUnique({
        where: {
          id: campaignId,
        },
        include: getCampaignDataInclude(),
      });

    if (!existingCampaign) {
      return {
        success: false,
        message: "Campaign not found",
      };
    }

    // delete old photos
    const currentPhotos = existingCampaign.photos.map(
      (photo) => photo.publicId
    );
    const newPhotos = photos.map((photo) => photo.publicId);
    const photosToDelete = currentPhotos.filter(
      (photo) => !newPhotos.includes(photo)
    );
    for (const publicId of photosToDelete) {
      await cloudinary.v2.uploader.destroy(publicId);
    }

    await prisma.photo.deleteMany({
      where: {
        campaignId,
      },
    });

    // update campaign
    const updatedCampaign = await prisma.campaign.update({
      where: {
        id: campaignId,
      },
      data: {
        name,
        description,
        photos: {
          create: photos.map((photo) => ({
            url: photo.url,
            publicId: photo.publicId,
          })),
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
    console.error("Error updating campaign:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function deleteCampaign(campaignId: string) {
  try {
    // permissions
    const session = await getSession();
    const admin = session?.user.role === "ADMIN";

    if (!admin) {
      return {
        success: false,
        message: "You are not authorized",
      };
    }

    // validate input data
    if (!campaignId) {
      return {
        success: false,
        message: "Campaign ID is required",
      };
    }

    // existing campaign
    const existingCampaign =
      await prisma.campaign.findUnique({
        where: {
          id: campaignId,
        },
        include: getCampaignDataInclude(),
      });

    if (!existingCampaign) {
      return {
        success: false,
        message: "Campaign not found",
      };
    }

    // delete all photos
    for (const photo of existingCampaign.photos) {
      await cloudinary.v2.uploader.destroy(photo.publicId);
    }
    await prisma.photo.deleteMany({
      where: {
        campaignId,
      },
    });

    // delete campaign
    await prisma.campaign.delete({
      where: {
        id: campaignId,
      },
    });

    revalidatePath("/");
    revalidateTag("campaigns");

    return {
      success: true,
      message: "Campaign deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting campaign:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}
