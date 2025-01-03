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
  photos: {
    url: string;
    publicId: string;
  }[];
  subCategories: {
    name: string;
    description: string;
    photos: {
      url: string;
      publicId: string;
    }[];
  }[];
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

    CategoriesSchema.parse(data);

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

    if (!subCategories || subCategories.length === 0) {
      return {
        success: false,
        message: "Subcategories are required",
      };
    }

    if (
      subCategories.some((subCategory) => !subCategory.name)
    ) {
      return {
        success: false,
        message: "Subcategory name is required",
      };
    }

    if (
      subCategories.some(
        (subCategory) => !subCategory.description
      )
    ) {
      return {
        success: false,
        message: "Subcategory description is required",
      };
    }

    if (
      subCategories.some(
        (subCategory) => subCategory.photos.length === 0
      )
    ) {
      return {
        success: false,
        message: "Subcategory photos are required",
      };
    }

    let slug = slugify(name);

    const existedCategorySlug =
      await prisma.category.findUnique({
        where: { slug },
      });

    if (existedCategorySlug) {
      slug += `${slug}${Math.floor(Math.random() * 100)}`;
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        slug,
        photos: {
          create: photos.map((photo) => ({
            url: photo.url,
            publicId: photo.publicId,
          })),
        },
      },
    });

    for (const subCategory of subCategories) {
      let slug = slugify(subCategory.name);

      const existedSubCategorySlug =
        await prisma.subCategory.findUnique({
          where: { slug },
        });

      if (existedSubCategorySlug) {
        slug += `${slug}${Math.floor(Math.random() * 100)}`;
      }

      const createdSubCategory =
        await prisma.subCategory.create({
          data: {
            slug,
            name: subCategory.name,
            description: subCategory.description,
            categoryId: newCategory.id,
          },
        });

      if (subCategory.photos.length > 0) {
        await prisma.photo.createMany({
          data: subCategory.photos.map((photo) => ({
            url: photo.url,
            publicId: photo.publicId,
            subCategoryId: createdSubCategory.id,
          })),
        });
      }
    }

    const result = await prisma.category.findUnique({
      where: { id: newCategory.id },
      include: getCategoryDataInclude(),
    });

    revalidatePath("/");
    revalidateTag("categories");

    return {
      success: true,
      message: "Category created successfully",
      data: result,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong",
      error,
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

    CategoriesSchema.parse(data);

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

    const currentPhotoPublicIds = existingCategory.photos.map((photo) => photo.publicId);
    const newPhotoPublicIds = photos.map((photo) => photo.publicId);
    const photosToDelete = currentPhotoPublicIds.filter((id) => !newPhotoPublicIds.includes(id));

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
        categoryId,
      },
    });

    await prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
        slug: newCategorySlug,
        photos: {
          deleteMany: {
            NOT: { publicId: { in: newPhotoPublicIds } },
          },
          create: photos.map((photo) => ({
            url: photo.url,
            publicId: photo.publicId,
          })),
        },
      },
    });

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

        if (subCategoryPhotosToDelete.length > 0) {
          for (const publicId of subCategoryPhotosToDelete) {
            try {
              await cloudinary.v2.uploader.destroy(publicId);
            } catch (error) {
              console.error(`Error deleting subcategory photo: ${publicId}`, error);
            }
          }
        }

        await prisma.photo.deleteMany({
          where: {
            subCategoryId: subCategory.id,
          },
        });

       
        await prisma.subCategory.update({
          where: { id: subCategory.id },
          data: {
            name: subCategory.name,
            slug: newSubCategorySlug,
            description: subCategory.description,
            photos: {
              deleteMany: {
                NOT: { publicId: { in: newSubCategoryPhotoPublicIds } },
              },
              create: subCategory.photos.map((photo) => ({
                url: photo.url,
                publicId: photo.publicId,
              })),
            },
          },
        });
      } else {
        // Create new subcategory
        await prisma.subCategory.create({
          data: {
            name: subCategory.name,
            slug: slugify(subCategory.name),
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

    // Fetch and return the updated category
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