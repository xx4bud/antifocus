import { z } from "zod";

export const signInSocialSchema = z.object({
  provider: z.enum(["google", "github", "discord"]),
  callbackURL: z.string().optional(),
});

export type SignInSocialSchema = z.infer<typeof signInSocialSchema>;
