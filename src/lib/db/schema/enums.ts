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

export const BRANCH_STATUS = {
  OPEN: "open",
  CLOSED: "closed",
  MAINTENANCE: "maintenance",
  ARCHIVED: "archived",
} as const;
export type BranchStatus = (typeof BRANCH_STATUS)[keyof typeof BRANCH_STATUS];
export const DEFAULT_BRANCH_STATUS: BranchStatus = BRANCH_STATUS.OPEN;

// ==============================
// Core Enums
// ==============================

export const ADDRESS_TYPE = {
  MIXED: "mixed",
  BILLING: "billing",
  SHIPPING: "shipping",
} as const;
export type AddressType = (typeof ADDRESS_TYPE)[keyof typeof ADDRESS_TYPE];
export const DEFAULT_ADDRESS_TYPE: AddressType = ADDRESS_TYPE.MIXED;

// ==============================
// Taxonomy Enums
// ==============================

export const ATTRIBUTE_TYPE = {
  SELECT: "select",
  TEXT: "text",
  NUMBER: "number",
  BOOLEAN: "boolean",
  DATETIME: "datetime",
} as const;
export type AttributeType =
  (typeof ATTRIBUTE_TYPE)[keyof typeof ATTRIBUTE_TYPE];
export const DEFAULT_ATTRIBUTE_TYPE: AttributeType = ATTRIBUTE_TYPE.SELECT;

// ==============================
// Catalog Enums
// ==============================

export const PRODUCT_STATUS = {
  DRAFT: "draft",
  LIVE: "live",
  DISCONTINUED: "discontinued",
  ARCHIVED: "archived",
} as const;
export type ProductStatus =
  (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];
export const DEFAULT_PRODUCT_STATUS: ProductStatus = PRODUCT_STATUS.DRAFT;

export const PRODUCT_TYPE = {
  GOOD: "good",
  SERVICE: "service",
  BLANK: "blank",
  MATERIAL: "material",
  DIGITAL: "digital",
} as const;
export type ProductType = (typeof PRODUCT_TYPE)[keyof typeof PRODUCT_TYPE];
export const DEFAULT_PRODUCT_TYPE: ProductType = PRODUCT_TYPE.GOOD;

export const DESIGN_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;
export type DesignStatus = (typeof DESIGN_STATUS)[keyof typeof DESIGN_STATUS];
export const DEFAULT_DESIGN_STATUS: DesignStatus = DESIGN_STATUS.PENDING;

// ==============================
// Finance Enums
// ==============================

export const PAYMENT_METHOD_TYPE = {
  CASH: "cash",
  BANK_TRANSFER: "bank_transfer",
  DEBIT_CARD: "debit_card",
  CREDIT_CARD: "credit_card",
  EWALLET: "ewallet",
} as const;
export type PaymentMethodType =
  (typeof PAYMENT_METHOD_TYPE)[keyof typeof PAYMENT_METHOD_TYPE];

export const FEE_TYPE = {
  PERCENTAGE: "percentage",
  FIXED: "fixed",
} as const;
export type FeeType = (typeof FEE_TYPE)[keyof typeof FEE_TYPE];

export const PAYMENT_TYPE = {
  INBOUND: "inbound",
  OUTBOUND: "outbound",
  TRANSFER: "transfer",
} as const;
export type PaymentType = (typeof PAYMENT_TYPE)[keyof typeof PAYMENT_TYPE];

export const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;
export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];
export const DEFAULT_PAYMENT_STATUS: PaymentStatus = PAYMENT_STATUS.PENDING;

export const INVOICE_STATUS = {
  DRAFT: "draft",
  ISSUED: "issued",
  PARTIALLY_PAID: "partially_paid",
  PAID: "paid",
  OVERDUE: "overdue",
  CANCELLED: "cancelled",
} as const;
export type InvoiceStatus =
  (typeof INVOICE_STATUS)[keyof typeof INVOICE_STATUS];
export const DEFAULT_INVOICE_STATUS: InvoiceStatus = INVOICE_STATUS.DRAFT;

export const BILL_STATUS = {
  DRAFT: "draft",
  RECEIVED: "received",
  PARTIALLY_PAID: "partially_paid",
  PAID: "paid",
  OVERDUE: "overdue",
  CANCELLED: "cancelled",
} as const;
export type BillStatus = (typeof BILL_STATUS)[keyof typeof BILL_STATUS];
export const DEFAULT_BILL_STATUS: BillStatus = BILL_STATUS.DRAFT;

// ==============================
// Supply Enums
// ==============================

