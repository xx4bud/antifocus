import {
  accounts,
  sessions,
  twoFactors,
  userRole,
  users,
  verifications,
} from "@antifocus/db/auth/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod/v4-mini";

// ============================================================================
// SELECT SCHEMAS
// ============================================================================

export const userRoleSchema = createSelectSchema(userRole);

export type UserRoleData = z.infer<typeof userRoleSchema>;

export const usersSchema = createSelectSchema(users);

export type UsersData = z.infer<typeof usersSchema>;

export const accountsSchema = createSelectSchema(accounts);

export type AccountsData = z.infer<typeof accountsSchema>;

export const sessionsSchema = createSelectSchema(sessions);

export type SessionsData = z.infer<typeof sessionsSchema>;

export const verificationsSchema = createSelectSchema(verifications);

export type VerificationsData = z.infer<typeof verificationsSchema>;

export const twoFactorsSchema = createSelectSchema(twoFactors);

export type TwoFactorsData = z.infer<typeof twoFactorsSchema>;

// ============================================================================
// INSERT SCHEMAS
// ============================================================================

export const insertUsersSchema = createInsertSchema(users);

export type InsertUsers = z.infer<typeof insertUsersSchema>;

export const insertAccountsSchema = createInsertSchema(accounts);

export type InsertAccounts = z.infer<typeof insertAccountsSchema>;

export const insertSessionsSchema = createInsertSchema(sessions);

export type InsertSessions = z.infer<typeof insertSessionsSchema>;

export const insertVerificationsSchema = createInsertSchema(verifications);

export type InsertVerifications = z.infer<typeof insertVerificationsSchema>;

export const insertTwoFactorsSchema = createInsertSchema(twoFactors);

export type InsertTwoFactors = z.infer<typeof insertTwoFactorsSchema>;

// ============================================================================
// UPDATE SCHEMAS
// ============================================================================

export const updateUsersSchema = insertUsersSchema.partial();

export type UpdateUsers = z.infer<typeof updateUsersSchema>;

export const updateAccountsSchema = insertAccountsSchema.partial();

export type UpdateAccounts = z.infer<typeof updateAccountsSchema>;

export const updateSessionsSchema = insertSessionsSchema.partial();

export type UpdateSessions = z.infer<typeof updateSessionsSchema>;

export const updateVerificationsSchema = insertVerificationsSchema.partial();

export type UpdateVerifications = z.infer<typeof updateVerificationsSchema>;

export const updateTwoFactorsSchema = insertTwoFactorsSchema.partial();

export type UpdateTwoFactors = z.infer<typeof updateTwoFactorsSchema>;
