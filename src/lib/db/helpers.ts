import {
  boolean,
  decimal,
  index,
  integer,
  jsonb,
  numeric,
  type PgColumn,
  text,
  timestamp,
  uniqueIndex,
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
export const timestampColumn = (column: string) =>
  timestamp(column, {
    withTimezone: true,
    mode: "date",
    precision: 6,
  });

/**
 * Standard createdAt/updatedAt timestamp fields.
 */
export const timestamps = {
  createdAt: timestampColumn("created_at").notNull().defaultNow(),
  updatedAt: timestampColumn("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
};

/**
 * Boolean column defaults to false
 */
export const falseColumn = (column: string) =>
  boolean(column).notNull().default(false);

/**
 * Boolean column defaults to true
 */
export const trueColumn = (column: string) =>
  boolean(column).notNull().default(true);

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
 * Integer / Count / Quantity / Stock column.
 */
export const intColumn = (column: string) => integer(column);

/**
 * Generic number (numeric) column.
 */
export const numColumn = (column: string, precision = 15, scale = 2) =>
  numeric(column, {
    mode: "number",
    precision,
    scale,
  });

/**
 * JSON column for other structured data.
 */
export const jsonbColumn = (column: string) =>
  jsonb(column).$type<Record<string, unknown>>().default({});

/**
 * Text column with standard length
 */
export const varcharColumn = (column: string, length = 255) =>
  varchar(column, { length });

/**
 * Create a named index. Name auto-generates as `{table}_{col1}_{col2}_idx`.
 */
export const idx = (
  tableName: string,
  ...columns: [PgColumn, ...PgColumn[]]
) => {
  const name =
    columns.length > 1
      ? `${tableName}_${columns.map((c) => c.name).join("_")}_idx`
      : `${tableName}_${columns[0].name}_idx`;
  return index(name).on(...columns);
};

/**
 * Create a named unique index. Name auto-generates as `{table}_{col1}_{col2}_unique`.
 */
export const uidx = (
  tableName: string,
  ...columns: [PgColumn, ...PgColumn[]]
) => {
  const name =
    columns.length > 1
      ? `${tableName}_${columns.map((c) => c.name).join("_")}_uidx`
      : `${tableName}_${columns[0].name}_uidx`;
  return uniqueIndex(name).on(...columns);
};
