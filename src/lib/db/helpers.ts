import {
  boolean,
  decimal,
  integer,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { generateId } from "@/lib/utils/ids";

export const idColumn = (name = "id") =>
  text(name)
    .primaryKey()
    .$defaultFn(() => generateId());

export const timestamptz = (column: string) =>
  timestamp(column, {
    withTimezone: true,
    mode: "date",
    precision: 6,
  });

export const timestampColumn = () => ({
  createdAt: timestamptz("created_at").notNull().defaultNow(),
  updatedAt: timestamptz("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const positionColumn = (column = "position") =>
  integer(column).notNull().default(0);

export const booleanColumn = (column: string, defaultValue = false) =>
  boolean(column).notNull().default(defaultValue);

export const decimalColumn = (column: string, precision = 15, scale = 2) =>
  decimal(column, {
    mode: "number",
    precision,
    scale,
  });

export const moneyColumn = (column: string) =>
  decimalColumn(column).notNull().default(0);
