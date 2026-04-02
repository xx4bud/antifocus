import { adminProcedure, router } from "@/lib/api/trpc";

export const adminRouter = router({
  getStats: adminProcedure.query(async () => {
    // This will be replaced with real database queries later
    return {
      totalUsers: 1234,
      organizations: 45,
      revenue: 12_345.67,
      activeNow: 573,
    };
  }),

  getRecentActivity: adminProcedure.query(async () => {
    return [
      { id: 1, type: "user_signup", user: "John Doe", time: "2 minutes ago" },
      { id: 2, type: "org_created", name: "Acme Corp", time: "10 minutes ago" },
      {
        id: 3,
        type: "subscription_renewed",
        user: "Jane Smith",
        time: "1 hour ago",
      },
    ];
  }),

  getUsers: adminProcedure.query(async () => {
    return [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        role: "admin",
        status: "active",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "user",
        status: "active",
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        name: "Bob Wilson",
        email: "bob@example.com",
        role: "user",
        status: "inactive",
        createdAt: new Date().toISOString(),
      },
    ];
  }),

  getOrganizations: adminProcedure.query(async () => {
    return [
      {
        id: "1",
        name: "Acme Corp",
        slug: "acme-corp",
        plan: "enterprise",
        members: 12,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Globex",
        slug: "globex",
        plan: "pro",
        members: 5,
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        name: "Soylent Corp",
        slug: "soylent-corp",
        plan: "free",
        members: 2,
        createdAt: new Date().toISOString(),
      },
    ];
  }),
});
