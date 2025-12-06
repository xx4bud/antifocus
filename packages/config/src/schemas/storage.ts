import {
  fileType,
  uploadStatus,
  storageProvider,
  files,
  images,
  thumbnails,
  uploadSessions,
  cdnCache,
  folders,
} from "@antifocus/db/storage/schema";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import type { z } from "zod/v4-mini";

// ============================================================================
// SELECT SCHEMAS
// ============================================================================

export const fileTypeSchema = createSelectSchema(fileType);

export type FileTypeData = z.infer<typeof fileTypeSchema>;

export const uploadStatusSchema = createSelectSchema(uploadStatus);

export type UploadStatusData = z.infer<typeof uploadStatusSchema>;

export const storageProviderSchema = createSelectSchema(storageProvider);

export type StorageProviderData = z.infer<typeof storageProviderSchema>;

export const filesSchema = createSelectSchema(files);

export type FilesData = z.infer<typeof filesSchema>;

export const imagesSchema = createSelectSchema(images);

export type ImagesData = z.infer<typeof imagesSchema>;

export const thumbnailsSchema = createSelectSchema(thumbnails);

export type ThumbnailsData = z.infer<typeof thumbnailsSchema>;

export const uploadSessionsSchema = createSelectSchema(uploadSessions);

export type UploadSessionsData = z.infer<typeof uploadSessionsSchema>;

export const cdnCacheSchema = createSelectSchema(cdnCache);

export type CdnCacheData = z.infer<typeof cdnCacheSchema>;

export const foldersSchema = createSelectSchema(folders);

export type FoldersData = z.infer<typeof foldersSchema>;

// ============================================================================
// INSERT SCHEMAS
// ============================================================================

export const insertFilesSchema = createInsertSchema(files);

export type InsertFiles = z.infer<typeof insertFilesSchema>;

export const insertImagesSchema = createInsertSchema(images);

export type InsertImages = z.infer<typeof insertImagesSchema>;

export const insertThumbnailsSchema = createInsertSchema(thumbnails);

export type InsertThumbnails = z.infer<typeof insertThumbnailsSchema>;

export const insertUploadSessionsSchema = createInsertSchema(uploadSessions);

export type InsertUploadSessions = z.infer<typeof insertUploadSessionsSchema>;

export const insertCdnCacheSchema = createInsertSchema(cdnCache);

export type InsertCdnCache = z.infer<typeof insertCdnCacheSchema>;

export const insertFoldersSchema = createInsertSchema(folders);

export type InsertFolders = z.infer<typeof insertFoldersSchema>;

// ============================================================================
// UPDATE SCHEMAS
// ============================================================================

export const updateFilesSchema = insertFilesSchema.partial();

export type UpdateFiles = z.infer<typeof updateFilesSchema>;

export const updateImagesSchema = insertImagesSchema.partial();

export type UpdateImages = z.infer<typeof updateImagesSchema>;

export const updateThumbnailsSchema = insertThumbnailsSchema.partial();

export type UpdateThumbnails = z.infer<typeof updateThumbnailsSchema>;

export const updateUploadSessionsSchema = insertUploadSessionsSchema.partial();

export type UpdateUploadSessions = z.infer<typeof updateUploadSessionsSchema>;

export const updateCdnCacheSchema = insertCdnCacheSchema.partial();

export type UpdateCdnCache = z.infer<typeof updateCdnCacheSchema>;

export const updateFoldersSchema = insertFoldersSchema.partial();

export type UpdateFolders = z.infer<typeof updateFoldersSchema>;
