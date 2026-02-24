import { organization } from "better-auth/plugins";

export function organizationPlugin() {
  return organization({
    dynamicAccessControl: {
      enabled: true,
    },

    schema: {
      organization: {
        additionalFields: {
          // custom
          metadata: {
            type: "json",
            required: false,
          },
          // fields
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
          // custom
          permission: {
            type: "json",
            required: true,
          },
          // fields
          metadata: {
            type: "json",
            required: false,
          },
          isSystem: {
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
          enabled: {
            type: "boolean",
            defaultValue: true,
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

      invitation: {
        additionalFields: {
          role: {
            type: "string",
            defaultValue: "member",
            required: true,
          },
          // fields
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
