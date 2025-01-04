"use server";

import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import {
  getCategoryDataSelect,
  getSession,
  getSubCategoryDataSelect,
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
  }[];
}) {
  try {
    //validate permissions
    const session = await getSession();
    const admin = session?.user.role === "ADMIN";

    if (!admin) {
      return {
        success: false,
        message:
          "You are not authorized to create a category",
      };
    }

    //validate input data
    CategoriesSchema.parse(data);
    const { name, photos, subCategories } = data;

    if (
      !name ||
      photos?.length === 0 ||
      subCategories?.length === 0
    ) {
      return {
        success: false,
        message: "All fields are required.",
      };
    }

    for (const subCategory of subCategories) {
      if (!subCategory.name || !subCategory.description) {
        return {
          success: false,
          message: "Subcategory fields are required.",
        };
      }
    }

    //generate category slug
    let categorySlug = slugify(name);
    const existedCategorySlug =
      await prisma.category.findFirst({
        where: { slug: categorySlug },
      });
    if (existedCategorySlug) {
      categorySlug += `${categorySlug}${Math.floor(Math.random() * 100)}`;
    }

    //create category
    const newCategory = await prisma.category.create({
      data: {
        slug: categorySlug,
        name,
        photos: {
          createMany: {
            data: photos.map((photo) => ({
              url: photo.url,
              publicId: photo.publicId,
            })),
          },
        },
      },
    });

    const newSubCategories = subCategories.map(
      async (subCategory) => {
        let subCategorySlug = slugify(subCategory.name);
        const existedSubCategorySlug =
          await prisma.subCategory.findFirst({
            where: { slug: subCategorySlug },
          });
        if (existedSubCategorySlug) {
          subCategorySlug += `${subCategorySlug}${Math.floor(Math.random() * 100)}`;
        }

        return await prisma.subCategory.create({
          data: {
            slug: subCategorySlug,
            name: subCategory.name,
            description: subCategory.description,
            categoryId: newCategory.id,
          },
        });
      }
    );

    await Promise.all(newSubCategories);
    //fetch category
    const result = await prisma.category.findFirst({
      where: { id: newCategory.id },
      include: getCategoryDataSelect(),
    });

    revalidatePath("/");
    revalidateTag("categories");

    console.log(JSON.stringify(result, null, 2));
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
    name: string;
    description: string;
  }[];
}) {
  try {
    //validate permissions
    const session = await getSession();
    const admin = session?.user.role === "ADMIN";

    if (!admin) {
      return {
        success: false,
        message:
          "You are not authorized to create a category",
      };
    }

    //validate input data
    CategoriesSchema.parse(data);
    const { id, name, photos, subCategories } = data;

    if (!id) {
      return {
        success: false,
        message: "Category ID is required",
      };
    }

    // Fetch the existing category
    const existingCategory =
      await prisma.category.findUnique({
        where: { id },
        include: getCategoryDataSelect(),
      });

    if (!existingCategory) {
      return {
        success: false,
        message: "Category not found.",
      };
    }

    // Update category slug
    let categorySlug = existingCategory.slug;
    if (name && name !== existingCategory.name) {
      categorySlug = slugify(name);
      const existingSlug = await prisma.category.findFirst({
        where: { slug: categorySlug },
      });
      if (existingSlug && existingSlug.id !== id) {
        categorySlug += `${categorySlug}${Math.floor(Math.random() * 100)}`;
      }
    }

    const currentPhotos = existingCategory.photos.map(
      (photo) => photo.publicId
    );
    const newPhotos = photos.map((photo) => photo.publicId);
    const photosToDelete = currentPhotos.filter(
      (id) => !newPhotos.includes(id)
    );

    for (const publicId of photosToDelete) {
      try {
        await cloudinary.v2.uploader.destroy(publicId);
      } catch (error) {
        console.error(`Error deleting photo:`, error);
      }
    }

    await prisma.photo.deleteMany({
      where: {
        categoryId: id,
      },
    });

    // Update category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        slug: categorySlug,
        name,
        photos: {
          deleteMany: {
            NOT: {
              publicId: {
                in: currentPhotos,
              },
            }
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

    if (subCategories?.length) {
      await prisma.subCategory.deleteMany({
        where: { categoryId: id },
      });
      const updatedSubCategory = subCategories.map(
        async ({ name, description }) => {
          let subCategorySlug = slugify(name);
          const existingSubCategory =
            await prisma.subCategory.findFirst({
              where: { slug: subCategorySlug },
            });

          if (existingSubCategory) {
            subCategorySlug += `-${Math.floor(Math.random() * 100)}`;
          }

          return prisma.subCategory.create({
            data: {
              slug: subCategorySlug,
              name,
              description,
              categoryId: id,
            },
          });
        }
      );

      await Promise.all(updatedSubCategory);
    }

    //fetch category
    const result = await prisma.category.findFirst({
      where: { id: updatedCategory.id },
      include: getCategoryDataSelect(),
    });

    revalidatePath("/");
    revalidateTag("categories");

    console.log(JSON.stringify(result, null, 2));
    return {
      success: true,
      message: "Category updated successfully",
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
