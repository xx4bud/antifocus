import { relations } from "drizzle-orm";
import { index, jsonb, pgEnum, pgTable } from "drizzle-orm/pg-core";

// ============================================================================
// ENUMS
// ============================================================================

export const fileType = pgEnum("file_type", [
  "image",
  "video",
  "audio",
  "document",
  "archive",
  "other",
]);

export const uploadStatus = pgEnum("upload_status", [
  "pending",
  "uploading",
  "processing",
  "completed",
  "failed",
]);

export const storageProvider = pgEnum("storage_provider", [
  "s3",
  "cloudflare_r2",
  "google_cloud",
  "local",
]);

// ============================================================================
// FILES
// ============================================================================

export const files = pgTable(
  "files",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    userId: t.uuid().notNull(), // Uploader

    // File identification
    filename: t.text().notNull(),
    originalFilename: t.text().notNull(),
    mimeType: t.text().notNull(),
    fileType: fileType().notNull(),

    // Storage
    storageProvider: storageProvider().default("s3").notNull(),
    storagePath: t.text().notNull(), // S3 key or file path
    storageUrl: t.text().notNull(), // Public URL
    cdnUrl: t.text(), // CDN URL if different

    // File properties
    size: t.integer().notNull(), // bytes
    hash: t.text(), // SHA256 hash for deduplication

    // Metadata
    metadata: jsonb().$type<{
      width?: number;
      height?: number;
      duration?: number;
      format?: string;
      colorSpace?: string;
      hasAlpha?: boolean;
      exif?: Record<string, unknown>;
    }>(),

    // Upload info
    uploadSessionId: t.uuid(),
    uploadStatus: uploadStatus().default("completed").notNull(),

    // Organization
    folder: t.text(), // Virtual folder path: "/designs/2025/january"
    tags: jsonb().$type<string[]>(),
    description: t.text(),

    // Access control
    isPublic: t.boolean().default(false).notNull(),
    accessToken: t.text(), // For private file access
    expiresAt: t.timestamp(), // For temporary access

    // Usage tracking
    downloadCount: t.integer().default(0).notNull(),
    viewCount: t.integer().default(0).notNull(),

    // Soft delete
    deletedAt: t.timestamp(),
    deletedBy: t.uuid(),

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    index("files_user_idx").on(table.userId),
    index("files_type_idx").on(table.fileType),
    index("files_hash_idx").on(table.hash),
    index("files_folder_idx").on(table.folder),
  ]
);

// ============================================================================
// IMAGES (Extended metadata for images)
// ============================================================================

export const images = pgTable(
  "images",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    fileId: t
      .uuid()
      .notNull()
      .unique()
      .references(() => files.id, { onDelete: "cascade" }),

    // Dimensions
    width: t.integer().notNull(),
    height: t.integer().notNull(),
    aspectRatio: t.text(), // "16:9", "1:1"

    // Format & quality
    format: t.text().notNull(), // "PNG", "JPEG", "WebP", "SVG"
    colorMode: t.text(), // "RGB", "CMYK", "Grayscale"
    bitDepth: t.integer(),
    dpi: t.integer(),
    hasAlpha: t.boolean().default(false),

    // Color analysis
    dominantColors: jsonb().$type<string[]>(), // ["#FF0000", "#00FF00"]
    colorPalette: jsonb().$type<Array<{ color: string; percentage: number }>>(),

    // EXIF data
    exif: jsonb().$type<Record<string, unknown>>(),

    // AI/ML analysis
    labels: jsonb().$type<string[]>(), // Auto-generated labels
    aiDescription: t.text(),
    isNsfw: t.boolean().default(false),
    nsfwScore: t.integer(), // 0-100

    // Processing
    isProcessed: t.boolean().default(false).notNull(),
    processedAt: t.timestamp(),

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [index("images_file_idx").on(table.fileId)]
);

// ============================================================================
// THUMBNAILS
// ============================================================================

