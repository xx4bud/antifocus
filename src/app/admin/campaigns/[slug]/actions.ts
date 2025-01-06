"use server";

import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import {
  getCampaignDataInclude,
  getSession,
} from "@/lib/queries";
import { slugify } from "@/lib/utils";
import { revalidatePath, revalidateTag } from "next/cache";

export async function create(data: {
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

    if (photos.length === 0) {
      return {
        success: false,
        message: "At least one photo is required",
      };
    }

    // Create campaign slug
    let campaignSlug = slugify(name);
    const existingCampaigns =
      await prisma.campaign.findMany({
        where: {
          slug: campaignSlug,
        },
      });
    if (existingCampaigns) {
      return {
        success: false,
        message: "Campaign slug already exists",
      };
    }

    // Create campaign
    const campaign = await prisma.campaign.create({
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
      include: getCampaignDataInclude(),
    });
  } catch (error: any) {
    console.error("Error creating campaign:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}
