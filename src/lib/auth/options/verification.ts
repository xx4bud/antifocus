import type { BetterAuthOptions } from "better-auth";

export const verification: BetterAuthOptions["verification"] = {
  additionalFields: {
    metadata: {
      type: "json",
      required: false,
    },
  },
};
