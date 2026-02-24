import type { BetterAuthOptions } from "better-auth";

export const user = {
  changeEmail: {
    enabled: true,
  },

  additionalFields: {
    // custom
    role: {
      type: "string",
      defaultValue: "user",
      required: true,
    },
    // fields
    status: {
      type: "string",
      defaultValue: "active",
      required: true,
    },
    settings: {
      type: "json",
      required: false,
    },
    metadata: {
      type: "json",
      required: false,
    },
    deletedAt: {
      type: "date",
      required: false,
    },
  },
} satisfies BetterAuthOptions["user"];
