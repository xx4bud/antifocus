"use server";

import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/queries";
import { slugify } from "@/lib/utils";

export async function createCategory(data: {
  name: string;
  description: string;
  photos: { url: string; publicId: string }[];
}) {
  try {
    const session = await getSession();
    const admin = session?.user.role === "ADMIN";

    if (!admin) {
      return {
        success: false,
        message:
          "You are not authorized to create a category",
      };
    }

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
        message: "At least one image is required",
      };
    }

    let slug = slugify(name);
    const existedSlug = await prisma.category.findFirst({
      where: { slug },
    });
    if (existedSlug) {
      slug = `${slug}${Math.floor(Math.random() * 100)}`;
    }

    const newCategory = await prisma.category.create({
      data: {
        slug,
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

    console.log(JSON.stringify(newCategory, null, 2));
    return {
      success: true,
      data: newCategory,
    };
  } catch (error: any) {
    console.error(JSON.stringify(error, null, 2));
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function updateCategory(data: {
  id: string;
  name: string;
  description: string;
  photos: { url: string; publicId: string }[];
}) {
  try {
    const session = await getSession();
    const admin = session?.user.role === "ADMIN";

    if (!admin) {
      return {
        success: false,
        message:
          "You are not authorized to update the category",
      };
    }

    const { id, name, description, photos } = data;

    // Validate input data
    if (!id) {
      return {
        success: false,
        message: "Category ID is required",
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
        message: "At least one image is required",
      };
    }

    let slug = slugify(name);
    const existedSlug = await prisma.category.findFirst({
      where: { slug, NOT: { id } }, // Ensure slug is unique, excluding the current category
    });
    if (existedSlug) {
      slug = `${slug}${Math.floor(Math.random() * 100)}`;
    }

    // Get existing photos from the database
    const existingCategory =
      await prisma.category.findUnique({
        where: { id },
        include: { photos: true },
      });

    if (!existingCategory) {
      return {
        success: false,
        message: "Category not found",
      };
    }

    const existingPhotos = existingCategory.photos;
    const newPublicIds = photos.map(
      (photo) => photo.publicId
    );
    const photosToDelete = existingPhotos.filter(
      (photo) => !newPublicIds.includes(photo.publicId)
    );

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        slug,
        name,
        description,
        photos: {
          deleteMany: {
            id: {
              in: photosToDelete.map((photo) => photo.id),
            },
          },
          create: photos
            .filter(
              (photo) =>
                !existingPhotos.some(
                  (existing) =>
                    existing.publicId === photo.publicId
                )
            )
            .map((photo) => ({
              url: photo.url,
              publicId: photo.publicId,
            })),
        },
      },
      include: { photos: true },
    });

    for (const photo of photosToDelete) {
      try {
        await cloudinary.v2.uploader.destroy(
          photo.publicId
        );
      } catch (error) {
        console.error(
          `Failed to delete photo from Cloudinary: ${photo.publicId}`,
          error
        );
      }
    }

    console.log(JSON.stringify(updatedCategory, null, 2));
    return {
      success: true,
      data: updatedCategory,
    };
  } catch (error: any) {
    console.error(JSON.stringify(error, null, 2));
    return {
      success: false,
      message:
        "An error occurred while updating the category",
      error: error.message,
      data,
    };
  }
}
