import { organization } from "better-auth/plugins/organization";
import React from "react";
import { DEFAULT_ORG_ROLE, ORG_ROLE } from "@/lib/db/schema";
import { FROM_EMAIL, sendEmail } from "@/lib/email";
import { InvitationEmail } from "@/lib/email/templates/invitation-email";
import { getBaseUrl } from "@/lib/utils/urls";
import { ac, adminRole, memberRole, ownerRole } from "../permissions/roles";

export const organizationPlugin = organization({
  ac,
  roles: {
    [ORG_ROLE.OWNER]: ownerRole,
    [ORG_ROLE.ADMIN]: adminRole,
    [ORG_ROLE.MEMBER]: memberRole,
  },
  defaultRole: DEFAULT_ORG_ROLE,
  allowUserToCreateOrganization: false, // antifocus only for now
  creatorRole: ORG_ROLE.OWNER,
  membershipLimit: 100,
  invitationExpiresIn: 60 * 60 * 24 * 7, // 7 days
  invitationLimit: 50,
  cancelPendingInvitationsOnReInvite: true,

  dynamicAccessControl: {
    enabled: true,
  },

  sendInvitationEmail: async (data) => {
    await sendEmail({
      from: FROM_EMAIL,
      to: data.email,
      subject: `Join ${data.organization.name}`,
      react: React.createElement(InvitationEmail, {
        organizationName: data.organization.name,
        inviterName: data.inviter.user.name,
        url: `${getBaseUrl()}/accept-invite?id=${data.invitation.id}`,
      }),
    });
  },

  schema: {
    organization: {
      additionalFields: {
        status: { type: "string", required: true, defaultValue: "active" },
        metadata: { type: "json", required: false },
        deletedAt: { type: "date", required: false },
        updatedAt: {
          type: "date",
          required: false,
          onUpdate: () => new Date(),
        },
      },
    },
    member: {
      additionalFields: {
        status: { type: "string", required: true, defaultValue: "active" },
        metadata: { type: "json", required: false },
        deletedAt: { type: "date", required: false },
        updatedAt: {
          type: "date",
          required: false,
          onUpdate: () => new Date(),
        },
      },
    },
    invitation: {
      additionalFields: {
        metadata: { type: "json", required: false },
        updatedAt: {
          type: "date",
          required: false,
          onUpdate: () => new Date(),
        },
      },
    },
    organizationRole: {
      additionalFields: {
        enabled: { type: "boolean", required: true, defaultValue: true },
        system: { type: "boolean", required: true, defaultValue: false },
        metadata: { type: "json", required: false },
      },
    },
  },
});
