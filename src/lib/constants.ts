export const UserRole = {
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  USER: "USER",
} as const;
export type UserRole =
  (typeof UserRole)[keyof typeof UserRole];

export const UserStatus = {
  ONLINE: "ONLINE",
  OFFLINE: "OFFLINE",
  SUSPENDED: "SUSPENDED",
  BANNED: "BANNED",
} as const;
export type UserStatus =
  (typeof UserStatus)[keyof typeof UserStatus];

export const ProductStatus = {
  LIVE: "LIVE",
  ARCHIVED: "ARCHIVED",
} as const;
export type ProductStatus =
  (typeof ProductStatus)[keyof typeof ProductStatus];
