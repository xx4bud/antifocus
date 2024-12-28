'use server'

import { prisma } from "@/lib/prisma";
import { PostSchema } from "@/lib/schemas";

export async function submitPost(data: { name: string; description: string }) {
  try {
    // Validasi input
    PostSchema.parse(data);

    // Simpan data ke database
    const post = await prisma.post.create({
      data,
    });

    return {
      success: true,
      data: post,
    };
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updatePost(id: string, data: { name: string; description: string }) {
  try {
    // Validasi input
    PostSchema.parse(data);

    // Simpan data ke database
    const post = await prisma.post.update({
      where: { id },
      data, // Menggunakan data yang dikirimkan sebagai data untuk pembaruan
    });

    return {
      success: true,
      data: post,
    };
  } catch (error) {
    console.error("Error updating post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deletePost(id: string) {
  try {
    // Hapus data dari database
    const post = await prisma.post.delete({
      where: { id },
    });

    return {
      success: true,
      data: post,
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
} 