export const PURCHASE_ORDER_STATUS = {
  DRAFT: "draft",
  PENDING_APPROVAL: "pending_approval",
  APPROVED: "approved",
  ORDERED: "ordered",
  RECEIVING: "receiving",
  PARTIALLY_RECEIVED: "partially_received",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;
export type PurchaseOrderStatus =
  (typeof PURCHASE_ORDER_STATUS)[keyof typeof PURCHASE_ORDER_STATUS];
export const DEFAULT_PURCHASE_ORDER_STATUS: PurchaseOrderStatus =
  PURCHASE_ORDER_STATUS.DRAFT;

export const PURCHASE_PAYMENT_STATUS = {
  UNPAID: "unpaid",
  PARTIAL: "partial",
  PAID: "paid",
} as const;
export type PurchasePaymentStatus =
  (typeof PURCHASE_PAYMENT_STATUS)[keyof typeof PURCHASE_PAYMENT_STATUS];
export const DEFAULT_PURCHASE_PAYMENT_STATUS: PurchasePaymentStatus =
  PURCHASE_PAYMENT_STATUS.UNPAID;

export const INVENTORY_MOVEMENT_TYPE = {
  PURCHASE_RECEIPT: "purchase_receipt",
  SALES_DELIVERY: "sales_delivery",
  PRODUCTION_CONSUME: "production_consume",
  PRODUCTION_RECEIPT: "production_receipt",
  TRANSFER_IN: "transfer_in",
  TRANSFER_OUT: "transfer_out",
  ADJUSTMENT_ADD: "adjustment_add",
  ADJUSTMENT_DEDUCT: "adjustment_deduct",
} as const;
export type InventoryMovementType =
  (typeof INVENTORY_MOVEMENT_TYPE)[keyof typeof INVENTORY_MOVEMENT_TYPE];

export const INVENTORY_TRANSFER_STATUS = {
  DRAFT: "draft",
  REQUESTED: "requested",
  IN_TRANSIT: "in_transit",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;
export type InventoryTransferStatus =
  (typeof INVENTORY_TRANSFER_STATUS)[keyof typeof INVENTORY_TRANSFER_STATUS];
export const DEFAULT_INVENTORY_TRANSFER_STATUS: InventoryTransferStatus =
  INVENTORY_TRANSFER_STATUS.DRAFT;

// ==============================
// Order Enums
// ==============================

export const ORDER_SESSION_STATUS = {
  OPENING: "opening",
  IN_PROGRESS: "in_progress",
  CLOSING: "closing",
  CLOSED: "closed",
} as const;
export type OrderSessionStatus =
  (typeof ORDER_SESSION_STATUS)[keyof typeof ORDER_SESSION_STATUS];
export const DEFAULT_ORDER_SESSION_STATUS: OrderSessionStatus =
  ORDER_SESSION_STATUS.OPENING;

export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  READY_FOR_PICKUP: "ready_for_pickup",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  RETURNED: "returned",
} as const;
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
export const DEFAULT_ORDER_STATUS: OrderStatus = ORDER_STATUS.PENDING;

export const ORDER_PAYMENT_STATUS = {
  UNPAID: "unpaid",
  PARTIAL: "partial",
  PAID: "paid",
  REFUNDED: "refunded",
} as const;
export type OrderPaymentStatus =
  (typeof ORDER_PAYMENT_STATUS)[keyof typeof ORDER_PAYMENT_STATUS];
export const DEFAULT_ORDER_PAYMENT_STATUS: OrderPaymentStatus =
  ORDER_PAYMENT_STATUS.UNPAID;

export const ORDER_FULFILLMENT_STATUS = {
  UNFULFILLED: "unfulfilled",
  PARTIAL: "partial",
  FULFILLED: "fulfilled",
} as const;
export type OrderFulfillmentStatus =
  (typeof ORDER_FULFILLMENT_STATUS)[keyof typeof ORDER_FULFILLMENT_STATUS];
export const DEFAULT_ORDER_FULFILLMENT_STATUS: OrderFulfillmentStatus =
  ORDER_FULFILLMENT_STATUS.UNFULFILLED;

export const FULFILLMENT_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  FAILED: "failed",
} as const;
export type FulfillmentStatus =
  (typeof FULFILLMENT_STATUS)[keyof typeof FULFILLMENT_STATUS];
export const DEFAULT_FULFILLMENT_STATUS: FulfillmentStatus =
  FULFILLMENT_STATUS.PENDING;

export const ORDER_RETURN_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  RECEIVED: "received",
  REJECTED: "rejected",
  REFUNDED: "refunded",
} as const;
export type OrderReturnStatus =
  (typeof ORDER_RETURN_STATUS)[keyof typeof ORDER_RETURN_STATUS];
export const DEFAULT_ORDER_RETURN_STATUS: OrderReturnStatus =
  ORDER_RETURN_STATUS.PENDING;

