import {
  emailLogs,
  notificationChannel,
  notificationPreferences,
  notificationPriority,
  notificationStatus,
  notifications,
  notificationTemplates,
  notificationType,
  pushLogs,
  pushTokens,
  smsLogs,
} from "@antifocus/db/notification/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod/v4-mini";

// ============================================================================
// SELECT SCHEMAS
// ============================================================================

export const notificationTypeSchema = createSelectSchema(notificationType);

export type NotificationTypeData = z.infer<typeof notificationTypeSchema>;

export const notificationChannelSchema =
  createSelectSchema(notificationChannel);

export type NotificationChannelData = z.infer<typeof notificationChannelSchema>;

export const notificationStatusSchema = createSelectSchema(notificationStatus);

export type NotificationStatusData = z.infer<typeof notificationStatusSchema>;

export const notificationPrioritySchema =
  createSelectSchema(notificationPriority);

export type NotificationPriorityData = z.infer<
  typeof notificationPrioritySchema
>;

export const notificationsSchema = createSelectSchema(notifications);

export type NotificationsData = z.infer<typeof notificationsSchema>;

export const notificationPreferencesSchema = createSelectSchema(
  notificationPreferences
);

export type NotificationPreferencesData = z.infer<
  typeof notificationPreferencesSchema
>;

export const emailLogsSchema = createSelectSchema(emailLogs);

export type EmailLogsData = z.infer<typeof emailLogsSchema>;

export const smsLogsSchema = createSelectSchema(smsLogs);

export type SmsLogsData = z.infer<typeof smsLogsSchema>;

export const pushTokensSchema = createSelectSchema(pushTokens);

export type PushTokensData = z.infer<typeof pushTokensSchema>;

export const pushLogsSchema = createSelectSchema(pushLogs);

export type PushLogsData = z.infer<typeof pushLogsSchema>;

export const notificationTemplatesSchema = createSelectSchema(
  notificationTemplates
);

export type NotificationTemplatesData = z.infer<
  typeof notificationTemplatesSchema
>;

// ============================================================================
// INSERT SCHEMAS
// ============================================================================

export const insertNotificationsSchema = createInsertSchema(notifications);

export type InsertNotifications = z.infer<typeof insertNotificationsSchema>;

export const insertNotificationPreferencesSchema = createInsertSchema(
  notificationPreferences
);

export type InsertNotificationPreferences = z.infer<
  typeof insertNotificationPreferencesSchema
>;

export const insertEmailLogsSchema = createInsertSchema(emailLogs);

export type InsertEmailLogs = z.infer<typeof insertEmailLogsSchema>;

export const insertSmsLogsSchema = createInsertSchema(smsLogs);

export type InsertSmsLogs = z.infer<typeof insertSmsLogsSchema>;

export const insertPushTokensSchema = createInsertSchema(pushTokens);

export type InsertPushTokens = z.infer<typeof insertPushTokensSchema>;

export const insertPushLogsSchema = createInsertSchema(pushLogs);

export type InsertPushLogs = z.infer<typeof insertPushLogsSchema>;

export const insertNotificationTemplatesSchema = createInsertSchema(
  notificationTemplates
);

export type InsertNotificationTemplates = z.infer<
  typeof insertNotificationTemplatesSchema
>;

// ============================================================================
// UPDATE SCHEMAS
// ============================================================================

export const updateNotificationsSchema = insertNotificationsSchema.partial();

export type UpdateNotifications = z.infer<typeof updateNotificationsSchema>;

export const updateNotificationPreferencesSchema =
  insertNotificationPreferencesSchema.partial();

export type UpdateNotificationPreferences = z.infer<
  typeof updateNotificationPreferencesSchema
>;

export const updateEmailLogsSchema = insertEmailLogsSchema.partial();

export type UpdateEmailLogs = z.infer<typeof updateEmailLogsSchema>;

export const updateSmsLogsSchema = insertSmsLogsSchema.partial();

export type UpdateSmsLogs = z.infer<typeof updateSmsLogsSchema>;

export const updatePushTokensSchema = insertPushTokensSchema.partial();

export type UpdatePushTokens = z.infer<typeof updatePushTokensSchema>;

export const updatePushLogsSchema = insertPushLogsSchema.partial();

export type UpdatePushLogs = z.infer<typeof updatePushLogsSchema>;

export const updateNotificationTemplatesSchema =
  insertNotificationTemplatesSchema.partial();

export type UpdateNotificationTemplates = z.infer<
  typeof updateNotificationTemplatesSchema
>;
