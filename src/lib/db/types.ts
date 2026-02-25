import type {
  // auths
  accounts,
  activityLogs,
  // marketing
  banners,
  // categories
  categories,
  // organizations
  customers,
  invitations,
  // medias
  medias,
  members,
  orderItemMedias,
  // orders
  orderItems,
  orders,
  organizationRoles,
  organizations,
  // payments
  payments,
  productCategories,
  productMedias,
  products,
  productVariantMedias,
  // products
  productVariants,
  refunds,
  sessions,
  userRoles,
  users,
  verifications,
} from "~/lib/db/schemas";
import type { AuthUser } from "~/utils/types";

// ==============================
// USER TYPES
// ==============================

export type User = typeof users.$inferSelect | AuthUser;
export type NewUser = typeof users.$inferInsert;

export type UserRole = typeof userRoles.$inferSelect;
export type NewUserRole = typeof userRoles.$inferInsert;

// ==============================
// AUTH TYPES
// ==============================

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type Verification = typeof verifications.$inferSelect;
export type NewVerification = typeof verifications.$inferInsert;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;

// ==============================
// ORGANIZATION TYPES
// ==============================

export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;

export type OrganizationRole = typeof organizationRoles.$inferSelect;
export type NewOrganizationRole = typeof organizationRoles.$inferInsert;

export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;

export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

// ==============================
// PRODUCT TYPES
// ==============================

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;

// ==============================
// CATEGORY TYPES
// ==============================

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type CategoryProduct = typeof productCategories.$inferSelect;
export type NewCategoryProduct = typeof productCategories.$inferInsert;

// ==============================
// MEDIA TYPES
// ==============================

export type Media = typeof medias.$inferSelect;
export type NewMedia = typeof medias.$inferInsert;

export type ProductMedia = typeof productMedias.$inferSelect;
export type NewProductMedia = typeof productMedias.$inferInsert;

export type ProductVariantMedia = typeof productVariantMedias.$inferSelect;
export type NewProductVariantMedia = typeof productVariantMedias.$inferInsert;

export type OrderItemMedia = typeof orderItemMedias.$inferSelect;
export type NewOrderItemMedia = typeof orderItemMedias.$inferInsert;

// ==============================
// ORDER TYPES
// ==============================

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

// ==============================
// PAYMENT TYPES
// ==============================

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

export type Refund = typeof refunds.$inferSelect;
export type NewRefund = typeof refunds.$inferInsert;

// ==============================
// MARKETING TYPES
// ==============================

export type Banner = typeof banners.$inferSelect;
export type NewBanner = typeof banners.$inferInsert;
