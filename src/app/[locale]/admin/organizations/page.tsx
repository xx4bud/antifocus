import { getOrganizations } from "~/features/admin/actions/get-organizations";
import { AdminHeader } from "~/features/admin/components/admin-header";
import { OrganizationsTable } from "~/features/admin/components/organizations-table";

export default async function AdminOrganizationsPage() {
  const orgs = await getOrganizations({ limit: 20 });

  return (
    <>
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Organizations" },
        ]}
      />
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">Manage tenant organizations.</p>
        </div>

        <OrganizationsTable data={orgs.data} total={orgs.total} />
      </div>
    </>
  );
}
