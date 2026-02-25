// ═══════════════════════════════════════════
// SYSTEM
// ═══════════════════════════════════════════

export const SYSTEM_ROLE = {
  user: "user",
  member: "member",
  admin: "admin",
  owner: "owner",
  super_admin: "super_admin",
} as const;

export type SystemRole = (typeof SYSTEM_ROLE)[keyof typeof SYSTEM_ROLE];

// ═══════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════

export const USER_STATUS = {
  pending: "pending",
  active: "active",
  inactive: "inactive",
  deleted: "deleted",
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

// ═══════════════════════════════════════════
// ORGANIZATION
// ═══════════════════════════════════════════

export const ORGANIZATION_STATUS = {
  pending: "pending",
  active: "active",
  inactive: "inactive",
  banned: "banned",
  deleted: "deleted",
} as const;

export type OrganizationStatus =
  (typeof ORGANIZATION_STATUS)[keyof typeof ORGANIZATION_STATUS];

export const INVITATION_STATUS = {
  pending: "pending",
  accepted: "accepted",
  rejected: "rejected",
  canceled: "canceled",
} as const;

export type InvitationStatus =
  (typeof INVITATION_STATUS)[keyof typeof INVITATION_STATUS];

// ═══════════════════════════════════════════
// MEDIA
// ═══════════════════════════════════════════

export const MEDIA_PROVIDER = {
  cloudinary: "cloudinary",
  cloudflare: "cloudflare",
  aws: "aws",
  firebase: "firebase",
  local: "local",
  other: "other",
} as const;

export type MediaProvider =
  (typeof MEDIA_PROVIDER)[keyof typeof MEDIA_PROVIDER];

export const MEDIA_FILE_TYPE = {
  image: "image",
  video: "video",
  audio: "audio",
  document: "document",
  archive: "archive",
  other: "other",
} as const;

export type MediaFileType =
  (typeof MEDIA_FILE_TYPE)[keyof typeof MEDIA_FILE_TYPE];

// ═══════════════════════════════════════════
// PRODUCT
// ═══════════════════════════════════════════

export const PRODUCT_STATUS = {
  draft: "draft",
  active: "active",
  inactive: "inactive",
  archived: "archived",
  discontinued: "discontinued",
} as const;

export type ProductStatus =
  (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

// ═══════════════════════════════════════════
// ORDER
// ═══════════════════════════════════════════

export const ORDER_CHANNEL = {
  pos: "pos",
  online: "online",
  marketplace: "marketplace",
  whatsapp: "whatsapp",
  manual: "manual",
} as const;

export type OrderChannel = (typeof ORDER_CHANNEL)[keyof typeof ORDER_CHANNEL];

export const ORDER_STATUS = {
  pending: "pending",
  confirmed: "confirmed",
  processing: "processing",
  printing: "printing",
  quality_check: "quality_check",
  packing: "packing",
  shipped: "shipped",
  delivered: "delivered",
  completed: "completed",
  cancelled: "cancelled",
  refunded: "refunded",
  on_hold: "on_hold",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

// ═══════════════════════════════════════════
// PAYMENT
// ═══════════════════════════════════════════

export const PAYMENT_METHOD = {
  cash: "cash",
  bank_transfer: "bank_transfer",
  qris: "qris",
  ewallet: "ewallet",
  virtual_account: "virtual_account",
  cod: "cod",
  credit_card: "credit_card",
  debit_card: "debit_card",
  other: "other",
} as const;

export type PaymentMethod =
  (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

export const PAYMENT_GATEWAY = {
  midtrans: "midtrans",
  xendit: "xendit",
  doku: "doku",
  ipaymu: "ipaymu",
  stripe: "stripe",
  paypal: "paypal",
  manual: "manual",
  other: "other",
} as const;

export type PaymentGateway =
  (typeof PAYMENT_GATEWAY)[keyof typeof PAYMENT_GATEWAY];

export const PAYMENT_STATUS = {
  pending: "pending",
  processing: "processing",
  paid: "paid",
  failed: "failed",
  expired: "expired",
  refunded: "refunded",
  partially_refunded: "partially_refunded",
  cancelled: "cancelled",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

// ═══════════════════════════════════════════
// REFUND
// ═══════════════════════════════════════════

export const REFUND_STATUS = {
  pending: "pending",
  processing: "processing",
  completed: "completed",
  failed: "failed",
  rejected: "rejected",
} as const;

export type RefundStatus = (typeof REFUND_STATUS)[keyof typeof REFUND_STATUS];

// ═══════════════════════════════════════════
// SHIPMENT
// ═══════════════════════════════════════════

export const SHIPMENT_STATUS = {
  pending: "pending",
  picked_up: "picked_up",
  in_transit: "in_transit",
  out_for_delivery: "out_for_delivery",
  delivered: "delivered",
  cancelled: "cancelled",
  on_hold: "on_hold",
  returned: "returned",
  failed: "failed",
} as const;

export type ShipmentStatus =
  (typeof SHIPMENT_STATUS)[keyof typeof SHIPMENT_STATUS];

export const COURIER = {
  jne: "jne",
  tiki: "tiki",
  pos: "pos",
  sicepat: "sicepat",
  anteraja: "anteraja",
  grab: "grab",
  gojek: "gojek",
  other: "other",
} as const;

export type Courier = (typeof COURIER)[keyof typeof COURIER];
