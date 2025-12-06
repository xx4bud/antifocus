import {
  cohorts,
  cohortUsers,
  conversions,
  deviceType,
  events,
  eventType,
  pageViews,
  productMetrics,
  revenueReports,
  segmentUsers,
  trafficSource,
  userSegments,
} from "@antifocus/db/analytics/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod/v4-mini";

// ============================================================================
// SELECT SCHEMAS
// ============================================================================

export const eventTypeSchema = createSelectSchema(eventType);

export type EventTypeData = z.infer<typeof eventTypeSchema>;

export const deviceTypeSchema = createSelectSchema(deviceType);

export type DeviceTypeData = z.infer<typeof deviceTypeSchema>;

export const trafficSourceSchema = createSelectSchema(trafficSource);

export type TrafficSourceData = z.infer<typeof trafficSourceSchema>;

export const pageViewsSchema = createSelectSchema(pageViews);

export type PageViewsData = z.infer<typeof pageViewsSchema>;

export const eventsSchema = createSelectSchema(events);

export type EventsData = z.infer<typeof eventsSchema>;

export const conversionsSchema = createSelectSchema(conversions);

export type ConversionsData = z.infer<typeof conversionsSchema>;

export const cohortsSchema = createSelectSchema(cohorts);

export type CohortsData = z.infer<typeof cohortsSchema>;

export const cohortUsersSchema = createSelectSchema(cohortUsers);

export type CohortUsersData = z.infer<typeof cohortUsersSchema>;

export const revenueReportsSchema = createSelectSchema(revenueReports);

export type RevenueReportsData = z.infer<typeof revenueReportsSchema>;

export const productMetricsSchema = createSelectSchema(productMetrics);

export type ProductMetricsData = z.infer<typeof productMetricsSchema>;

export const userSegmentsSchema = createSelectSchema(userSegments);

export type UserSegmentsData = z.infer<typeof userSegmentsSchema>;

export const segmentUsersSchema = createSelectSchema(segmentUsers);

export type SegmentUsersData = z.infer<typeof segmentUsersSchema>;

// ============================================================================
// INSERT SCHEMAS
// ============================================================================

export const insertPageViewsSchema = createInsertSchema(pageViews);

export type InsertPageViews = z.infer<typeof insertPageViewsSchema>;

export const insertEventsSchema = createInsertSchema(events);

export type InsertEvents = z.infer<typeof insertEventsSchema>;

export const insertConversionsSchema = createInsertSchema(conversions);

export type InsertConversions = z.infer<typeof insertConversionsSchema>;

export const insertCohortsSchema = createInsertSchema(cohorts);

export type InsertCohorts = z.infer<typeof insertCohortsSchema>;

export const insertCohortUsersSchema = createInsertSchema(cohortUsers);

export type InsertCohortUsers = z.infer<typeof insertCohortUsersSchema>;

export const insertRevenueReportsSchema = createInsertSchema(revenueReports);

export type InsertRevenueReports = z.infer<typeof insertRevenueReportsSchema>;

export const insertProductMetricsSchema = createInsertSchema(productMetrics);

export type InsertProductMetrics = z.infer<typeof insertProductMetricsSchema>;

export const insertUserSegmentsSchema = createInsertSchema(userSegments);

export type InsertUserSegments = z.infer<typeof insertUserSegmentsSchema>;

export const insertSegmentUsersSchema = createInsertSchema(segmentUsers);

export type InsertSegmentUsers = z.infer<typeof insertSegmentUsersSchema>;

// ============================================================================
// UPDATE SCHEMAS
// ============================================================================

export const updatePageViewsSchema = insertPageViewsSchema.partial();

export type UpdatePageViews = z.infer<typeof updatePageViewsSchema>;

export const updateEventsSchema = insertEventsSchema.partial();

export type UpdateEvents = z.infer<typeof updateEventsSchema>;

export const updateConversionsSchema = insertConversionsSchema.partial();

export type UpdateConversions = z.infer<typeof updateConversionsSchema>;

export const updateCohortsSchema = insertCohortsSchema.partial();

export type UpdateCohorts = z.infer<typeof updateCohortsSchema>;

export const updateCohortUsersSchema = insertCohortUsersSchema.partial();

export type UpdateCohortUsers = z.infer<typeof updateCohortUsersSchema>;

export const updateRevenueReportsSchema = insertRevenueReportsSchema.partial();

export type UpdateRevenueReports = z.infer<typeof updateRevenueReportsSchema>;

export const updateProductMetricsSchema = insertProductMetricsSchema.partial();

export type UpdateProductMetrics = z.infer<typeof updateProductMetricsSchema>;

export const updateUserSegmentsSchema = insertUserSegmentsSchema.partial();

export type UpdateUserSegments = z.infer<typeof updateUserSegmentsSchema>;

export const updateSegmentUsersSchema = insertSegmentUsersSchema.partial();

export type UpdateSegmentUsers = z.infer<typeof updateSegmentUsersSchema>;
