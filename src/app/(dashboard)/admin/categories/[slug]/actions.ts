"use server";

import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { getSession, slugify } from "@/lib/utils";
import {
  CategorySchema,
  CategoryValues,
} from "@/schemas/category.schemas";
import { getCategoryDataInclude } from "@/types";
import { revalidatePath, revalidateTag } from "next/cache";

export async function submitCategory(data: CategoryValues) {
  try {
    const session = await getSession();
    const admin = session?.user.role === "ADMIN";

    if (!admin) {
      return {
        success: false,
        message:
          "You are not authorized to perform this action.",
      };
    }

    const validated = CategorySchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        message: validated.error.message,
      };
    }
    const { name, photos } = validated.data;

    if (!name || !photos) {
      return {
        success: false,
        message: "This fields are required",
      };
    }

    const categorySlug = slugify(name);
    const existingCategorySlug =
      await prisma.category.findUnique({
        where: { slug: categorySlug },
      });

    if (existingCategorySlug) {
      return {
        success: false,
        message: `Category slug "${categorySlug}" already exists`,
      };
    }

    const newCategory = await prisma.category.create({
      data: {
        slug: categorySlug,
        name,
        photos: {
          create: photos.map((photo) => ({
            url: photo.url,
            publicId: photo.publicId,
            position: photo.position,
          })),
        },
      },
    });

    revalidatePath("/");
    revalidateTag("categories");

    return {
      success: true,
      data: newCategory,
      message: "Category created successfully",
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function updateCategory(data: CategoryValues) {
  try {
    const session = await getSession();
    const admin = session?.user.role === "ADMIN";

    if (!admin) {
      return {
        success: false,
        message: "You are not authorized",
      };
    }

    const validated = CategorySchema.parse(data);
    const { id: categoryId, name, photos } = validated;

    if (!categoryId) {
      return {
        success: false,
        message: "Category ID is required",
      };
    }

    if (!name || !photos) {
      return {
        success: false,
        message: "This fields are required",
      };
    }

    const existingCategory =
      await prisma.category.findUnique({
        where: { id: categoryId },
        include: getCategoryDataInclude(),
      });

    if (!existingCategory) {
      return {
        success: false,
        message: "Category not found",
      };
    }

    const currentPhotos = existingCategory.photos.map(
      (photo) => photo.publicId
    );
    const newPhotos = photos.map((photo) => photo.publicId);
    const photosToDelete = currentPhotos.filter(
      (id) => !newPhotos.includes(id)
    );

    for (const publicId of photosToDelete) {
      await cloudinary.v2.uploader.destroy(publicId!);
    }

    await prisma.photo.deleteMany({
      where: {
        categoryId,
      },
    });

    const updatedCategory = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name,
        photos: {
          create: photos.map((photo) => ({
            url: photo.url,
            publicId: photo.publicId,
            position: photo.position,
          })),
        },
      },
    });

    revalidatePath("/");
    revalidateTag("categories");

    return {
      success: true,
      data: updatedCategory,
      message: "Category updated successfully",
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    const session = await getSession();
    const admin = session?.user.role === "ADMIN";

    if (!admin) {
      return {
        success: false,
        message: "You are not authorized",
      };
    }

    if (!categoryId) {
      return {
        success: false,
        message: "Category ID is required",
      };
    }

    const existingCategory =
      await prisma.category.findUnique({
        where: { id: categoryId },
        include: getCategoryDataInclude(),
      });

    if (!existingCategory) {
      return {
        success: false,
        message: "Category not found",
      };
    }

    for (const photo of existingCategory.photos) {
      await cloudinary.v2.uploader.destroy(photo.publicId!);
    }
    await prisma.photo.deleteMany({
      where: {
        categoryId,
      },
    });

    await prisma.category.delete({
      where: { id: categoryId },
    });

    revalidatePath("/");
    revalidateTag("categories");

    return {
      success: true,
      message: "Category deleted successfully",
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: error.message,
    };
  }
}
