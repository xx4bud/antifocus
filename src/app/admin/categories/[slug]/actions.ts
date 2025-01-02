"use server";

import { prisma } from "@/lib/prisma";
import { getCategoryDataInclude } from "@/lib/queries";
import { CategoriesSchema } from "@/lib/schemas";
import { slugify } from "@/lib/utils";

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

    CategoriesSchema.parse(data);

    const { name, photos, subCategories } = data;

    let categorySlug = slugify(name);

    const existedCategory = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (existedCategory) {
      categorySlug = `${categorySlug}-${Math.floor(Math.random() * 100)}`;
    }

    // Create the main category
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
      },
    });

    // Create subcategories and their photos
    for (const subCategory of subCategories) {
      const subCategorySlug = slugify(subCategory.name);
      const createdSubCategory = await prisma.subCategory.create({
        data: {
          name: subCategory.name,
          slug: subCategorySlug,
          description: subCategory.description,
          categoryId: newCategory.id,
        },
      });

      // Add photos for the subcategory
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

export async function updateCategory(
  categoryId: string,
  data: {
    name?: string;
    photos?: {
      url: string;
      publicId: string;
    }[];
    subCategories?: {
      id?: string;
      name: string;
      description: string;
      photos?: {
        url: string;
        publicId: string;
      }[];
    }[];
  }
) {
  try {
    if (data.name) {
      CategoriesSchema.parse(data);
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: data.name,
        slug: data.name ? slugify(data.name) : undefined,
        photos: {
          deleteMany: {},
          create: data.photos?.map((photo) => ({
            url: photo.url,
            publicId: photo.publicId,
          })),
        },
      },
    });

    if (data.subCategories) {
      for (const subCategory of data.subCategories) {
        if (subCategory.id) {
          await prisma.subCategory.update({
            where: { id: subCategory.id },
            data: {
              name: subCategory.name,
              slug: slugify(subCategory.name),
              description: subCategory.description,
              photos: {
                deleteMany: {},
                create: subCategory.photos?.map((photo) => ({
                  url: photo.url,
                  publicId: photo.publicId,
                })),
              },
            },
          });
        } else {
          await prisma.subCategory.create({
            data: {
              name: subCategory.name,
              slug: slugify(subCategory.name),
              description: subCategory.description,
              categoryId: categoryId,
              photos: {
                create: subCategory.photos?.map((photo) => ({
                  url: photo.url,
                  publicId: photo.publicId,
                })),
              },
            },
          });
        }
      }
    }

    const result = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        subCategories: {
          include: {
            photos: true,
          },
        },
        photos: true,
      },
    });

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

