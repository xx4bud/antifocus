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
    const { name, photos, subCategories } = data;

    if (!name) {
      return {
        success: false,
        message: "Name is required",
      };
    }

    if (photos.length === 0) {
      return {
        success: false,
        message: "At least one photo is required",
      };
    }

    if (subCategories.length === 0) {
      return {
        success: false,
        message: "At least one subcategory is required",
      };
    }

    if (subCategories.length > 0) {
      for (const subCategory of subCategories) {
        if (!subCategory.name) {
          return {
            success: false,
            message: "Subcategory name is required",
          };
        }

        if (!subCategory.description) {
          return {
            success: false,
            message: "Subcategory description is required",
          };
        }

        if (subCategory.photos.length === 0) {
          return {
            success: false,
            message: "At least one photo is required for each subcategory",
          };
        }
      }
    }

    // create slug for category
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

    // create subcategories
    for (const subCategory of subCategories) {
      const subCategorySlug = slugify(subCategory.name);
      const existingSubCategorySlug =
        await prisma.category.findUnique({
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

    console.log(JSON.stringify(newCategory, null, 2));
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

    if (!name) {
      return {
        success: false,
        message: "Name is required",
      };
    }

    if (photos.length === 0) {
      return {
        success: false,
        message: "At least one photo is required",
      };
    }

    if (subCategories.length === 0) {
      return {
        success: false,
        message: "At least one subcategory is required",
      };
    }

    if (subCategories.length > 0) {
      for (const subCategory of subCategories) {
        if (!subCategory.name) {
          return {
            success: false,
            message: "Subcategory name is required",
          };
        }

        if (!subCategory.description) {
          return {
            success: false,
            message: "Subcategory description is required",
          };
        }

        if (subCategory.photos.length === 0) {
          return {
            success: false,
            message: "Subcategory photos are required",
          };
        }
      }
    }

    // check if category exists
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
      existingCategory.subCategories.map(
        (subCategory) => subCategory.id
      );
    const newSubCategories = subCategories.map(
      (subCategory) => subCategory.id
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

    const currentSubCategoryPhotos = existingCategory.subCategories
      .map((sub) => sub.photos.map((photo) => photo.publicId))
      .flat();
    const newSubCategoryPhotos = subCategories
      .map((sub) => sub.photos.map((photo) => photo.publicId))
      .flat();
    const subCategoryPhotosToDelete = currentSubCategoryPhotos.filter(
      (id) => !newSubCategoryPhotos.includes(id)
    );

    if (subCategoryPhotosToDelete.length > 0) {
      for (const publicId of subCategoryPhotosToDelete) {
        try {
          await cloudinary.v2.uploader.destroy(publicId);
        } catch (error) {
          console.error(`Error deleting sub photo:`, error);
        }
      }
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

        const currentSubPhotos = existingCategory.subCategories
          .find((sub) => sub.id === subCategory.id)
          ?.photos.map((photo) => photo.publicId) || [];

        const newSubPhotos = subCategory.photos.map(
          (photo) => photo.publicId
        );
        const subPhotosToDelete = currentSubPhotos.filter(
          (id) => !newSubPhotos.includes(id)
        );

        if (subPhotosToDelete.length > 0) {
          for (const publicId of subPhotosToDelete) {
            try {
              await cloudinary.v2.uploader.destroy(publicId);
            } catch (error) {
              console.error(`Error deleting sub photo:`, error);
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
        await prisma.subCategory.create({
          data: {
            categoryId: updatedCategory.id,
            slug: slugify(subCategory.name),
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

    console.log(JSON.stringify(updatedCategory, null, 2));
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
