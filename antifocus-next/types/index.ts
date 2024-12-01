import { Prisma } from '@prisma/client';

export function getUserDataSelect(session: string) {
  return {
    id: true,
    name: true,
    username: true,
    image: true,
    createdAt: true,
    updatedAt: true,
    seller: {
      where: {
        userId: session,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

