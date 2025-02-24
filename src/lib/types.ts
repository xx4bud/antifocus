import { Prisma } from "@prisma/client";
import { UserRole, UserStatus } from "./constants";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User &
      DefaultSession["user"] & {
        slug: string;
        phone?: string;
        media?: MediaData[];
        role: UserRole;
        status: UserStatus;
        password?: string;
      };
  }

  interface User {
    slug: string;
    phone?: string;
    media?: MediaData[];
    role: UserRole;
    status: UserStatus;
    password?: string;
  }
}

// User Data
export function getUserInclude() {
  return {
    media: {
      include: getMediaInclude(),
    },
    accounts: true,
    sessions: true,
  } satisfies Prisma.UserInclude;
}
export type UserData = Prisma.UserGetPayload<{
  include: ReturnType<typeof getUserInclude>;
}>;

// Product Data
export function getProductInclude() {
  return {
    media: {
      include: getMediaInclude(),
    },
    categories: {
      include: getCategoryInclude(),
    },
  } satisfies Prisma.ProductInclude;
}
export type ProductData = Prisma.ProductGetPayload<{
  include: ReturnType<typeof getProductInclude>;
}>;

// Category Data
export function getCategoryInclude() {
  return {
    media: {
      include: getMediaInclude(),
    },
    children: true,
    products: true,
    parent: true,
  } satisfies Prisma.CategoryInclude;
}
export type CategoryData = Prisma.CategoryGetPayload<{
  include: ReturnType<typeof getCategoryInclude>;
}>;

// Media Data
export function getMediaInclude() {
  return {
    user: true,
    category: true,
    product: true,
  } satisfies Prisma.MediaInclude;
}
export type MediaData = Prisma.MediaGetPayload<{
  include: ReturnType<typeof getMediaInclude>;
}>;
