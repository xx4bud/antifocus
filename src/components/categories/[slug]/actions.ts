"use server";

import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import {
  getCategoryDataInclude,
  getSession,
} from "@/lib/queries";
import { CategoriesSchema } from "@/lib/schemas";
import { slugify } from "@/lib/utils";
import { revalidatePath, revalidateTag } from "next/cache";

export async function createCategory(data: {
  name: string;
  photos: { url: string; publicId: string }[];
  subCategories: {
    name: string;
    description: string;
    photos: { url: string; publicId: string }[];
  }[];
}) {
  try {
    CategoriesSchema.parse(data);

    const { name, photos, subCategories } = data;

    if (
      !name ||
      !photos ||
      photos.length === 0 ||
      !subCategories ||
      subCategories.length === 0
    ) {
      return {
        success: false,
        message: "All fields are required",
      };
    }

    for (const subCategory of subCategories) {
      if (
        !subCategory.name ||
        !subCategory.description ||
        !subCategory.photos ||
        subCategory.photos.length === 0
      ) {
        return {
          success: false,
          message: "Subcategory fields are required",
        };
      }
    }

    let categorySlug = slugify(name);
    const existingCategorySlug =
      await prisma.category.findUnique({
        where: { slug: categorySlug },
      });
    if (existingCategorySlug) {
      categorySlug = `${categorySlug}${Math.floor(Math.random() * 100)}`;
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        slug: categorySlug,
        photos: {
          create: photos.map((photo) => ({
            url: photo.url,
            publicId: photo.publicId,
          })),
        },
        subCategories: {
          create: subCategories.map((subCategory) => ({
            name: subCategory.name,
            slug: slugify(subCategory.name),
            description: subCategory.description,
            photos: {
              create: subCategory.photos.map((photo) => ({
                url: photo.url,
                publicId: photo.publicId,
              })),
            },
          })),
        },
      },
    });

    revalidatePath("/");
    revalidateTag("categories");

    return { success: true, data: newCategory };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message: error.message || "An error occurred",
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
      id: string;
      name: string;
      description: string;
      photos: {
        url: string;
        publicId: string;
      }[];
    }[];
  }) {
    try {
      CategoriesSchema.parse(data);  // Validasi data menggunakan schema
  
      const { id: categoryId, name, photos, subCategories } = data;
  
      const existingCategory = await prisma.category.findUnique({
        where: { id: categoryId },
        include: getCategoryDataInclude(),
      });
  
      if (!existingCategory) {
        return {
          success: false,
          message: "Category not found",
        };
      }
  
      let newCategorySlug = slugify(name);
      const existingCategorySlug = await prisma.category.findUnique({
        where: { slug: newCategorySlug },
      });
  
      if (existingCategorySlug && existingCategorySlug.id !== categoryId) {
        newCategorySlug += `-${Math.floor(Math.random() * 100)}`;
      }
  
      // Handle category photos update
      const currentPhotoPublicIds = existingCategory.photos.map((photo) => photo.publicId);
      const newPhotoPublicIds = photos.map((photo) => photo.publicId);
      const photosToDelete = currentPhotoPublicIds.filter((id) => !newPhotoPublicIds.includes(id));
  
      // Delete unused photos from category
      if (photosToDelete.length > 0) {
        for (const publicId of photosToDelete) {
          try {
            await cloudinary.v2.uploader.destroy(publicId);
          } catch (error) {
            console.error(`Error deleting photo:`, error);
          }
        }
      }
  
      // Update category photos
      await prisma.photo.deleteMany({
        where: { categoryId },
      });
  
      // Update category
      await prisma.category.update({
        where: { id: categoryId },
        data: {
          name,
          slug: newCategorySlug,
          photos: {
            create: photos.map((photo) => ({
              url: photo.url,
              publicId: photo.publicId,
            })),
          },
        },
      });
  
      // Handle subcategories update
      for (const subCategory of subCategories) {
        if (subCategory.id) {
          const existingSubCategory = await prisma.subCategory.findUnique({
            where: { id: subCategory.id },
            include: { photos: true },
          });
  
          if (!existingSubCategory) {
            throw new Error(`Subcategory with ID ${subCategory.id} not found`);
          }
  
          let newSubCategorySlug = slugify(subCategory.name);
          const existingSubCategorySlug = await prisma.subCategory.findUnique({
            where: { slug: newSubCategorySlug },
          });
  
          if (existingSubCategorySlug && existingSubCategorySlug.id !== subCategory.id) {
            newSubCategorySlug += `-${Math.floor(Math.random() * 100)}`;
          }
  
          const currentSubCategoryPhotoPublicIds = existingSubCategory.photos.map((photo) => photo.publicId);
          const newSubCategoryPhotoPublicIds = subCategory.photos.map((photo) => photo.publicId);
          const subCategoryPhotosToDelete = currentSubCategoryPhotoPublicIds.filter(
            (id) => !newSubCategoryPhotoPublicIds.includes(id)
          );
  
          // Delete unused subcategory photos
          if (subCategoryPhotosToDelete.length > 0) {
            for (const publicId of subCategoryPhotosToDelete) {
              try {
                await cloudinary.v2.uploader.destroy(publicId);
              } catch (error) {
                console.error(`Error deleting subcategory photo: ${publicId}`, error);
              }
            }
          }
  
          // Delete old photos from subcategory and add the new ones
          await prisma.photo.deleteMany({
            where: { subCategoryId: subCategory.id },
          });
  
          // Add new photos to subcategory
          await prisma.subCategory.update({
            where: { id: subCategory.id },
            data: {
              name: subCategory.name,
              slug: newSubCategorySlug,
              description: subCategory.description,
              photos: {
                create: subCategory.photos.map((photo) => ({
                  url: photo.url,
                  publicId: photo.publicId,
                })),
              },
            },
          });
        } else {
          // Create new subcategory if ID is not present
          let newSubCategorySlug = slugify(subCategory.name);
          const existingSubCategorySlug = await prisma.subCategory.findUnique({
            where: { slug: newSubCategorySlug },
          });
  
          if (existingSubCategorySlug) {
            newSubCategorySlug += `-${Math.floor(Math.random() * 100)}`;
          }
  
          await prisma.subCategory.create({
            data: {
              name: subCategory.name,
              slug: newSubCategorySlug,
              description: subCategory.description,
              categoryId,
              photos: {
                create: subCategory.photos.map((photo) => ({
                  url: photo.url,
                  publicId: photo.publicId,
                })),
              },
            },
          });
        }
      }
  
      // Return updated category data
      const updatedCategory = await prisma.category.findUnique({
        where: { id: categoryId },
        include: getCategoryDataInclude(),
      });
  
      return {
        success: true,
        message: "Category updated successfully",
        data: updatedCategory,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Something went wrong",
        error,
      };
    }
  }
  
  
  
  
