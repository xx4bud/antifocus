import * as z from "zod";

// Photo Schema
export const PhotoSchema = z.object({
  url: z
    .string()
    .trim()
    .url("Invalid image URL.")
    .min(1, "Image URL is required."),
  publicId: z.string().trim().nullable(),
  position: z.coerce.number().default(0),
});

export type PhotoValues = z.infer<typeof PhotoSchema>;
