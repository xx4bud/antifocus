import {
  categories,
  collectionProducts,
  collections,
  designStatus,
  designs,
  printProviderStatus,
  printProviders,
  productImages,
  productPrintProviders,
  productStatus,
  products,
  productTags,
  productVariants,
  tags,
  templateCategory,
  templates,
} from "@antifocus/db/product/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod/v4-mini";

// ============================================================================
// SELECT SCHEMAS
// ============================================================================

export const productStatusSchema = createSelectSchema(productStatus);

export type ProductStatusData = z.infer<typeof productStatusSchema>;

export const designStatusSchema = createSelectSchema(designStatus);

export type DesignStatusData = z.infer<typeof designStatusSchema>;

export const printProviderStatusSchema =
  createSelectSchema(printProviderStatus);

export type PrintProviderStatusData = z.infer<typeof printProviderStatusSchema>;

export const templateCategorySchema = createSelectSchema(templateCategory);

export type TemplateCategoryData = z.infer<typeof templateCategorySchema>;

export const categoriesSchema = createSelectSchema(categories);

export type CategoriesData = z.infer<typeof categoriesSchema>;

export const tagsSchema = createSelectSchema(tags);

export type TagsData = z.infer<typeof tagsSchema>;

export const productsSchema = createSelectSchema(products);

export type ProductsData = z.infer<typeof productsSchema>;

export const productVariantsSchema = createSelectSchema(productVariants);

export type ProductVariantsData = z.infer<typeof productVariantsSchema>;

export const productImagesSchema = createSelectSchema(productImages);

export type ProductImagesData = z.infer<typeof productImagesSchema>;

export const productTagsSchema = createSelectSchema(productTags);

export type ProductTagsData = z.infer<typeof productTagsSchema>;

export const designsSchema = createSelectSchema(designs);

export type DesignsData = z.infer<typeof designsSchema>;

export const templatesSchema = createSelectSchema(templates);

export type TemplatesData = z.infer<typeof templatesSchema>;

export const collectionsSchema = createSelectSchema(collections);

export type CollectionsData = z.infer<typeof collectionsSchema>;

export const collectionProductsSchema = createSelectSchema(collectionProducts);

export type CollectionProductsData = z.infer<typeof collectionProductsSchema>;

export const printProvidersSchema = createSelectSchema(printProviders);

export type PrintProvidersData = z.infer<typeof printProvidersSchema>;

export const productPrintProvidersSchema = createSelectSchema(
  productPrintProviders
);

export type ProductPrintProvidersData = z.infer<
  typeof productPrintProvidersSchema
>;

// ============================================================================
// INSERT SCHEMAS
// ============================================================================

export const insertCategoriesSchema = createInsertSchema(categories);

export type InsertCategories = z.infer<typeof insertCategoriesSchema>;

export const insertTagsSchema = createInsertSchema(tags);

export type InsertTags = z.infer<typeof insertTagsSchema>;

export const insertProductsSchema = createInsertSchema(products);

export type InsertProducts = z.infer<typeof insertProductsSchema>;

export const insertProductVariantsSchema = createInsertSchema(productVariants);

export type InsertProductVariants = z.infer<typeof insertProductVariantsSchema>;

export const insertProductImagesSchema = createInsertSchema(productImages);

export type InsertProductImages = z.infer<typeof insertProductImagesSchema>;

export const insertProductTagsSchema = createInsertSchema(productTags);

export type InsertProductTags = z.infer<typeof insertProductTagsSchema>;

export const insertDesignsSchema = createInsertSchema(designs);

export type InsertDesigns = z.infer<typeof insertDesignsSchema>;

export const insertTemplatesSchema = createInsertSchema(templates);

export type InsertTemplates = z.infer<typeof insertTemplatesSchema>;

export const insertCollectionsSchema = createInsertSchema(collections);

export type InsertCollections = z.infer<typeof insertCollectionsSchema>;

export const insertCollectionProductsSchema =
  createInsertSchema(collectionProducts);

export type InsertCollectionProducts = z.infer<
  typeof insertCollectionProductsSchema
>;

export const insertPrintProvidersSchema = createInsertSchema(printProviders);

export type InsertPrintProviders = z.infer<typeof insertPrintProvidersSchema>;

export const insertProductPrintProvidersSchema = createInsertSchema(
  productPrintProviders
);

export type InsertProductPrintProviders = z.infer<
  typeof insertProductPrintProvidersSchema
>;

// ============================================================================
// UPDATE SCHEMAS
// ============================================================================

export const updateCategoriesSchema = insertCategoriesSchema.partial();

export type UpdateCategories = z.infer<typeof updateCategoriesSchema>;

export const updateTagsSchema = insertTagsSchema.partial();

export type UpdateTags = z.infer<typeof updateTagsSchema>;

export const updateProductsSchema = insertProductsSchema.partial();

export type UpdateProducts = z.infer<typeof updateProductsSchema>;

export const updateProductVariantsSchema =
  insertProductVariantsSchema.partial();

export type UpdateProductVariants = z.infer<typeof updateProductVariantsSchema>;

export const updateProductImagesSchema = insertProductImagesSchema.partial();

export type UpdateProductImages = z.infer<typeof updateProductImagesSchema>;

export const updateProductTagsSchema = insertProductTagsSchema.partial();

export type UpdateProductTags = z.infer<typeof updateProductTagsSchema>;

export const updateDesignsSchema = insertDesignsSchema.partial();

export type UpdateDesigns = z.infer<typeof updateDesignsSchema>;

export const updateTemplatesSchema = insertTemplatesSchema.partial();

export type UpdateTemplates = z.infer<typeof updateTemplatesSchema>;

export const updateCollectionsSchema = insertCollectionsSchema.partial();

export type UpdateCollections = z.infer<typeof updateCollectionsSchema>;

export const updateCollectionProductsSchema =
  insertCollectionProductsSchema.partial();

export type UpdateCollectionProducts = z.infer<
  typeof updateCollectionProductsSchema
>;

export const updatePrintProvidersSchema = insertPrintProvidersSchema.partial();

export type UpdatePrintProviders = z.infer<typeof updatePrintProvidersSchema>;

export const updateProductPrintProvidersSchema =
  insertProductPrintProvidersSchema.partial();

export type UpdateProductPrintProviders = z.infer<
  typeof updateProductPrintProvidersSchema
>;
