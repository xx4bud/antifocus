import * as z from "zod";
import { PhotoSchema } from "./photo.schemas";

export const CategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(250, "Name must be less than 250 characters."),
  photos: z
    .array(PhotoSchema)
    .min(1, "At least one image is required."),
});

export type CategoryValues = z.infer<
  typeof CategorySchema
>;
