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
    //

    // validate input data
    CategoriesSchema.parse(data);
    const { name, photos, subCategories } = data;

    // validate category
    if (!name || !photos || !subCategories) {
      return {
        success: false,
        message: "All category fields are required",
      };
    }

    // validate subcategories
    for (const subCategory of subCategories) {
      if (
        !subCategory.name ||
        !subCategory.description ||
        !subCategory.photos
      ) {
        return {
          success: false,
          message: "All subcategory fields are required",
        };
      }

      // existing subcategory slug
      const subCategorySlug = slugify(subCategory.name);
      const existingSubCategorySlug =
        await prisma.subCategory.findUnique({
          where: { slug: subCategorySlug },
        });

      if (existingSubCategorySlug) {
        return {
          success: false,
          message: `Subcategory slug "${subCategorySlug}" already exists`,
        };
      }
    }

    // existing category slug
    let categorySlug = slugify(name);
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

    // create category
    const newCategory = await prisma.category.create({
      data: {
        slug: categorySlug,
        name,
        photos: {
          create: photos.map((photo) => ({
            url: photo.url,
            publicId: photo.publicId,
          })),
        },
      },
    });

    // Create subcategories
    for (const subCategory of subCategories) {
      const subCategorySlug = slugify(subCategory.name);

      await prisma.subCategory.create({
        data: {
          categoryId: newCategory.id,
          slug: subCategorySlug,
          name: subCategory.name,
          description: subCategory.description,
          photos: {
            create: subCategory.photos.map((photo) => ({
              url: photo.url,
              publicId: photo.publicId,
            })),
          },
        },
      });
    }

    revalidatePath("/");
    revalidateTag("categories");

    return {
      success: true,
      data: newCategory,
    };
  } catch (error: any) {
    console.error("Error creating category:", error);
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
    id?: string;
    name: string;
    description: string;
    photos: {
      url: string;
      publicId: string;
    }[];
  }[];
}) {
  try {
    // permissions
    const session = await getSession();
    const admin = session?.user.role === "ADMIN";

    if (!admin) {
      return {
        success: false,
        message: "You are not authorized",
      };
    }

    // validate input data
    CategoriesSchema.parse(data);
    const {
      id: categoryId,
      name,
      photos,
      subCategories,
    } = data;

    if (!categoryId) {
      return {
        success: false,
        message: "Category not found",
      };
    }

    // validate category
    if (!name || !photos || !subCategories) {
      return {
        success: false,
        message: "All category fields are required",
      };
    }

    // validate subcategories
    for (const subCategory of subCategories) {
      if (
        !subCategory.name ||
        !subCategory.description ||
        !subCategory.photos
      ) {
        return {
          success: false,
          message: "All subcategory fields are required",
        };
      }
    }

    // existing category
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

    // delete old photos
    const currentPhotos = existingCategory.photos.map(
      (photo) => photo.publicId
    );
    const newPhotos = photos.map((photo) => photo.publicId);
    const photosToDelete = currentPhotos.filter(
      (id) => !newPhotos.includes(id)
    );

    for (const publicId of photosToDelete) {
      await cloudinary.v2.uploader.destroy(publicId);
    }

    await prisma.photo.deleteMany({
      where: {
        categoryId,
      },
    });

    // update category
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
        photos: {
          create: photos.map((photo) => ({
            url: photo.url,
            publicId: photo.publicId,
          })),
        },
      },
    });

    // delete old subcategories
    const currentSubCategories =
      existingCategory.subCategories.map((sub) => sub.id);
    const newSubCategories = subCategories.map(
      (sub) => sub.id
    );
    const subCategoriesToDelete =
      currentSubCategories.filter(
        (id) => !newSubCategories.includes(id)
      );

    await prisma.subCategory.deleteMany({
      where: {
        id: {
          in: subCategoriesToDelete,
        },
      },
    });

    // delete old subcategory photos
    const currentSubCategoryPhotos =
      existingCategory.subCategories
        .map((sub) =>
          sub.photos.map((photo) => photo.publicId)
        )
        .flat();
    const newSubCategoryPhotos = subCategories
      .map((sub) =>
        sub.photos.map((photo) => photo.publicId)
      )
      .flat();
    const subCategoryPhotosToDelete =
      currentSubCategoryPhotos.filter(
        (id) => !newSubCategoryPhotos.includes(id)
      );

    for (const publicId of subCategoryPhotosToDelete) {
      await cloudinary.v2.uploader.destroy(publicId);
    }

    await prisma.photo.deleteMany({
      where: {
        subCategoryId: {
          in: subCategoriesToDelete,
        },
      },
    });

    // update subcategories
    for (const subCategory of subCategories) {
      if (subCategory.id) {
        // update existing subcategory
        await prisma.subCategory.update({
          where: { id: subCategory.id },
          data: {
            name: subCategory.name,
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
        // existing subcategory slug
        const subCategorySlug = slugify(subCategory.name);
        const existingSubCategorySlug =
          await prisma.subCategory.findUnique({
            where: { slug: subCategorySlug },
          });

        if (existingSubCategorySlug) {
          return {
            success: false,
            message: `Subcategory slug "${subCategorySlug}" already exists`,
          };
        }

        // create new subcategory
        await prisma.subCategory.create({
          data: {
            categoryId: updatedCategory.id,
            slug: subCategorySlug,
            name: subCategory.name,
            description: subCategory.description,
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

    revalidatePath("/");
    revalidateTag("categories");

    return {
      success: true,
      data: updatedCategory,
    };
  } catch (error: any) {
    console.error("Error updating category:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    // permissions
    const session = await getSession();
    const admin = session?.user.role === "ADMIN";

    if (!admin) {
      return {
        success: false,
        message: "You are not authorized",
      };
    }

    // validate input data
    if (!categoryId) {
      return {
        success: false,
        message: "Category ID is required",
      };
    }

    // existing category
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

    // delete all photos in category
    for (const photo of existingCategory.photos) {
      await cloudinary.v2.uploader.destroy(photo.publicId);
    }
    await prisma.photo.deleteMany({
      where: {
        categoryId,
      },
    });

    // delete all photos in subcategories
    for (const subCategory of existingCategory.subCategories) {
      for (const photo of subCategory.photos) {
        await cloudinary.v2.uploader.destroy(
          photo.publicId
        );
      }
    }
    await prisma.photo.deleteMany({
      where: {
        subCategoryId: {
          in: existingCategory.subCategories.map(
            (sub) => sub.id
          ),
        },
      },
    });

    // delete subcategories
    await prisma.subCategory.deleteMany({
      where: {
        categoryId,
      },
    });

    // delete category
    await prisma.category.delete({
      where: { id: categoryId },
    });

    revalidatePath("/");
    revalidateTag("categories");

    return {
      success: true,
      message:
        "Category and its subcategories have been deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}
