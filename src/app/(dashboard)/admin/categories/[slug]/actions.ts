"use server";

import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { getSession, slugify } from "@/lib/utils";
import {
  CategorySchema,
  CategoryValues,
  SubCategorySchema,
} from "@/lib/validation";
import { getCategoryDataInclude } from "@/types";
import { revalidateTag, revalidatePath } from "next/cache";

export async function submitCategory(data: CategoryValues) {
  const session = await getSession();
  const admin = session?.user.role === "ADMIN";

  if (!admin) {
    return {
      success: false,
      message: "You are not authorized.",
    };
  }

  const validated = CategorySchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      message: validated.error.message,
    };
  }
  const { name, photos, subCategories, isFeatured } =
    validated.data;

  for (const subCategory of subCategories) {
    const validated =
      SubCategorySchema.safeParse(subCategory);
    if (!validated.success) {
      return {
        success: false,
        message: validated.error.message,
      };
    }
    const subCategorySlug = slugify(subCategory.name);
    const existingSubCategorySlug =
      await prisma.subCategory.findUnique({
        where: {
          slug: subCategorySlug,
        },
      });
    if (existingSubCategorySlug) {
      return {
        success: false,
        message: `Subcategory "${subCategorySlug}" already exists`,
      };
    }
  }

  const categorySlug = slugify(name);
  const existingCategorySlug =
    await prisma.category.findUnique({
      where: {
        slug: categorySlug,
      },
    });
  if (existingCategorySlug) {
    return {
      success: false,
      message: `Category "${categorySlug}" already exists`,
    };
  }

  const newCategory = await prisma.category.create({
    data: {
      name,
      slug: categorySlug,
      isFeatured,
      photos: {
        create: photos.map((photo) => ({
          url: photo.url,
          publicId: photo.publicId,
          position: photo.position,
        })),
      },
    },
  });

  for (const subCategory of subCategories) {
    await prisma.subCategory.create({
      data: {
        categoryId: newCategory.id,
        name: subCategory.name,
        slug: slugify(subCategory.name),
        isFeatured: subCategory.isFeatured,
        photos: {
          create: subCategory.photos.map((photo) => ({
            url: photo.url,
            publicId: photo.publicId,
            position: photo.position,
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
    message: "Category created successfully",
  };
}

export async function updateCategory(data: CategoryValues) {
  const session = await getSession();
  const admin = session?.user.role === "ADMIN";

  if (!admin) {
    return {
      success: false,
      message: "You are not authorized",
    };
  }

  const validated = CategorySchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      message: validated.error.message,
    };
  }
  const {
    id: categoryId,
    isFeatured,
    name,
    photos,
    subCategories,
  } = validated.data;

  for (const subCategory of subCategories) {
    const validated =
      SubCategorySchema.safeParse(subCategory);
    if (!validated.success) {
      return {
        success: false,
        message: validated.error.message,
      };
    }
  }

  const existingCategory = await prisma.category.findUnique(
    {
      where: { id: categoryId },
      include: getCategoryDataInclude(),
    }
  );
  if (!existingCategory) {
    return {
      success: false,
      message: "Category not found",
    };
  }

  const photosToDelete = existingCategory.photos.filter(
    (photo) =>
      !photos.some((p) => p.publicId === photo.publicId)
  );
  await Promise.all(
    photosToDelete.map((photo) =>
      cloudinary.v2.uploader.destroy(photo.publicId!)
    )
  );
  await prisma.photo.deleteMany({
    where: {
      categoryId,
    },
  });

  const updatedCategory = await prisma.category.update({
    where: { id: categoryId },
    data: {
      name,
      isFeatured,
      photos: {
        create: photos.map((photo) => ({
          url: photo.url,
          publicId: photo.publicId,
          position: photo.position,
        })),
      },
    },
  });

  const existingSubIds = existingCategory.subCategories.map(
    (sub) => sub.id
  );
  const newSubIds = subCategories.map((sub) => sub.id);
  const subsToDelete = existingSubIds.filter(
    (id) => !newSubIds.includes(id)
  );

  await prisma.subCategory.deleteMany({
    where: {
      id: {
        in: subsToDelete,
      },
    },
  });

  const currentSubPhotos = existingCategory.subCategories
    .map((sub) => sub.photos.map((photo) => photo.publicId))
    .flat();
  const newSubPhotos = subCategories
    .map((sub) => sub.photos.map((photo) => photo.publicId))
    .flat();
  const subPhotosToDelete = currentSubPhotos.filter(
    (id) => !newSubPhotos.includes(id!)
  );

  for (const publicId of subPhotosToDelete) {
    await cloudinary.v2.uploader.destroy(publicId!);
  }

  await prisma.photo.deleteMany({
    where: {
      subCategory: {
        categoryId,
      },
    },
  });

  for (const subCategory of subCategories) {
    if (subCategory.id) {
      await prisma.subCategory.update({
        where: { id: subCategory.id },
        data: {
          name: subCategory.name,
          isFeatured: subCategory.isFeatured,
          photos: {
            create: subCategory.photos.map((photo) => ({
              url: photo.url,
              publicId: photo.publicId,
              position: photo.position,
            })),
          },
        },
      });
    } else {
      const subCategorySlug = slugify(subCategory.name);
      const existingSubCategorySlug =
        await prisma.subCategory.findUnique({
          where: {
            slug: subCategorySlug,
          },
        });
      if (existingSubCategorySlug) {
        return {
          success: false,
          message: `Subcategory "${subCategorySlug}" already exists`,
        };
      }
      await prisma.subCategory.create({
        data: {
          categoryId,
          name: subCategory.name,
          slug: subCategorySlug,
          isFeatured: subCategory.isFeatured,
          photos: {
            create: subCategory.photos.map((photo) => ({
              url: photo.url,
              publicId: photo.publicId,
              position: photo.position,
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
    message: "Category updated successfully",
  };
}

export async function deleteCategory(categoryId: string) {
  const session = await getSession();
  const admin = session?.user.role === "ADMIN";

  if (!admin) {
    return {
      success: false,
      message: "You are not authorized",
    };
  }

  if (!categoryId) {
    return {
      success: false,
      message: "Category ID is required",
    };
  }

  const existingCategory = await prisma.category.findUnique(
    {
      where: {
        id: categoryId,
      },
      include: getCategoryDataInclude(),
    }
  );

  if (!existingCategory) {
    return {
      success: false,
      message: "Category not found",
    };
  }

  await Promise.all(
    existingCategory.photos.map((photo) =>
      cloudinary.v2.uploader.destroy(photo.publicId!)
    )
  );
  await prisma.photo.deleteMany({
    where: { categoryId },
  });
  await prisma.subCategory.deleteMany({
    where: { categoryId },
  });
  await prisma.category.delete({
    where: { id: categoryId },
  });

  revalidatePath("/");
  revalidateTag("categories");

  return {
    success: true,
    message: "Category deleted successfully",
  };
}
