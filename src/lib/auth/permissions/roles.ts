import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc as globalAdminAc,
  userAc,
} from "better-auth/plugins/admin/access";
import {
  memberAc,
  adminAc as orgAdminAc,
  ownerAc,
} from "better-auth/plugins/organization/access";
import { statements } from "./statements";

export const ac = createAccessControl(statements);

// ==============================
// HIERARCHY ROLE DEFINITIONS
// ==============================

// 1. Level 1: Global User
export const userRole = ac.newRole({
  ...userAc.statements,
  project: ["read"],
  apiKeys: ["read"],
});

// 2. Level 2: Org Member
export const memberRole = ac.newRole({
  ...userRole.statements,
  ...memberAc.statements,
});

// 3. Level 3: Org Admin
export const adminRole = ac.newRole({
  ...memberRole.statements,
  ...orgAdminAc.statements,
  project: ["create", "read", "update"],
  apiKeys: ["create", "read", "delete"],
});

// 4. Level 4: Org Owner
export const ownerRole = ac.newRole({
  ...adminRole.statements,
  ...ownerAc.statements,
  project: ["create", "read", "update", "delete"],
});

// 5. Level 5: Global Superadmin
export const superadminRole = ac.newRole({
  ...ownerRole.statements,
  ...globalAdminAc.statements,
});
