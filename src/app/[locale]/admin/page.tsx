import { getUsers } from "~/features/admin/auth/actions/get-users";
import { UsersTable } from "~/features/admin/auth/components/users-table";
import { getAdminStats } from "~/features/admin/overview/actions/get-stats";
import { StatsCards } from "~/features/admin/overview/components/stats-cards";
import { AdminHeader } from "~/features/admin/shared/components/admin-header";

export default async function AdminPage() {
  const [stats, recentUsers] = await Promise.all([
    getAdminStats(),
    getUsers({ limit: 5 }),
  ]);

  return (
    <>
      <AdminHeader breadcrumbs={[{ label: "Dashboard" }]} />
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your application.</p>
        </div>

        <StatsCards stats={stats} />

        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-lg">Recent Users</h2>
          <UsersTable
            data={recentUsers.data}
            page={0}
            pageSize={5}
            total={recentUsers.total}
          />
        </div>
      </div>
    </>
  );
}
