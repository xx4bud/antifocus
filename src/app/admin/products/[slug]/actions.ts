"use server";

import { prisma, superjson } from "@/lib/prisma";
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
  ProductData,
} from "@/lib/queries";

export async function createProduct(data: {
  name: string;
  photos: { url: string; publicId: string }[];
  description: string;
  subCategories: {
    id: string;
  }[];
  status: "AVAILABLE" | "ARCHIVED";
  price?: number;
  stock?: number;
  variants?: {
    name: string;
    price: number;
    stock: number;
    photos: { url: string; publicId: string }[];
  }[];
}) {
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

    // if (
    //   !name ||
    //   !photos ||
    //   !description ||
    //   !subCategories ||
    //   !status
    // ) {
    //   return {
    //     success: false,
    //     message: "All product fields are required",
    //   };
    // }

    if (variants && variants.length > 0) {
      for (const variant of variants) {
        ProductVariantSchema.parse(variant);

        // if (
        //   !variant.name ||
        //   !variant.price ||
        //   !variant.stock ||
        //   !variant.photos
        // ) {
        //   return {
        //     success: false,
        //     message: "All variant fields are required",
        //   };
        // }
      }
    }

    // Check for existing subcategories
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
    // Buat produk baru
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
      include: {
        variants: true,
      },
    });

    // Konversi price dan variant.price menjadi string
    const formattedProduct = {
      ...newProduct,
      price: newProduct.price
        ? newProduct.price.toNumber()
        : 0,
      variants: newProduct.variants.map((variant) => ({
        ...variant,
        price: variant.price
          ? variant.price.toNumber()
          : 0,
      })),
    };

    // Serialisasi dengan SuperJSON
    const { json: serializedProduct } = superjson.serialize(
      formattedProduct
    );

    const newProductData =
      serializedProduct as unknown as ProductData;

    revalidatePath("/");
    revalidateTag("products");

    return {
      success: true,
      data: newProductData,
    };
  } catch (error: any) {
    console.error("Error creating product:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function updateProduct(data: {
  id: string;
  name: string;
  photos: { url: string; publicId: string }[];
  description: string;
  subCategories: {
    id: string;
  }[];
  status: "AVAILABLE" | "ARCHIVED";
  price?: number;
  stock?: number;
  variants?: {
    id?: string;
    name: string;
    price: number;
    stock: number;
    photos: { url: string; publicId: string }[];
  }[];
}) {
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
      id: productId,
      name,
      photos,
      description,
      subCategories,
      status,
      price,
      stock,
      variants,
    } = data;

    if (!productId) {
      return {
        success: false,
        message: "Product ID is required",
      };
    }

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
        // ProductVariantSchema.parse(variant);
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

    // Existing product
    const existingProduct = await prisma.product.findUnique(
      {
        where: { id: productId },
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
      where: { productId },
    });

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      include: getProductDataInclude(),
      data: {
        name,
        description,
        status,
        price: price ?? 0,
        stock: stock ?? 0,
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

    // delete and recreate variants
    const currentVariants = existingProduct.variants.map(
      (variant) => variant.id
    );
    const newVariants = variants?.map(
      (variant) => variant.id
    );
    const variantsToDelete = currentVariants.filter(
      (id) => !newVariants?.includes(id)
    );

    await prisma.productVariant.deleteMany({
      where: { productId },
    });

    await prisma.productVariant.deleteMany({
      where: { id: { in: variantsToDelete } },
    });

    // delete old variant photos
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

    await prisma.photo.deleteMany({
      where: { productId: { in: variantsToDelete } },
    });

    // update variants
    for (const variant of variants!) {
      if (variant.id) {
        await prisma.productVariant.update({
          where: { id: variant.id },
          data: {
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
      } else {
        // create new variant
        await prisma.productVariant.create({
          data: {
            productId: productId,
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
    }

    // Konversi price dan variant.price menjadi string
    const formattedProduct = {
      ...updatedProduct,
      price: updatedProduct.price
        ? updatedProduct.price.toNumber()
        : 0,
      variants: updatedProduct.variants.map((variant) => ({
        ...variant,
        price: variant.price
          ? variant.price.toNumber()
          : 0,
      })),
    };

    // Serialisasi dengan SuperJSON
    const { json: serializedProduct } = superjson.serialize(
      formattedProduct
    );

    const updatedProductData =
      serializedProduct as unknown as ProductData;

    revalidatePath("/");
    revalidateTag("products");

    return {
      success: true,
      data: updatedProductData,
    };
  } catch (error: any) {
    console.error("Error updating product:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function deleteProduct(productId: string) {
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
        include: getProductDataInclude(),
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

    await prisma.photo.deleteMany({
      where: { productId },
    });

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
          in: existingProduct.variants.map(
            (variant) => variant.id
          ),
        },
      },
    });

    // Delete variants
    await prisma.productVariant.deleteMany({
      where: { productId },
    });

    // Delete product
    const deletedProduct = await prisma.product.delete({
      where: { id: productId },
      include: getProductDataInclude(),
    });

    const formattedProduct = {
      ...deletedProduct,
      price: deletedProduct.price
        ? deletedProduct.price.toNumber()
        : 0,
      variants: deletedProduct.variants.map((variant) => ({
        ...variant,
        price: variant.price
          ? variant.price.toNumber()
          : 0,
      })),
    };

    // Serialisasi dengan SuperJSON
    const { json: serializedProduct } = superjson.serialize(
      formattedProduct
    );

    const deletedProductData =
      serializedProduct as unknown as ProductData;

    revalidatePath("/");
    revalidateTag("products");

    return {
      success: true,
      message: "Product has been deleted successfully",
      data: deletedProductData,
    };
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}
