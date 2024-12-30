"use server";

import { prisma } from "@/lib/prisma";
import { CategoriesSchema } from "@/lib/schemas";
import { slugify } from "@/lib/utils";
import { cloudinary } from "@/lib/cloudinary";
import { revalidatePath, revalidateTag } from "next/cache";

export async function submitCategory(data: {
  name: string;
  photos: {
    url: string;
    publicId: string;
  }[];
  subCategories: {
    name: string;
    description: string;
  }[];
}) {
  try {
    CategoriesSchema.parse(data); // Ensure the data matches the schema

    const { name, photos, subCategories } = data;

    if (!name) {
      return {
        success: false,
        message: "Name is required",
      };
    }

    if (!photos || photos.length === 0) {
      return {
        success: false,
        message: "Photos are required",
      };
    }

    let categorySlug = slugify(name);

    const existingSlug = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (existingSlug) {
      categorySlug = `${categorySlug}-${Math.floor(Math.random() * 100)}`;
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        slug: categorySlug,
        photos: {
          createMany: {
            data: photos.map((photo) => ({
              url: photo.url,
              publicId: photo.publicId,
            })),
          },
        },
        subCategories: {
          createMany: {
            data: subCategories.map((subCategory) => ({
              name: subCategory.name,
              description: subCategory.description,
              slug: slugify(subCategory.name),
            })),
          },
        },
      },
    });

    return {
      success: true,
      data: newCategory,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function updateCategory(data: {
  id: string;
  name: string;
  photos: {
    url: string;
    publicId: string;
  }[];
  subCategories: {
    name: string;
    description: string;
  }[];
}) {
  try {
    CategoriesSchema.parse(data); // Ensure the data matches the schema

    const { id, name, photos, subCategories } = data;

    if (!id) {
      return {
        success: false,
        message: "Category not found",
      };
    }

    if (!name) {
      return {
        success: false,
        message: "Name is required",
      };
    }

    if (!photos || photos.length === 0) {
      return {
        success: false,
        message: "Photos are required",
      };
    }

    const existingCategory =
      await prisma.category.findUnique({
        where: { id },
        include: { photos: true, subCategories: true },
      });

    if (!existingCategory) {
      return {
        success: false,
        message: "Category not found",
      };
    }

    let categorySlug = slugify(name);

    const existingSlug = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (existingSlug && existingSlug.id !== id) {
      categorySlug = `${categorySlug}-${Math.floor(Math.random() * 100)}`;
    }

    const currentPhotoPublicIds =
      existingCategory.photos.map(
        (photo) => photo.publicId
      );
    const photoIds = photos.map((photo) => photo.publicId);
    const photosToDelete = currentPhotoPublicIds.filter(
      (photo) => !photoIds.includes(photo)
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
        categorySlug: existingCategory.slug,
      },
    });

    await prisma.subCategory.deleteMany({
      where: {
        categorySlug: existingCategory.slug,
      },
    });

    for (const subCategory of subCategories) {
      await prisma.subCategory.upsert({
        where: {
          slug: slugify(subCategory.name),
        },
        update: {
          description: subCategory.description,
          categorySlug: existingCategory.slug,
        },
        create: {
          categorySlug: existingCategory.slug,
          name: subCategory.name,
          description: subCategory.description,
          slug: slugify(subCategory.name),
        },
      });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug: categorySlug,
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
    revalidateTag("categories");

    return {
      success: true,
      data: updatedCategory,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function deleteCategory(id: string) {
  try {
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

    for (const { publicId } of existingCategory.photos) {
      try {
        await cloudinary.v2.uploader.destroy(publicId);
      } catch (error) {
        console.error(`Error deleting photo:`, error);
      }
    }

    const deletedCategory = await prisma.category.delete({
      where: { id },
    });

    return {
      success: true,
      data: deletedCategory,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}
