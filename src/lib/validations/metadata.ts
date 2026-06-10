import { z } from "zod";

// ==============================
// Schemas
// ==============================

/** JSONB metadata field — accepts any JSON-compatible record */
export const metadataSchema = z.record(z.string(), z.unknown()).optional();

/** Strict metadata that must be an object if provided */
export const requiredMetadataSchema = z.record(z.string(), z.unknown());
