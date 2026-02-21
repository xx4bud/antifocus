import type { Icon } from "@tabler/icons-react";
import "next-intl";
import type { _Translator } from "next-intl";
import type { Href } from "~/components/ui/nav-link";
import type { LOCALES } from "~/i18n/locales";
import type { auth } from "~/lib/auth";
import type { schema } from "~/lib/db";

// ==============================
// ENTITY
// ==============================

export interface Identifier {
  id: string;
}

export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftDelete extends Timestamps {
  deletedAt?: Date | null;
}

export interface AuditTrail extends SoftDelete {
  createdBy?: string | null;
  deletedBy?: string | null;
  updatedBy?: string | null;
}

export interface Entity extends Identifier, AuditTrail {}

// ==============================
// DOMAIN
// ==============================

export abstract class AggregateRoot {
  protected domainEvents: unknown[] = [];
}

export abstract class ValueObject<T> {
  protected readonly value: T;

  constructor(value: T) {
    this.value = value;
  }
}

// ==============================
// ERROR
// ==============================

export interface AppError {
  code?: string;
  context?: Record<string, unknown>;
  message: string;
  statusCode?: number | string;
}

// ==============================
// RESULT
// ==============================

export interface Ok<T> {
  ok: true;
  value: T;
}

export interface Fail<E = AppError> {
  error: E;
  ok: false;
}

export type AppResult<T, E = AppError> = Ok<T> | Fail<E>;

// ==============================
// USE CASE
// ==============================

export interface UseCase<I, O> {
  execute(input: I): Promise<AppResult<O>>;
}

// ==============================
// RESPONSE
// ==============================

export interface Success<T> {
  data: T;
  message?: string;
  metadata?: Record<string, unknown>;
  success: true;
}

export interface Failed {
  error: AppError;
  success: false;
}

export type AppResponse<T = unknown> = Success<T> | Failed;

// ==============================
// QUERY
// ==============================

export interface Pagination {
  limit: number;
  page: number;
  total?: number;
}

export interface Sort {
  field: string;
  order: "asc" | "desc";
}

export interface Filter {
  ids?: string[];
  search?: string;
  [key: string]: unknown;
}

export interface Query {
  filter?: Filter;
  pagination?: Pagination;
  sort?: Sort[];
}

export interface QueryResult<T> {
  data: T[];
  pagination: Pagination;
}

// ==============================
// I18N
// ==============================

export type Locale = keyof typeof LOCALES;

export type Messages = (typeof LOCALES)[Locale];

export type Translator = _Translator<Messages>;

declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: Messages;
  }
}

// ==============================
// DATABASE
// ==============================

export type Schema = typeof schema;

// ==============================
// AUTH
// ==============================

export type Auth = typeof auth;

export type AuthSession = Auth["$Infer"]["Session"];

export type AuthUser = AuthSession["user"];

// ==============================
// NAVIGATION
// ==============================

export type NavItem = {
  label: string;
  href?: Href;
  icon?: Icon;
  isActive?: boolean;
  children?: NavItem[];
  onClick?: () => void;
};
