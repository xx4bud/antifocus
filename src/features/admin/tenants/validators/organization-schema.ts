import { z } from "zod";

export const organizationInput = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and dashes"
    ),
  logo: z.string().optional().nullable(),
  status: z.enum(["active", "pending", "inactive", "banned"]),
});

export type OrganizationData = z.infer<typeof organizationInput>;
