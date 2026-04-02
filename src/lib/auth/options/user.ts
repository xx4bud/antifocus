import type { BetterAuthOptions } from "better-auth";

export const user = {
  changeEmail: {
    enabled: true,
  },
  deleteUser: {
    enabled: true,
  },

  additionalFields: {
    role: {
      type: "string",
      defaultValue: "user",
      required: true,
    },
    status: {
      type: "string",
      defaultValue: "pending",
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
