"use server";

import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import {
  getCategoryDataInclude,
  getSession,
} from "@/lib/queries";
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
    // photos: {
    //   url: string;
    //   publicId: string;
    // }[];
  }[];
}) {
  try {
    //permissions
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
    const { name, photos, subCategories } = data;

    if (
      !name ||
      photos.length === 0 ||
      subCategories.length === 0
    ) {
      return {
        success: false,
        message:
          "Name, photos, and subcategories are required",
      };
    }

    if (subCategories.length > 0) {
      for (const subCategory of subCategories) {
        if (!subCategory.name || !subCategory.description) {
          return {
            success: false,
            message:
              "Subcategory name and description are required",
          };
        }
      }
    }

    //create category slug
    let categorySlug = slugify(name);
    const existingCategorySlug =
      await prisma.category.findUnique({
        where: { slug: categorySlug },
      });
    if (existingCategorySlug) {
      return {
        success: false,
        message: "Category slug already exists",
      };
    }

    //create category
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

    //create subcategories
    for (const subCategory of subCategories) {
      //create subcategory slug
      let subCategorySlug = slugify(subCategory.name);
      const existingSubCategorySlug =
        await prisma.subCategory.findUnique({
          where: { slug: subCategorySlug },
        });
      if (existingSubCategorySlug) {
        return {
          success: false,
          message: "Subcategory slug already exists",
        };
      }
      await prisma.subCategory.create({
        data: {
          slug: subCategorySlug,
          name: subCategory.name,
          description: subCategory.description,
          categorySlug: newCategory.slug,
        },
      });
    }

    revalidatePath("/");
    revalidateTag("categories");

    console.log(JSON.stringify(newCategory, null, 2));
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
  slug: string;
  name: string;
  photos: {
    url: string;
    publicId: string;
  }[];
  subCategories: {
    slug?: string;
    name: string;
    description: string;
    // photos: {
    //   url: string;
    //   publicId: string;
    // }[];
  }[];
}) {
  try {
    //permissions
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
    const {
      slug: categorySlug,
      name,
      photos,
      subCategories,
    } = data;

    if (!categorySlug) {
      return {
        success: false,
        message: "Category ID is required",
      };
    }

    if (
      !name ||
      photos.length === 0 ||
      subCategories.length === 0
    ) {
      return {
        success: false,
        message:
          "Name, photos, and subcategories are required",
      };
    }

    if (subCategories.length > 0) {
      for (const subCategory of subCategories) {
        if (!subCategory.name || !subCategory.description) {
          return {
            success: false,
            message:
              "Subcategory name and description are required",
          };
        }
      }
    }

    // Fetch the existing category
    const existingCategory =
      await prisma.category.findUnique({
        where: { slug: categorySlug },
        include: getCategoryDataInclude(),
      });

    if (!existingCategory) {
      return {
        success: false,
        message: "Category not found.",
      };
    }

    // Update category slug
    let updatedCategorySlug = existingCategory.slug;
    const existingCategorySlug =
      await prisma.category.findUnique({
        where: { slug: updatedCategorySlug },
      });
    if (existingCategorySlug) {
      return {
        success: false,
        message: "Category slug already exists",
      };
    }

    // Delete old photos
    const currentPhotos = existingCategory.photos.map(
      (photo) => photo.publicId
    );
    const newPhotos = photos.map((photo) => photo.publicId);
    const photosToDelete = currentPhotos.filter(
      (publicId) => !newPhotos.includes(publicId)
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
        categoryId: categoryId,
      },
    });

    // Update category
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        slug: updatedCategorySlug,
        name,
        photos: {
          deleteMany: {
            publicId: {
              notIn: currentPhotos,
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

    // Delete old subcategories
    const subCategoriesToDelete =
      existingCategory.subCategories.filter(
        (subCategory) =>
          !subCategories.find(
            (subCategoryData) =>
              subCategoryData.id === subCategory.id
          )
      );
    for (const subCategory of subCategoriesToDelete) {
      await prisma.subCategory.delete({
        where: { id: subCategory.id },
      });
    }

    //Update subcategories
    for (const subCategory of subCategories) {
      if (subCategory.id) {
        //update old slug subcategory
        let subCategorySlug = slugify(subCategory.name);
        const existingSubCategorySlug =
          await prisma.subCategory.findFirst({
            where: {
              slug: subCategorySlug,
              id: { not: subCategory.id },
            },
          });
        if (existingSubCategorySlug) {
          return {
            success: false,
            message: "Subcategory slug already exists",
          };
        }
        //update old subcategory
        await prisma.subCategory.update({
          where: { id: subCategory.id },
          data: {
            slug: subCategorySlug,
            name: subCategory.name,
            description: subCategory.description,
          },
        });
      } else {
        //create new slug subcategory
        let subCategorySlug = slugify(subCategory.name);
        const existingSubCategorySlug =
          await prisma.subCategory.findUnique({
            where: { slug: subCategorySlug },
          });
        if (existingSubCategorySlug) {
          return {
            success: false,
            message: "Subcategory slug already exists",
          };
        }

        //create new subcategory
        await prisma.subCategory.create({
          data: {
            slug: subCategorySlug,
            name: subCategory.name,
            description: subCategory.description,
            categoryId: updatedCategory.id,
          },
        });
      }
    }

    revalidatePath("/");
    revalidateTag("categories");

    console.log(JSON.stringify(updatedCategory, null, 2));
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
