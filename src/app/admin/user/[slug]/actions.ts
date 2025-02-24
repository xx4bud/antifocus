"use server";
import { getSession } from "@/actions/user";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { UserFormSchema, UserFormValue } from "@/lib/schemas";
import { Prisma } from "@prisma/client";
import { getUserInclude } from "@/lib/types";
import cloudinary from "@/lib/cloudinary";

export async function submitUser(data: UserFormValue) {
  try {
    const session = await getSession();
    const isAdmin = session?.user?.role === "ADMIN";

    if (!isAdmin) {
      return {
        success: false,
        message:
          "Anda tidak memiliki izin untuk membuat pengguna",
      };
    }

    const validated = UserFormSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        message: "Data tidak valid",
        errors: validated.error.flatten(),
      };
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { slug: data.slug },
          { phone: data.phone },
        ],
      },
      include: getUserInclude(),
    });

    if (existingUser) {
      return {
        success: false,
        message:
          "Email, slug, atau nomor telepon sudah digunakan",
      };
    }

    let hashedPassword;
    if (data.newPassword) {
      hashedPassword = await hash(data.newPassword, 12);
    }

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        slug: data.slug,
        email: data.email,
        phone: data.phone,
        role: data.role,
        status: data.status,
        password: hashedPassword,
        media: {
          create: data.media?.map((m): Prisma.MediaCreateWithoutUserInput => ({
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
      include: {
        media: true,
      },
    });

    revalidatePath("/");
    return { success: true, data: newUser };
  } catch (error) {
    console.error("Error submitting user:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat membuat pengguna",
    };
  }
}

export async function editUser(
  userId: string,
  data: UserFormValue
) {
  try {
    const session = await getSession();
    const isAdmin = session?.user?.role === "ADMIN";

    if (!isAdmin) {
      return {
        success: false,
        message:
          "Anda tidak memiliki izin untuk mengedit pengguna",
      };
    }

    const validated = UserFormSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        message: "Data tidak valid",
        errors: validated.error.flatten(),
      };
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: getUserInclude()
    });

    if (!existingUser) {
      return {
        success: false,
        message: "Pengguna tidak ditemukan",
      };
    }

    const currentMedia = existingUser.media.map((m) => m.publicId).filter(Boolean);
    const newMedia = data.media?.map((m) => m.publicId).filter(Boolean) || [];
    const mediaToDelete = currentMedia.filter((id): id is string => typeof id === 'string' && !newMedia.includes(id));

    for (const publicId of mediaToDelete) {
      if (publicId) {
        await cloudinary.v2.uploader.destroy(publicId);
      }
    }

    let hashedPassword;
    if (data.newPassword) {
      hashedPassword = await hash(data.newPassword, 12);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        slug: data.slug,
        email: data.email,
        phone: data.phone,
        role: data.role,
        status: data.status,
        ...(hashedPassword && { password: hashedPassword }),
        media: {
          deleteMany: {},
          create: data.media?.map((m): Prisma.MediaCreateWithoutUserInput => ({
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
      include: {
        media: true,
      },
    });


    revalidatePath(`/`);
    return { success: true, data: updatedUser };
  } catch (error) {
    console.error("Error editing user:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat mengedit pengguna",
    };
  }
}

export async function deleteUser(userId: string) {
  try {
    const session = await getSession();
    const isAdmin = session?.user?.role === "ADMIN";

    if (!isAdmin) {
      return {
        success: false,
        message:
          "Anda tidak memiliki izin untuk menghapus pengguna",
      };
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { media: true },
    });

    if (!existingUser) {
      return {
        success: false,
        message: "Pengguna tidak ditemukan",
      };
    }

   if (existingUser.media && existingUser.media.length > 0) {
      for (const media of existingUser.media) {
        if (media.publicId) {
          await cloudinary.v2.uploader.destroy(media.publicId);
        }
      }
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat menghapus pengguna",
    };
  }
}
