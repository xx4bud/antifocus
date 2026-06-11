import {
  boolean,
  date,
  decimal,
  integer,
  jsonb,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { generateId } from "@/lib/utils/id";

/**
 * Standard primary key ID column using CUID2.
 */
export const idColumn = (name = "id") =>
  text(name)
    .primaryKey()
    .$defaultFn(() => generateId());

/**
 * Timestamptz column helper (with timezone and microseconds precision).
 */
export const timestamptz = (column: string) =>
  timestamp(column, {
    withTimezone: true,
    mode: "date",
    precision: 6,
  });

/**
 * Date column helper (date only, returns Date objects).
 */
export const dateColumn = (column: string) => date(column, { mode: "date" });

/**
 * Standard createdAt/updatedAt timestamp fields.
 */
export const timestampColumn = () => ({
  createdAt: timestamptz("created_at").notNull().defaultNow(),
  updatedAt: timestamptz("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

/**
 * Numeric position/ordering column.
 */
export const positionColumn = (column = "position") =>
  integer(column).notNull().default(0);

/**
 * Boolean column with standard default value.
 */
export const booleanColumn = (column: string, defaultValue = false) =>
  boolean(column).notNull().default(defaultValue);

/**
 * Custom precision decimal column returning JS numbers.
 */
export const decimalColumn = (column: string, precision = 15, scale = 2) =>
  decimal(column, {
    mode: "number",
    precision,
    scale,
  });

/**
 * Monetary/Price column matching priceSchema constraints (Decimal 15, 2).
 */
export const moneyColumn = (column: string) =>
  decimalColumn(column).notNull().default(0);

/**
 * Percentage rate column matching rateSchema constraints (Decimal 5, 2).
 */
export const rateColumn = (column: string) =>
  decimalColumn(column, 5, 2).notNull().default(0);

/**
 * Review/Product rating column matching ratingSchema constraints (Decimal 3, 2).
 */
export const ratingColumn = (column: string) =>
  decimalColumn(column, 3, 2).notNull().default(0);

/**
 * Quantity/Inventory column matching quantitySchema constraints (Integer).
 */
export const quantityColumn = (column: string) =>
  integer(column).notNull().default(0);

/**
 * JSONB metadata column helper.
 */
export const metadataColumn = (column = "metadata") =>
  jsonb(column).$type<Record<string, unknown>>().default({});

/**
 * Email column matching emailSchema constraints (varchar 255).
 */
export const emailColumn = (column: string) => varchar(column, { length: 255 });

/**
 * Phone number column matching phoneNumberSchema limits (varchar 15).
 */
export const phoneColumn = (column: string) => varchar(column, { length: 15 });

/**
 * Generic unique or identifier code column matching codeSchema (varchar 255).
 */
export const codeColumn = (column: string) => varchar(column, { length: 255 });

/**
 * URL-friendly slug column matching slugSchema (varchar 255).
 */
export const slugColumn = (column: string) => varchar(column, { length: 255 });

/**
 * Absolute URL column matching urlSchema (varchar 2048).
 */
export const urlColumn = (column: string) => varchar(column, { length: 2048 });

/**
 * Name column matching nameSchema limits (varchar 255).
 * Safe padding of 255 in database, while validated at 100 in application code.
 */
export const nameColumn = (column: string) => varchar(column, { length: 255 });

/**
 * Username column matching usernameSchema (varchar 30).
 */
export const usernameColumn = (column: string) =>
  varchar(column, { length: 30 });

/**
 * Password column matching passwordSchema requirements (varchar 255).
 * Safe padding of 255 in database to accommodate secure Argon2 hashes.
 */
export const passwordColumn = (column: string) =>
  varchar(column, { length: 255 });

/**
 * Medium description text column (PostgreSQL text).
 */
export const descriptionColumn = (column: string) => text(column);

/**
 * Notes/Internal remarks text column (PostgreSQL text).
 */
export const notesColumn = (column: string) => text(column);

/**
 * HEX Color code column matching colorHexSchema (varchar 7).
 */
export const colorColumn = (column: string) => varchar(column, { length: 7 });
