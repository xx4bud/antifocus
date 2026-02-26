"use server";

import { count, gt } from "drizzle-orm";
import { db, schema } from "~/lib/db";

export async function getAdminStats() {
  const now = new Date();

  const [
    usersCount,
    activeSessionsCount,
    accountsCount,
    verificationsCount,
    productsCount,
    categoriesCount,
    ordersCount,
    organizationsCount,
    bannersCount,
    customersCount,
  ] = await Promise.all([
    db
      .select({ count: count() })
      .from(schema.users)
      .then((r) => r[0]?.count ?? 0),
    db
      .select({ count: count() })
      .from(schema.sessions)
      .where(gt(schema.sessions.expiresAt, now))
      .then((r) => r[0]?.count ?? 0),
    db
      .select({ count: count() })
      .from(schema.accounts)
      .then((r) => r[0]?.count ?? 0),
    db
      .select({ count: count() })
      .from(schema.verifications)
      .then((r) => r[0]?.count ?? 0),
    db
      .select({ count: count() })
      .from(schema.products)
      .then((r) => r[0]?.count ?? 0),
    db
      .select({ count: count() })
      .from(schema.categories)
      .then((r) => r[0]?.count ?? 0),
    db
      .select({ count: count() })
      .from(schema.orders)
      .then((r) => r[0]?.count ?? 0),
    db
      .select({ count: count() })
      .from(schema.organizations)
      .then((r) => r[0]?.count ?? 0),
    db
      .select({ count: count() })
      .from(schema.banners)
      .then((r) => r[0]?.count ?? 0),
    db
      .select({ count: count() })
      .from(schema.customers)
      .then((r) => r[0]?.count ?? 0),
  ]);

  return {
    totalUsers: usersCount,
    activeSessions: activeSessionsCount,
    totalAccounts: accountsCount,
    totalVerifications: verificationsCount,
    totalProducts: productsCount,
    totalCategories: categoriesCount,
    totalOrders: ordersCount,
    totalOrganizations: organizationsCount,
    totalBanners: bannersCount,
    totalCustomers: customersCount,
  };
}
