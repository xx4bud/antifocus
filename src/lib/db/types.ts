import type {
  // auths
  accounts,
  // addresses
  addresses,
  apikeys,
  // attributes
  attributeDefinitions,
  attributeValues,
  // categories
  categories,
  categoryProducts,
  creditNotes,
  customers,
  inventoryItems,
  invitations,
  invoiceItems,
  // invoices
  invoices,
  // medias
  medias,
  members,
  orderHistory,
  orderItems,
  // orders
  orders,
  organizationRoles,
  // organizations
  organizations,
  // payments
  payments,
  posSessions,
  // pos
  posTerminals,
  posTransactions,
  printJobs,
  // print jobs
  printMachines,
  productDesignAreas,
  productMedias,
  // products
  products,
  productVariants,
  purchaseOrderItems,
  purchaseOrders,
  refunds,
  sessions,
  shipments,
  stockMovements,
  // stores
  stores,
  supplierProducts,
  // suppliers
  suppliers,
  twoFactors,
  userRoles,
  // users
  users,
  variantMedias,
  verifications,
  // inventory
  warehouses,
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

export type TwoFactor = typeof twoFactors.$inferSelect;
export type NewTwoFactor = typeof twoFactors.$inferInsert;

export type Apikey = typeof apikeys.$inferSelect;
export type NewApikey = typeof apikeys.$inferInsert;

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

// ==============================
// STORE & CUSTOMER TYPES
// ==============================

export type Store = typeof stores.$inferSelect;
export type NewStore = typeof stores.$inferInsert;

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

// ==============================
// PRODUCT TYPES
// ==============================

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;

export type ProductDesignArea = typeof productDesignAreas.$inferSelect;
export type NewProductDesignArea = typeof productDesignAreas.$inferInsert;

// ==============================
// CATEGORY TYPES
// ==============================

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type CategoryProduct = typeof categoryProducts.$inferSelect;
export type NewCategoryProduct = typeof categoryProducts.$inferInsert;

// ==============================
// MEDIA TYPES
// ==============================

export type Media = typeof medias.$inferSelect;
export type NewMedia = typeof medias.$inferInsert;

export type ProductMedia = typeof productMedias.$inferSelect;
export type NewProductMedia = typeof productMedias.$inferInsert;

export type VariantMedia = typeof variantMedias.$inferSelect;
export type NewVariantMedia = typeof variantMedias.$inferInsert;

// ==============================
// ATTRIBUTE TYPES
// ==============================

export type AttributeDefinition = typeof attributeDefinitions.$inferSelect;
export type NewAttributeDefinition = typeof attributeDefinitions.$inferInsert;

export type AttributeValue = typeof attributeValues.$inferSelect;
export type NewAttributeValue = typeof attributeValues.$inferInsert;

// ==============================
// ADDRESS TYPES
// ==============================

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;

// ==============================
// SUPPLIER TYPES
// ==============================

export type Supplier = typeof suppliers.$inferSelect;
export type NewSupplier = typeof suppliers.$inferInsert;

export type SupplierProduct = typeof supplierProducts.$inferSelect;
export type NewSupplierProduct = typeof supplierProducts.$inferInsert;

// ==============================
// INVENTORY TYPES
// ==============================

export type Warehouse = typeof warehouses.$inferSelect;
export type NewWarehouse = typeof warehouses.$inferInsert;

export type InventoryItem = typeof inventoryItems.$inferSelect;
export type NewInventoryItem = typeof inventoryItems.$inferInsert;

export type StockMovement = typeof stockMovements.$inferSelect;
export type NewStockMovement = typeof stockMovements.$inferInsert;

export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
export type NewPurchaseOrder = typeof purchaseOrders.$inferInsert;

export type PurchaseOrderItem = typeof purchaseOrderItems.$inferSelect;
export type NewPurchaseOrderItem = typeof purchaseOrderItems.$inferInsert;

// ==============================
// ORDER TYPES
// ==============================

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

export type OrderHistoryEntry = typeof orderHistory.$inferSelect;
export type NewOrderHistoryEntry = typeof orderHistory.$inferInsert;

export type Shipment = typeof shipments.$inferSelect;
export type NewShipment = typeof shipments.$inferInsert;

// ==============================
// PAYMENT TYPES
// ==============================

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

export type Refund = typeof refunds.$inferSelect;
export type NewRefund = typeof refunds.$inferInsert;

// ==============================
// INVOICE TYPES
// ==============================

export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;

export type InvoiceItem = typeof invoiceItems.$inferSelect;
export type NewInvoiceItem = typeof invoiceItems.$inferInsert;

export type CreditNote = typeof creditNotes.$inferSelect;
export type NewCreditNote = typeof creditNotes.$inferInsert;

// ==============================
// POS TYPES
// ==============================

export type PosTerminal = typeof posTerminals.$inferSelect;
export type NewPosTerminal = typeof posTerminals.$inferInsert;

export type PosSession = typeof posSessions.$inferSelect;
export type NewPosSession = typeof posSessions.$inferInsert;

export type PosTransaction = typeof posTransactions.$inferSelect;
export type NewPosTransaction = typeof posTransactions.$inferInsert;

// ==============================
// PRINT JOB TYPES
// ==============================

export type PrintMachine = typeof printMachines.$inferSelect;
export type NewPrintMachine = typeof printMachines.$inferInsert;

export type PrintJob = typeof printJobs.$inferSelect;
export type NewPrintJob = typeof printJobs.$inferInsert;
