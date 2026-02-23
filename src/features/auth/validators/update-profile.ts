import { z } from "zod";
import { nameSchema } from "~/lib/validators/name";
import { usernameSchema } from "~/lib/validators/username";

export const updateNameInput = z.object({
  name: nameSchema(),
});

export type UpdateNameData = z.infer<typeof updateNameInput>;

export const updateUsernameInput = z.object({
  username: usernameSchema(),
});

export type UpdateUsernameData = z.infer<typeof updateUsernameInput>;

export const updateImageInput = z.object({
  image: z
    .string()
    .url({ message: "URL gambar tidak valid" })
    .or(z.literal("")),
});

export type UpdateImageData = z.infer<typeof updateImageInput>;