// ==============================
// Production Enums
// ==============================

export const PRODUCTION_ORDER_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;
export type ProductionOrderStatus =
  (typeof PRODUCTION_ORDER_STATUS)[keyof typeof PRODUCTION_ORDER_STATUS];
export const DEFAULT_PRODUCTION_ORDER_STATUS: ProductionOrderStatus =
  PRODUCTION_ORDER_STATUS.PENDING;

export const PRODUCTION_TASK_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  QC_FAILED: "qc_failed",
} as const;
export type ProductionTaskStatus =
  (typeof PRODUCTION_TASK_STATUS)[keyof typeof PRODUCTION_TASK_STATUS];
export const DEFAULT_PRODUCTION_TASK_STATUS: ProductionTaskStatus =
  PRODUCTION_TASK_STATUS.PENDING;

export const PRODUCTION_PRIORITY = {
  LOW: "low",
  NORMAL: "normal",
  HIGH: "high",
  URGENT: "urgent",
} as const;
export type ProductionPriority =
  (typeof PRODUCTION_PRIORITY)[keyof typeof PRODUCTION_PRIORITY];
export const DEFAULT_PRODUCTION_PRIORITY: ProductionPriority =
  PRODUCTION_PRIORITY.NORMAL;

// ==============================
// Marketing Enums
// ==============================

export const PROMOTION_TYPE = {
  PERCENTAGE: "percentage",
  FIXED_AMOUNT: "fixed_amount",
  FREE_SHIPPING: "free_shipping",
  BUY_X_GET_Y: "buy_x_get_y",
} as const;
export type PromotionType =
  (typeof PROMOTION_TYPE)[keyof typeof PROMOTION_TYPE];

export const PROMOTION_TARGET = {
  ORDER: "order",
  PRODUCT: "product",
  CATEGORY: "category",
  COLLECTION: "collection",
  SHIPPING: "shipping",
} as const;
export type PromotionTarget =
  (typeof PROMOTION_TARGET)[keyof typeof PROMOTION_TARGET];

export const PROMOTION_USAGE_STATUS = {
  RESERVED: "reserved",
  APPLIED: "applied",
  RELEASED: "released",
} as const;
export type PromotionUsageStatus =
  (typeof PROMOTION_USAGE_STATUS)[keyof typeof PROMOTION_USAGE_STATUS];
export const DEFAULT_PROMOTION_USAGE_STATUS: PromotionUsageStatus =
  PROMOTION_USAGE_STATUS.RESERVED;

export const BANNER_POSITION = {
  HERO: "hero",
  POPUP: "popup",
  SIDEBAR: "sidebar",
  BANNER_STRIP: "banner_strip",
} as const;
export type BannerPosition =
  (typeof BANNER_POSITION)[keyof typeof BANNER_POSITION];
export const DEFAULT_BANNER_POSITION: BannerPosition = BANNER_POSITION.HERO;

export const REVIEW_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;
export type ReviewStatus = (typeof REVIEW_STATUS)[keyof typeof REVIEW_STATUS];
export const DEFAULT_REVIEW_STATUS: ReviewStatus = REVIEW_STATUS.PENDING;

export const POST_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;
export type PostStatus = (typeof POST_STATUS)[keyof typeof POST_STATUS];
export const DEFAULT_POST_STATUS: PostStatus = POST_STATUS.DRAFT;

export const TICKET_CHANNEL = {
  WEB: "web",
  EMAIL: "email",
  PHONE: "phone",
  WALK_IN: "walk_in",
  SOCIAL_MEDIA: "social_media",
} as const;
export type TicketChannel =
  (typeof TICKET_CHANNEL)[keyof typeof TICKET_CHANNEL];
export const DEFAULT_TICKET_CHANNEL: TicketChannel = TICKET_CHANNEL.WEB;

export const TICKET_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const;
export type TicketPriority =
  (typeof TICKET_PRIORITY)[keyof typeof TICKET_PRIORITY];
export const DEFAULT_TICKET_PRIORITY: TicketPriority = TICKET_PRIORITY.MEDIUM;

export const TICKET_STATUS = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  WAITING_FOR_CUSTOMER: "waiting_for_customer",
  RESOLVED: "resolved",
  CLOSED: "closed",
} as const;
export type TicketStatus = (typeof TICKET_STATUS)[keyof typeof TICKET_STATUS];
export const DEFAULT_TICKET_STATUS: TicketStatus = TICKET_STATUS.OPEN;

export const MESSAGE_SENDER = {
  CUSTOMER: "customer",
  AGENT: "agent",
  SYSTEM: "system",
} as const;
export type MessageSender =
  (typeof MESSAGE_SENDER)[keyof typeof MESSAGE_SENDER];
