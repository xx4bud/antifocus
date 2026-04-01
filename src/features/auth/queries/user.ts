import type { Identifier } from "@/features/auth/validators/identifier";
import { db } from "@/lib/db/client";

/**
 * Get user by ID
 */
export async function getUserById(id: string) {
  return db.query.users.findFirst({
    where: (table, { eq }) => eq(table.id, id),
  });
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  return db.query.users.findFirst({
    where: (table, { eq }) => eq(table.email, email.toLowerCase()),
  });
}

/**
 * Get user by username
 */
export async function getUserByUsername(username: string) {
  return db.query.users.findFirst({
    where: (table, { eq }) => eq(table.username, username),
  });
}

/**
 * Get user by phone number
 */
export async function getUserByPhoneNumber(phoneNumber: string) {
  return db.query.users.findFirst({
    where: (table, { eq }) => eq(table.phoneNumber, phoneNumber),
  });
}

/**
 * Get user by identifier (composite lookup)
 */
export async function getUserByIdentifier(identifier: Identifier) {
  switch (identifier.type) {
    case "email":
      return getUserByEmail(identifier.value);
    case "phone_number":
      return getUserByPhoneNumber(identifier.value);
    case "username":
      return getUserByUsername(identifier.value);
    default:
      return null;
  }
}
