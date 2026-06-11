import { createId } from "@paralleldrive/cuid2";

/**
 * Generates a globally unique, secure, and collation-friendly CUID2 identifier.
 */
export const generateId = (): string => createId();
