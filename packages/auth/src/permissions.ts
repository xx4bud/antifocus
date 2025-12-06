import {
  AbilityBuilder,
  createMongoAbility,
  type MongoAbility,
} from "@casl/ability";
import type { BetterAuth } from ".";
import type { AppSubject } from "./subjects";

// ============================================================================
// PERMISSION TYPES
// ============================================================================

type Action =
  | "manage"
  | "create"
  | "read"
  | "update"
  | "delete"
  | "approve"
  | "reject";

type Permission = [Action, AppSubject] | ["manage", "all"];

export type AppAbility = MongoAbility<Permission>;

// ============================================================================
// PERMISSION BUILDER
// ============================================================================

export function getUserPermissions(
  user: BetterAuth["$Infer"]["Session"]["user"] | undefined
): AppAbility {
  const {
    build,
    can: allow,
    cannot: forbid,
  } = new AbilityBuilder<AppAbility>(createMongoAbility);

  // Public permissions (unauthenticated users)
  allow("read", "Product", { status: "active" });
  allow("read", "ProductVariant");
  allow("read", "ProductImage");
  allow("read", "Category", { isActive: true });
  allow("read", "Tag");
  allow("read", "Collection", { isPublic: true });
  allow("read", "Design", { isPublic: true, status: "approved" });
  allow("read", "Template");

  if (user === null || user === undefined) {
    return build();
  }

  // ============================================================================
  // AUTHENTICATED USER BASE PERMISSIONS
  // ============================================================================

  const userId = user.id;

  // Own account management
  allow("read", "User", { id: userId });
  allow("update", "User", { id: userId });
  allow("read", "Account");
  allow("read", "Session");
  allow("delete", "Session");
  allow("read", "TwoFactor");
  allow("create", "TwoFactor");
  allow("delete", "TwoFactor");

  // Marketplace browsing (all authenticated)
  allow("read", "Product");
  allow("read", "Collection");
  allow("read", "PrintProvider");

  // Own orders
  allow("create", "Order");
  allow("read", "Order", { userId });
  allow("update", "Order", { userId, status: "pending" });
  allow("delete", "Order", { userId, status: "pending" });
  allow("read", "OrderItem");
  allow("read", "Payment");
  allow("read", "Shipment");
  allow("create", "Refund");
  allow("read", "Refund", { requestedBy: userId });
  allow("read", "Invoice");

  // Own notifications
  allow("read", "Notification", { userId });
  allow("update", "Notification", { userId });
  allow("delete", "Notification", { userId });
  allow("read", "NotificationPreference", { userId });
  allow("update", "NotificationPreference", { userId });
  allow("create", "NotificationPreference");
  allow("read", "PushToken", { userId });
  allow("create", "PushToken");
  allow("delete", "PushToken", { userId });

  // Own files and folders
  allow("create", "File");
  allow("read", "File", { userId });
  allow("read", "File", { isPublic: true });
  allow("update", "File", { userId });
  allow("delete", "File", { userId });
  allow("create", "Folder");
  allow("read", "Folder", { userId });
  allow("update", "Folder", { userId });
  allow("delete", "Folder", { userId });
  allow("read", "Image");
  allow("read", "Thumbnail");
  allow("create", "UploadSession");
  allow("read", "UploadSession", { userId });
  allow("update", "UploadSession", { userId });

  // ============================================================================
  // ROLE-BASED PERMISSIONS
  // ============================================================================

  switch (user.role) {
    case "super_admin":
      // Super admins have complete control
      allow("manage", "all");
      break;

    case "admin":
      // User management (except super_admins)
      allow("read", "User");
      allow("create", "User");
      allow("update", "User", { role: { $ne: "super_admin" } });
      allow("delete", "User", { role: { $ne: "super_admin" } });
      forbid("delete", "User", { role: "super_admin" });
      allow("read", "Account");
      allow("read", "Session");
      allow("delete", "Session"); // Can terminate user sessions
      allow("read", "Verification");

      // Full product management
      allow("manage", "Product");
      allow("manage", "ProductVariant");
      allow("manage", "ProductImage");
      allow("manage", "Category");
      allow("manage", "Tag");
      allow("manage", "Collection");
      allow("manage", "Template");
      allow("manage", "PrintProvider");

      // Design moderation
      allow("read", "Design");
      allow("update", "Design"); // Can update status
      allow("approve", "Design");
      allow("reject", "Design");
      allow("delete", "Design", { status: "rejected" });

      // Full order management
      allow("manage", "Order");
      allow("manage", "OrderItem");
      allow("read", "Payment");
      allow("update", "Payment");
      allow("manage", "Fulfillment");
      allow("manage", "Shipment");
      allow("read", "Refund");
      allow("update", "Refund");
      allow("approve", "Refund");
      allow("reject", "Refund");
      allow("manage", "Invoice");

      // Notification management
      allow("manage", "Notification");
      allow("manage", "NotificationTemplate");
      allow("read", "EmailLog");
      allow("read", "SmsLog");
      allow("read", "PushToken");

      // Full analytics access
      allow("read", "PageView");
      allow("read", "Event");
      allow("read", "Conversion");
      allow("read", "Cohort");
      allow("read", "RevenueReport");
      allow("read", "ProductMetric");
      allow("manage", "UserSegment");

      // Storage management
      allow("read", "File");
      allow("delete", "File"); // Can delete any file
      allow("read", "Folder");
      allow("read", "Image");
      allow("read", "Thumbnail");
      break;

    case "staff":
      // Read user info for support
      allow("read", "User");
      allow("read", "Account");
      allow("read", "Session");

      // Product viewing
      allow("read", "Product");
      allow("read", "Design");

      // Order management (view and update status)
      allow("read", "Order");
      allow("update", "Order"); // Can update order status
      allow("read", "OrderItem");
      allow("read", "Payment");
      allow("read", "Fulfillment");
      allow("update", "Fulfillment"); // Can update fulfillment status
      allow("read", "Shipment");
      allow("update", "Shipment"); // Can update tracking
      allow("read", "Refund");
      allow("update", "Refund", { status: "requested" }); // Can review refund requests
      allow("read", "Invoice");

      // Can send notifications to customers
      allow("create", "Notification");
      allow("read", "Notification");
      allow("read", "EmailLog");
      allow("read", "SmsLog");

      // Limited analytics (read-only)
      allow("read", "PageView");
      allow("read", "Event");
      allow("read", "Conversion");
      allow("read", "ProductMetric");

      // Can view files
      allow("read", "File");
      allow("read", "Image");
      break;

    case "creator":
      // Own design management
      allow("create", "Design");
      allow("read", "Design", { creatorId: userId });
      allow("update", "Design", {
        creatorId: userId,
        status: "pending_review",
      });
      allow("delete", "Design", {
        creatorId: userId,
        status: "pending_review",
      });

      // Template usage
      allow("read", "Template");

      // Own collection management
      allow("create", "Collection");
      allow("read", "Collection", { creatorId: userId });
      allow("update", "Collection", { creatorId: userId });
      allow("delete", "Collection", { creatorId: userId });

      // View own analytics
      allow("read", "ProductMetric"); // For designs they created
      allow("read", "RevenueReport"); // Their commission data
      allow("read", "OrderItem", { creatorId: userId });

      // Extended file storage
      allow("create", "File");
      allow("read", "File", { userId });
      allow("update", "File", { userId });
      allow("delete", "File", { userId });
      allow("read", "Image");
      allow("read", "Thumbnail");
      break;

    case "user":
      // Base permissions already defined above
      // Regular users only have the authenticated base permissions
      break;

    default:
      // Unexpected role - use base permissions only
      break;
  }

  return build();
}