export const thumbnails = pgTable(
  "thumbnails",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    fileId: t
      .uuid()
      .notNull()
      .references(() => files.id, { onDelete: "cascade" }),

    // Thumbnail details
    size: t.text().notNull(), // "small", "medium", "large", "xlarge"
    width: t.integer().notNull(),
    height: t.integer().notNull(),

    // Storage
    url: t.text().notNull(),
    cdnUrl: t.text(),
    fileSize: t.integer(), // bytes

    // Format
    format: t.text().default("webp").notNull(),
    quality: t.integer().default(80),

    createdAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    index("thumbnails_file_idx").on(table.fileId),
    index("thumbnails_size_idx").on(table.size),
  ]
);

// ============================================================================
// UPLOAD SESSIONS (For chunked uploads)
// ============================================================================

export const uploadSessions = pgTable(
  "upload_sessions",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    userId: t.uuid().notNull(),

    // Session info
    filename: t.text().notNull(),
    totalSize: t.integer().notNull(),
    chunkSize: t.integer().notNull(),
    totalChunks: t.integer().notNull(),
    uploadedChunks: t.integer().default(0).notNull(),

    // Status
    status: uploadStatus().default("pending").notNull(),

    // Storage
    storageProvider: storageProvider().default("s3").notNull(),
    uploadKey: t.text(), // Multipart upload ID

    // Metadata
    metadata: jsonb().$type<Record<string, unknown>>(),

    // Error handling
    errorMessage: t.text(),
    retryCount: t.integer().default(0),

    // Expiry
    expiresAt: t.timestamp().notNull(),

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
    completedAt: t.timestamp(),
  }),
  (table) => [
    index("upload_sessions_user_idx").on(table.userId),
    index("upload_sessions_status_idx").on(table.status),
  ]
);

// ============================================================================
// CDN CACHE
// ============================================================================

export const cdnCache = pgTable(
  "cdn_cache",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    fileId: t
      .uuid()
      .notNull()
      .references(() => files.id, { onDelete: "cascade" }),

    // CDN info
    cdnProvider: t.text().default("cloudflare").notNull(),
    cdnUrl: t.text().notNull(),

    // Cache status
    isPurged: t.boolean().default(false).notNull(),
    lastPurgedAt: t.timestamp(),

    // Stats
    cacheHits: t.integer().default(0).notNull(),
    cacheMisses: t.integer().default(0).notNull(),
    bandwidth: t.integer().default(0).notNull(), // bytes transferred

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [index("cdn_cache_file_idx").on(table.fileId)]
);

// ============================================================================
// FOLDERS
// ============================================================================

export const folders = pgTable(
  "folders",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    userId: t.uuid().notNull(),

    // Folder details
    name: t.text().notNull(),
    path: t.text().notNull(), // Full path: "/designs/2025/january"
    parentId: t.uuid(),

    // Access
    isPublic: t.boolean().default(false).notNull(),

    // Stats
    fileCount: t.integer().default(0).notNull(),
    totalSize: t.integer().default(0).notNull(),

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t.timestamp().notNull().defaultNow(),
  }),
  (table) => [
    index("folders_user_idx").on(table.userId),
    index("folders_path_idx").on(table.path),
    index("folders_parent_idx").on(table.parentId),
  ]
);

// ============================================================================
// RELATIONS
// ============================================================================

export const filesRelations = relations(files, ({ one, many }) => ({
  image: one(images),
  thumbnails: many(thumbnails),
  cdnCache: one(cdnCache),
  uploadSession: one(uploadSessions, {
    fields: [files.uploadSessionId],
    references: [uploadSessions.id],
  }),
}));

export const imagesRelations = relations(images, ({ one }) => ({
  file: one(files, {
    fields: [images.fileId],
    references: [files.id],
  }),
}));

export const thumbnailsRelations = relations(thumbnails, ({ one }) => ({
  file: one(files, {
    fields: [thumbnails.fileId],
    references: [files.id],
  }),
}));

export const cdnCacheRelations = relations(cdnCache, ({ one }) => ({
  file: one(files, {
    fields: [cdnCache.fileId],
    references: [files.id],
  }),
}));

export const foldersRelations = relations(folders, ({ one, many }) => ({
  parent: one(folders, {
    fields: [folders.parentId],
    references: [folders.id],
  }),
  children: many(folders),
}));
