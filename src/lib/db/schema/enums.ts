// ==============================
// Base Enums
// ==============================

export const ENTITY_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  BANNED: "banned",
  DELETED: "deleted",
} as const;
export type EntityStatus = (typeof ENTITY_STATUS)[keyof typeof ENTITY_STATUS];
export const DEFAULT_ENTITY_STATUS: EntityStatus = ENTITY_STATUS.ACTIVE;

// ==============================
// Auth Enums
// ==============================

export const USER_ROLE = {
  USER: "user",
  SUPERADMIN: "superadmin",
} as const;
export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
export const DEFAULT_USER_ROLE: UserRole = USER_ROLE.USER;

// ==============================
// Org Enums
// ==============================

export const ORG_ROLE = {
  MEMBER: "member",
  ADMIN: "admin",
  OWNER: "owner",
} as const;
export type OrgRole = (typeof ORG_ROLE)[keyof typeof ORG_ROLE];
export const DEFAULT_ORG_ROLE: OrgRole = ORG_ROLE.MEMBER;

export const INVITATION_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  CANCELED: "canceled", // Typo by Better Auth
} as const;
export type InvitationStatus =
  (typeof INVITATION_STATUS)[keyof typeof INVITATION_STATUS];
export const DEFAULT_INVITATION_STATUS: InvitationStatus =
  INVITATION_STATUS.PENDING;
