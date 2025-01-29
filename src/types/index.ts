import type { Prisma } from "@prisma/client";

// User Data
export type Role = "USER" | "ADMIN";

export function getPhotoDataSelect() {
  return {
    id: true,
    url: true,
    publicId: true,
    isCover: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  } satisfies Prisma.PhotoSelect;
}

export type PhotoData = Prisma.PhotoGetPayload<{
  select: ReturnType<typeof getPhotoDataSelect>;
}>;
