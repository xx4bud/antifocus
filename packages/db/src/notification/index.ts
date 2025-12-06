import { env } from "@antifocus/env";
import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as notificationDbSchema from "./schema";

export { notificationDbSchema };

export type NotificationDbSchema = typeof notificationDbSchema;

let _notificationDb: NeonHttpDatabase<NotificationDbSchema> | null = null;

export const getNotificationDb = () => {
  if (_notificationDb) {
    return _notificationDb;
  }

  const client = neon(env.DB_URL_NOTIFICATION);

  _notificationDb = drizzle({
    client,
    schema: notificationDbSchema,
    casing: "snake_case",
  });
  return _notificationDb;
};

export const notificationDb = new Proxy(
  {} as NeonHttpDatabase<NotificationDbSchema>,
  {
    get: (_, prop) =>
      getNotificationDb()[prop as keyof NeonHttpDatabase<NotificationDbSchema>],
  }
);

export type NotificationDb = typeof notificationDb;
