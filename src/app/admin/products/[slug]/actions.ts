import { prisma } from "@/lib/prisma";
import {
  ProductsSchema,
  ProductVariantSchema,
} from "@/lib/schemas";
import { slugify } from "@/lib/utils";
import { revalidatePath, revalidateTag } from "next/cache";
import { cloudinary } from "@/lib/cloudinary";
import {
  getProductDataInclude,
  getSession,
} from "@/lib/queries";
import {
  Product,
  ProductVariant,
  Category,
  Photo,
} from "@prisma/client";

interface CreateProductData {
  name: string;
  photos: { url: string; publicId: string }[];
  description: string;
  subCategories: {
    id: string;
  }[];
  status: "AVAILABLE" | "ARCHIVED";
  price: number;
  stock: number;
  variants?: {
    name: string;
    price: number;
    stock: number;
    photos: { url: string; publicId: string }[];
  }[];
}

interface UpdateProductData extends CreateProductData {
  id: string;
}

interface DeleteProductData {
  productId: string;
}

export async function createProduct(
  data: CreateProductData
) {
  try {
    // Permissions
    const session = await getSession();
    const admin = session?.user.role === "ADMIN";

    if (!admin) {
      return {
        success: false,
        message: "You are not authorized",
      };
    }

    // Validate input data
    ProductsSchema.parse(data);
    const {
      name,
      photos,
      description,
      subCategories,
      status,
      price,
      stock,
      variants,
    } = data;

    if (
      !name ||
      !photos ||
      !description ||
      !subCategories ||
      !status
    ) {
      return {
        success: false,
        message: "All product fields are required",
      };
    }

    if (variants && variants.length > 0) {
      for (const variant of variants) {
        ProductVariantSchema.parse(variant);

        if (
          !variant.name ||
          !variant.price ||
          !variant.stock ||
          !variant.photos
        ) {
          return {
            success: false,
            message: "All variant fields are required",
          };
        }
      }
    }

    // Check for existing subcategories
    const subCategoryExists =
      await prisma.subCategory.findMany({
        where: {
          id: {
            in: subCategories.map(
              (category) => category.id
            ),
          },
        },
        select: { id: true },
      });

    if (subCategoryExists.length !== subCategories.length) {
      return {
        success: false,
        message: "Some subcategories do not exist",
      };
    }

    // Existing product slug
   let productSlug = slugify(name);
    const existingProduct = await prisma.product.findUnique(
      {
        where: { slug: productSlug },
      }
    );

    if (existingProduct) {
      return {
        success: false,
        message: `Product slug "${productSlug}" already exists`,
      };
    }

    // Create product
    const newProduct = await prisma.product.create({
      data: {
        slug: productSlug,
        name,
        description,
        status,
        price,
        stock,
        subCategories: {
          connect: subCategories.map((category) => ({
            id: category.id,
          })),
        },
        photos: {
          create: photos.map((photo) => ({
            url: photo.url,
            publicId: photo.publicId,
          })),
        },
        variants: {
          create: variants?.map((variant) => ({
            name: variant.name,
            price: variant.price,
            stock: variant.stock,
            photos: {
              create: variant.photos.map((photo) => ({
                url: photo.url,
                publicId: photo.publicId,
              })),
            },
          })),
        },
      },
    });

    revalidatePath("/");
    revalidateTag("products");

    return {
      success: true,
      data: newProduct,
    };
  } catch (error: any) {
    console.error("Error creating product:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function updateProduct(
  data: UpdateProductData
) {
  try {
    // Permissions
    const session = await getSession();
    const admin = session?.user.role === "ADMIN";

    if (!admin) {
      return {
        success: false,
        message: "You are not authorized",
      };
    }

    // Validate input data
    ProductsSchema.parse(data);
    const {
      id,
      name,
      photos,
      description,
      subCategories,
      status,
      price,
      stock,
      variants,
    } = data;

    if (!id) {
      return {
        success: false,
        message: "Product ID is required",
      };
    }

    // Existing product
    const existingProduct = await prisma.product.findUnique(
      {
        where: { id },
        include: getProductDataInclude(),
      }
    );

    if (!existingProduct) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    // Delete old photos
    const currentPhotos = existingProduct.photos.map(
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
      where: { productId: id },
    });

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        status,
        price,
        stock,
        subCategories: {
          set: [],
          connect: subCategories.map((category) => ({
            id: category.id,
          })),
        },
        photos: {
          create: photos.map((photo) => ({
            url: photo.url,
            publicId: photo.publicId,
          })),
        },
      },
    });

    const currentVariants = existingProduct.variants.map(
      (variant) => variant.id
    );
    const newVariants = variants?.map(
      (variant) => variant.id
    );
    const variantsToDelete = currentVariants.filter(
      (id) => !newVariants?.includes(id)
    );

    // Delete and recreate variants
    await prisma.productVariant.deleteMany({
      where: { productId: id },
    });

    await prisma.productVariant.deleteMany({
      where: { id: { in: variantsToDelete } },
    });

    const currentVariantPhotos =
      existingProduct.variants.flatMap((variant) =>
        variant.photos.map((photo) => photo.publicId)
      );
    const newVariantPhotos = variants?.flatMap((variant) =>
      variant.photos.map((photo) => photo.publicId)
    );
    const variantPhotosToDelete =
      currentVariantPhotos.filter(
        (id) => !newVariantPhotos?.includes(id)
      );

    for (const publicId of variantPhotosToDelete) {
      await cloudinary.v2.uploader.destroy(publicId);
    }

    for (const variant of variants!) {
      await prisma.productVariant.create({
        data: {
          productId: id,
          name: variant.name,
          price: variant.price,
          stock: variant.stock,
          photos: {
            create: variant.photos.map((photo) => ({
              url: photo.url,
              publicId: photo.publicId,
            })),
          },
        },
      });
    }

    revalidatePath("/");
    revalidateTag("products");

    return {
      success: true,
      data: updatedProduct,
    };
  } catch (error: any) {
    console.error("Error updating product:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function deleteProduct({
  productId,
}: DeleteProductData) {
  try {
    // Permissions
    const session = await getSession();
    const admin = session?.user.role === "ADMIN";

    if (!admin) {
      return {
        success: false,
        message: "You are not authorized",
      };
    }

    if (!productId) {
      return {
        success: false,
        message: "Product ID is required",
      };
    }

    // Existing product
    const existingProduct = await prisma.product.findUnique(
      {
        where: { id: productId },
        include: {
          photos: true,
          variants: { include: { photos: true } },
        },
      }
    );

    if (!existingProduct) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    // Delete photos
    for (const photo of existingProduct.photos) {
      await cloudinary.v2.uploader.destroy(photo.publicId);
    }

    await prisma.photo.deleteMany({ where: { productId } });

    // Delete variant photos
    for (const variant of existingProduct.variants) {
      for (const photo of variant.photos) {
        await cloudinary.v2.uploader.destroy(
          photo.publicId
        );
      }
    }

    await prisma.photo.deleteMany({
      where: {
        productId: {
          in: existingProduct.variants.map((v) => v.id),
        },
      },
    });

    // Delete variants
    await prisma.productVariant.deleteMany({
      where: { productId },
    });

    // Delete product
    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath("/");
    revalidateTag("products");

    return {
      success: true,
      message: "Product has been deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}
