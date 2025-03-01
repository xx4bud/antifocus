"use server";
import { getSession } from "@/actions/user";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { MediaFormSchema, MediaFormValue } from "@/lib/schemas";
import { Prisma } from "@prisma/client";
import cloudinary from "@/lib/cloudinary";

export async function submitMedia(data: MediaFormValue) {
  try {
    const session = await getSession();
    const isAdmin = session?.user?.role === "ADMIN";

    if (!isAdmin) {
      return {
        success: false,
        message: "Anda tidak memiliki izin untuk membuat media",
      };
    }

    const validated = MediaFormSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        message: "Data tidak valid",
        errors: validated.error.flatten(),
      };
    }

    const newMedia = await prisma.media.create({
      data: {
        url: data.media?.url || '',
        publicId: data.media?.publicId,
        alt: data.media?.alt,
        format: data.media?.format || "IMAGE",
        order: data.media?.order || 0,
        width: data.media?.width || null,
        height: data.media?.height || null,
        size: data.media?.size || null,
        metadata: data.media?.metadata ? (data.media.metadata as Prisma.InputJsonValue) : Prisma.JsonNull,
      },
    });

    revalidatePath("/");
    return { success: true, data: newMedia };
  } catch (error) {
    console.error("Error submitting media:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat membuat media",
    };
  }
}

export async function editMedia(
  mediaId: string,
  data: MediaFormValue
) {
  try {
    const session = await getSession();
    const isAdmin = session?.user?.role === "ADMIN";

    if (!isAdmin) {
      return {
        success: false,
        message: "Anda tidak memiliki izin untuk mengedit media",
      };
    }

    const validated = MediaFormSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        message: "Data tidak valid",
        errors: validated.error.flatten(),
      };
    }

    const existingMedia = await prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!existingMedia) {
      return {
        success: false,
        message: "Media tidak ditemukan",
      };
    }

    // Delete old media from Cloudinary if publicId has changed
    if (existingMedia.publicId && existingMedia.publicId !== data.media?.publicId) {
      await cloudinary.v2.uploader.destroy(existingMedia.publicId);
    }

    const updatedMedia = await prisma.media.update({
      where: { id: mediaId },
      data: {
        url: data.media?.url,
        publicId: data.media?.publicId,
        alt: data.media?.alt,
        format: data.media?.format || "IMAGE",
        order: data.media?.order || 0,
        width: data.media?.width || null,
        height: data.media?.height || null,
        size: data.media?.size || null,
        metadata: data.media?.metadata ? (data.media.metadata as Prisma.InputJsonValue) : Prisma.JsonNull,
      },
    });

    revalidatePath("/");
    return { success: true, data: updatedMedia };
  } catch (error) {
    console.error("Error editing media:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat mengedit media",
    };
  }
}

export async function deleteMedia(mediaId: string) {
  try {
    const session = await getSession();
    const isAdmin = session?.user?.role === "ADMIN";

    if (!isAdmin) {
      return {
        success: false,
        message: "Anda tidak memiliki izin untuk menghapus media",
      };
    }

    const existingMedia = await prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!existingMedia) {
      return {
        success: false,
        message: "Media tidak ditemukan",
      };
    }

    // Delete media from Cloudinary
    if (existingMedia.publicId) {
      await cloudinary.v2.uploader.destroy(existingMedia.publicId);
    }

    await prisma.media.delete({
      where: { id: mediaId },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting media:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat menghapus media",
    };
  }
}