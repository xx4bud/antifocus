import { organization } from "better-auth/plugins";

export function organizationPlugin() {
  return organization({
    dynamicAccessControl: {
      enabled: true,
    },

    schema: {
      organization: {
        additionalFields: {
          metadata: {
            type: "json",
            required: false,
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
          updatedAt: {
            type: "date",
            required: true,
            onUpdate: () => new Date(),
          },
          deletedAt: {
            type: "date",
            required: false,
          },
        },
      },

      organizationRole: {
        additionalFields: {
          permission: {
            type: "json",
            required: true,
          },
          metadata: {
            type: "json",
            required: false,
          },
          system: {
            type: "boolean",
            defaultValue: false,
            required: true,
          },
          enabled: {
            type: "boolean",
            defaultValue: true,
            required: true,
          },
        },
      },

      member: {
        additionalFields: {
          status: {
            type: "string",
            defaultValue: "pending",
            required: true,
          },
          metadata: {
            type: "json",
            required: false,
          },
          updatedAt: {
            type: "date",
            required: true,
            onUpdate: () => new Date(),
          },
          deletedAt: {
            type: "date",
            required: false,
          },
        },
      },

      invitation: {
        additionalFields: {
          role: {
            type: "string",
            defaultValue: "member",
            required: true,
          },
          metadata: {
            type: "json",
            required: false,
          },
          updatedAt: {
            type: "date",
            required: true,
            onUpdate: () => new Date(),
          },
        },
      },
    },
  });
}
