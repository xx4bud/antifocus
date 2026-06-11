import type { BetterAuthOptions } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { emailSchema } from "@/lib/validations/email";
import { nameSchema } from "@/lib/validations/name";
import { phoneNumberSchema } from "@/lib/validations/phone-number";
import { usernameSchema } from "@/lib/validations/username";

/**
 * Global authentication API hooks for input validation and normalization.
 */
export const hooks = {
  before: createAuthMiddleware(async (ctx) => {
    const path = ctx.path;
    const isMatched = [
      "/sign-up/email",
      "/user/update",
      "/username/change",
      "/phone-number/verify",
    ].some((p) => path.startsWith(p));

    if (!isMatched) {
      return;
    }

    const body = { ...(ctx.body as Record<string, unknown>) };

    if (body.email) {
      const result = emailSchema.safeParse(body.email);
      if (!result.success) {
        throw new APIError("BAD_REQUEST", {
          message: result.error.issues[0]?.message || "Invalid email address",
        });
      }
      body.email = result.data;
    }

    if (body.username) {
      const result = usernameSchema.safeParse(body.username);
      if (!result.success) {
        throw new APIError("BAD_REQUEST", {
          message: result.error.issues[0]?.message || "Invalid username",
        });
      }
      body.username = result.data;
    }

    if (body.name) {
      const result = nameSchema.safeParse(body.name);
      if (!result.success) {
        throw new APIError("BAD_REQUEST", {
          message: result.error.issues[0]?.message || "Invalid name",
        });
      }
      body.name = result.data;
    }

    if (body.phoneNumber) {
      const result = phoneNumberSchema.safeParse(body.phoneNumber);
      if (!result.success) {
        throw new APIError("BAD_REQUEST", {
          message: result.error.issues[0]?.message || "Invalid phone number",
        });
      }
      body.phoneNumber = result.data;
    }

    return {
      context: {
        ...ctx,
        body,
      },
    };
  }),
} as const satisfies BetterAuthOptions["hooks"];
