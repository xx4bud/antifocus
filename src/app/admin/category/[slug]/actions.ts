"use server";

import { getSession } from "@/actions/user";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CategoryFormSchema, CategoryFormValue } from "@/lib/schemas";
import { Prisma } from "@prisma/client";
import { getCategoryInclude } from "@/lib/types";
import cloudinary from "@/lib/cloudinary";

export async function submitCategory(data: CategoryFormValue) {
  try {
    const session = await getSession();
    const isAdmin = session?.user?.role === "ADMIN";

    if (!isAdmin) {
      return {
        success: false,
        message: "Anda tidak memiliki izin untuk membuat kategori",
      };
    }

    const validated = CategoryFormSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        message: "Data tidak valid",
        errors: validated.error.flatten(),
      };
    }

    const existingCategory = await prisma.category.findFirst({
      where: {
        slug: data.slug,
      },
      include: getCategoryInclude(),
    });

    if (existingCategory) {
      return {
        success: false,
        message: "Slug kategori sudah digunakan",
      };
    }

    const newCategory = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        parentId: data.parentId,
        media: {
          create: data.media?.map((m): Prisma.MediaCreateWithoutCategoryInput => ({
            url: m.url,
            publicId: m.publicId,
            alt: m.alt,
            format: m.format || "IMAGE",
            order: m.order || 0,
            width: m.width || null,
            height: m.height || null,
            size: m.size || null,
            metadata: m.metadata ? (m.metadata as Prisma.InputJsonValue) : Prisma.JsonNull,
          })),
        },
      },
      include: getCategoryInclude(),
    });

    revalidatePath("/");
    return { success: true, data: newCategory };
  } catch (error) {
    console.error("Error submitting category:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat membuat kategori",
    };
  }
}

export async function editCategory(
  categoryId: string,
  data: CategoryFormValue
) {
  try {
    const session = await getSession();
    const isAdmin = session?.user?.role === "ADMIN";

    if (!isAdmin) {
      return {
        success: false,
        message: "Anda tidak memiliki izin untuk mengedit kategori",
      };
    }

    const validated = CategoryFormSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        message: "Data tidak valid",
        errors: validated.error.flatten(),
      };
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
      include: getCategoryInclude()
    });

    if (!existingCategory) {
      return {
        success: false,
        message: "Kategori tidak ditemukan",
      };
    }

    // Check for circular reference in parent-child relationship
    if (data.parentId && data.parentId === categoryId) {
      return {
        success: false,
        message: "Kategori tidak dapat menjadi parent dari dirinya sendiri",
      };
    }

    const currentMedia = existingCategory.media.map((m) => m.publicId).filter(Boolean);
    const newMedia = data.media?.map((m) => m.publicId).filter(Boolean) || [];
    const mediaToDelete = currentMedia.filter((id): id is string => typeof id === 'string' && !newMedia.includes(id));

    for (const publicId of mediaToDelete) {
      if (publicId) {
        await cloudinary.v2.uploader.destroy(publicId);
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        parentId: data.parentId,
        media: {
          deleteMany: {},
          create: data.media?.map((m): Prisma.MediaCreateWithoutCategoryInput => ({
            url: m.url,
            publicId: m.publicId,
            alt: m.alt,
            format: m.format || "IMAGE",
            order: m.order || 0,
            width: m.width || null,
            height: m.height || null,
            size: m.size || null,
            metadata: m.metadata ? (m.metadata as Prisma.InputJsonValue) : Prisma.JsonNull,
          })),
        },
      },
      include: getCategoryInclude(),
    });

    revalidatePath("/");
    return { success: true, data: updatedCategory };
  } catch (error) {
    console.error("Error editing category:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat mengedit kategori",
    };
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    const session = await getSession();
    const isAdmin = session?.user?.role === "ADMIN";

    if (!isAdmin) {
      return {
        success: false,
        message: "Anda tidak memiliki izin untuk menghapus kategori",
      };
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        media: true,
        children: true,
        products: true
      },
    });

    if (!existingCategory) {
      return {
        success: false,
        message: "Kategori tidak ditemukan",
      };
    }

    // Check if category has children or products
    if (existingCategory.children.length > 0 || existingCategory.products.length > 0) {
      return {
        success: false,
        message: "Tidak dapat menghapus kategori yang memiliki sub-kategori atau produk",
      };
    }

    // Delete associated media from Cloudinary
    if (existingCategory.media && existingCategory.media.length > 0) {
      for (const media of existingCategory.media) {
        if (media.publicId) {
          await cloudinary.v2.uploader.destroy(media.publicId);
        }
      }
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat menghapus kategori",
    };
  }
}
