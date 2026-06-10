import { defaultStatements as adminDefaultStatements } from "better-auth/plugins/admin/access";
import { defaultStatements as orgDefaultStatements } from "better-auth/plugins/organization/access";

export const statements = {
  ...adminDefaultStatements,
  ...orgDefaultStatements,
  project: ["create", "read", "share", "update", "delete"],
  apiKeys: ["create", "read", "delete"],
} as const;
