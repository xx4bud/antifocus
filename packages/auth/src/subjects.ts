import type { InferSelectModel } from "@antifocus/db";
import { analyticsDbSchema } from "@antifocus/db/analytics";
import { authDbSchema } from "@antifocus/db/auth";
import { notificationDbSchema } from "@antifocus/db/notification";
import { orderDbSchema } from "@antifocus/db/order";
import { productDbSchema } from "@antifocus/db/product";
import { storageDbSchema } from "@antifocus/db/storage";

export const schemaMapping = {
  // Auth
  User: authDbSchema.users,
  Account: authDbSchema.accounts,
  Session: authDbSchema.sessions,
  TwoFactor: authDbSchema.twoFactors,
  Verification: authDbSchema.verifications,

  // Product
  Product: productDbSchema.products,
  ProductVariant: productDbSchema.productVariants,
  ProductImage: productDbSchema.productImages,
  Category: productDbSchema.categories,
  Tag: productDbSchema.tags,
  Design: productDbSchema.designs,
  Template: productDbSchema.templates,
  Collection: productDbSchema.collections,
  PrintProvider: productDbSchema.printProviders,

  // Order
  Order: orderDbSchema.orders,
  OrderItem: orderDbSchema.orderItems,
  Payment: orderDbSchema.payments,
  Fulfillment: orderDbSchema.fulfillments,
  Shipment: orderDbSchema.shipments,
  Refund: orderDbSchema.refunds,
  Invoice: orderDbSchema.invoices,

  // Notification
  Notification: notificationDbSchema.notifications,
  NotificationPreference: notificationDbSchema.notificationPreferences,
  EmailLog: notificationDbSchema.emailLogs,
  SmsLog: notificationDbSchema.smsLogs,
  PushToken: notificationDbSchema.pushTokens,
  NotificationTemplate: notificationDbSchema.notificationTemplates,

  // Analytics
  PageView: analyticsDbSchema.pageViews,
  Event: analyticsDbSchema.events,
  Conversion: analyticsDbSchema.conversions,
  Cohort: analyticsDbSchema.cohorts,
  RevenueReport: analyticsDbSchema.revenueReports,
  ProductMetric: analyticsDbSchema.productMetrics,
  UserSegment: analyticsDbSchema.userSegments,

  // Storage
  File: storageDbSchema.files,
  Image: storageDbSchema.images,
  Thumbnail: storageDbSchema.thumbnails,
  Folder: storageDbSchema.folders,
  UploadSession: storageDbSchema.uploadSessions,
} as const;

export type SchemaMapping = typeof schemaMapping;

type TableSubjects = {
  [K in keyof SchemaMapping]: K | InferSelectModel<SchemaMapping[K]>;
}[keyof SchemaMapping];

export type AppSubject = TableSubjects | "all";
