import type { BetterAuthOptions } from "better-auth";
import React from "react";
import { FROM_EMAIL, sendEmail } from "@/lib/email";
import { ChangeEmailAlert } from "@/lib/email/templates/change-email-alert";

export const user: BetterAuthOptions["user"] = {
  changeEmail: {
    enabled: true,
    sendChangeEmailConfirmation: async ({ user, url }) => {
      await sendEmail({
        from: FROM_EMAIL,
        to: user.email,
        subject: "Security Alert: Email change requested",
        react: React.createElement(ChangeEmailAlert, {
          url,
          userName: user.name,
        }),
      });
    },
  },
  additionalFields: {
    status: {
      type: "string",
      required: true,
      defaultValue: "active",
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
};
