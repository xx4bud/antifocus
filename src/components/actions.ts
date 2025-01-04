"use server";

import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import {
  getCategoryDataInclude,
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

    // CategoriesSchema.parse(data);

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

    if (subCategories.length > 0) {
      for (const subCategory of subCategories) {
        if (
          !subCategory.name ||
          !subCategory.description ||
          subCategory.photos.length === 0
        ) {
          return {
            success: false,
            message: "Subcategory fields are required",
          };
        }
      }
    }

    let categorySlug = slugify(name);

    const existedCategorySlug =
      await prisma.category.findFirst({
        where: { slug: categorySlug },
      });

    if (existedCategorySlug) {
      categorySlug += `${categorySlug}${Math.floor(Math.random() * 100)}`;
    }

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

    for (const subCategory of subCategories) {
      let subCategorySlug = slugify(subCategory.name);

      const existedSubCategorySlug =
        await prisma.subCategory.findFirst({
          where: { slug: subCategorySlug },
        });

      if (existedSubCategorySlug) {
        subCategorySlug += `${subCategorySlug}${Math.floor(Math.random() * 100)}`;
      }

      const newSubCategory =
        await prisma.subCategory.create({
          data: {
            slug: subCategorySlug,
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
            subCategoryId: newSubCategory.id,
          })),
        });
      }
    }

    const result = await prisma.category.findFirst({
      where: { id: newCategory.id },
      include: getCategoryDataInclude(),
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
    // CategoriesSchema.parse(data);

    const {
      id: categoryId,
      name,
      photos,
      subCategories,
    } = data;

    // if (!categoryId) {
    //   return {
    //     success: false,
    //     message: "Category ID is required",
    //   };
    // }

    // if (
    //   !name ||
    //   !photos ||
    //   photos.length === 0 ||
    //   !subCategories ||
    //   subCategories.length === 0
    // ) {
    //   return {
    //     success: false,
    //     message: "All fields are required",
    //   };
    // }

    // if (subCategories.length > 0) {
    //   for (const subCategory of subCategories) {
    //     if (
    //       !subCategory.name ||
    //       !subCategory.description ||
    //       subCategory.photos.length === 0
    //     ) {
    //       return {
    //         success: false,
    //         message: "Subcategory fields are required",
    //       };
    //     }
    //   }
    // }

    const existedCategory = await prisma.category.findFirst(
      {
        where: { id: categoryId },
        include: getCategoryDataInclude(),
      }
    );

    if (!existedCategory) {
      return {
        success: false,
        message: "Category not found",
      };
    }

    let categorySlug = slugify(name);
    const existingCategorySlug =
      await prisma.category.findFirst({
        where: { slug: categorySlug },
        include: getCategoryDataInclude(),
      });

    if (
      existingCategorySlug &&
      existingCategorySlug.id !== existedCategory.id
    ) {
      categorySlug += `${categorySlug}${Math.floor(Math.random() * 100)}`;
    }

    const currentPhotos = existedCategory.photos.map(
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
        categoryId,
      },
    });

    await prisma.category.update({
      where: { id: categoryId },
      data: {
        slug: categorySlug,
        name,
        photos: {
          deleteMany: {
            NOT: { publicId: { in: newPhotos } },
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

    for (const subCategory of subCategories) {
      if (subCategory.id) {
        const existedSubCategory =
          await prisma.subCategory.findFirst({
            where: { id: subCategory.id },
            select: getSubCategoryDataSelect(),
          });

        if (!existedSubCategory) continue;

        const currentSubCategoryPhotos =
          existedSubCategory.photos.map(
            (photo) => photo.publicId
          );
        const newSubCategoryPhotos = subCategory.photos.map(
          (photo) => photo.publicId
        );
        const subCategoryPhotosToDelete =
          currentSubCategoryPhotos.filter(
            (id) => !newSubCategoryPhotos.includes(id)
          );

        for (const publicId of subCategoryPhotosToDelete) {
          try {
            await cloudinary.v2.uploader.destroy(publicId);
          } catch (error) {
            console.error(`Error deleting photo:`, error);
          }
        }

        await prisma.photo.deleteMany({
          where: {
            subCategoryId: subCategory.id,
            NOT: {
              publicId: { in: newSubCategoryPhotos },
            },
          },
        });

        await prisma.photo.createMany({
          data: subCategory.photos
            .filter(
              (photo) =>
                !currentSubCategoryPhotos.includes(photo.publicId)
            )
            .map((photo) => ({
              url: photo.url,
              publicId: photo.publicId,
              subCategoryId: subCategory.id,
            })),
        });

        await prisma.subCategory.update({
          where: { id: subCategory.id },
          data: {
            name: subCategory.name,
            description: subCategory.description,
          },
        });
      } else {
        
        let subCategorySlug = slugify(subCategory.name);

        const existedSubCategorySlug =
          await prisma.subCategory.findFirst({
            where: { slug: subCategorySlug },
          });

        if (existedSubCategorySlug) {
          subCategorySlug += `${subCategorySlug}${Math.floor(Math.random() * 100)}`;
        }

        const newSubCategory =
          await prisma.subCategory.create({
            data: {
              slug: subCategorySlug,
              name: subCategory.name,
              description: subCategory.description,
              categoryId,
            },
          });

        if (subCategory.photos.length > 0) {
          await prisma.photo.createMany({
            data: subCategory.photos.map((photo) => ({
              url: photo.url,
              publicId: photo.publicId,
              subCategoryId: newSubCategory.id,
            })),
          });
        }
      }
    }

    const updatedCategory =
      await prisma.category.findUnique({
        where: { id: categoryId },
        include: getCategoryDataInclude(),
      });

    revalidatePath("/");
    revalidateTag("categories");

    console.log(JSON.stringify(updatedCategory, null, 2));

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
