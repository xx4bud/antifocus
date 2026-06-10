import { db } from "../index";

export const getUserById = async (id: string) =>
  await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, id),
  });

export const getUserByEmail = async (email: string) =>
  await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });

export const listUsers = async (limit = 50, offset = 0) =>
  await db.query.users.findMany({
    limit,
    offset,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  });
