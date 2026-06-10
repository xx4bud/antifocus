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

export const dateColumn = (column: string) => date(column, { mode: "date" });

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

export const rateColumn = (column: string) =>
  decimalColumn(column, 5, 2).notNull().default(0);

export const ratingColumn = (column: string) =>
  decimalColumn(column, 3, 2).notNull().default(0);

export const quantityColumn = (column: string) =>
  integer(column).notNull().default(0);

export const metadataColumn = (column = "metadata") =>
  jsonb(column).$type<Record<string, unknown>>().default({});

export const emailColumn = (column: string) => varchar(column, { length: 255 });

export const phoneColumn = (column: string) => varchar(column, { length: 15 });

export const codeColumn = (column: string) => varchar(column, { length: 255 });

export const slugColumn = (column: string) => varchar(column, { length: 255 });

export const urlColumn = (column: string) => varchar(column, { length: 2048 });

export const nameColumn = (column: string) => varchar(column, { length: 255 });

export const usernameColumn = (column: string) =>
  varchar(column, { length: 30 });

export const passwordColumn = (column: string) =>
  varchar(column, { length: 255 });

export const descriptionColumn = (column: string) => text(column);

export const notesColumn = (column: string) => text(column);

export const colorColumn = (column: string) => varchar(column, { length: 7 });
