import type { Icon } from "@tabler/icons-react";
import type { NextRequest, NextResponse } from "next/server";
import type { Href } from "../i18n/link";

export interface AppError {
  code: string;
  context?: Record<string, unknown>;
  message: string;
  statusCode: number;
}

export type AppResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: AppError };

export type AppResponse<T = unknown> =
  | {
      success: true;
      data: T;
      message?: string;
      metadata?: Record<string, unknown>;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
        context?: Record<string, unknown>;
      };
    };

export type AppHandler = (
  request: NextRequest
) => Promise<NextResponse | undefined> | NextResponse | undefined;

export interface NavItem {
  children?: NavItem[];
  href?: Href;
  icon?: Icon;
  isActive?: boolean;
  label: string;
  onClick?: () => void;
}
