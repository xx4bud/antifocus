import { admin } from "better-auth/plugins/admin";
import { DEFAULT_USER_ROLE, USER_ROLE } from "@/lib/db/schema";
import { ac, superadminRole, userRole } from "../permissions/roles";

export const adminPlugin = admin({
  ac,
  roles: {
    [USER_ROLE.SUPERADMIN]: superadminRole,
    [USER_ROLE.USER]: userRole,
  },
  defaultRole: DEFAULT_USER_ROLE,
  adminUserIds: process.env.ADMIN_USER_IDS?.split(",") || [],
});
