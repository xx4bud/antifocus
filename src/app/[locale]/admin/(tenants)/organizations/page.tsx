import { AdminHeader } from "~/features/admin/shared/components/admin-header";
import { AdminPageHeader } from "~/features/admin/shared/components/admin-page-header";
import { getOrganizations } from "~/features/admin/tenants/actions/get-organizations";
import { AddOrganizationButton } from "~/features/admin/tenants/components/add-organization-button";
import { OrganizationsTable } from "~/features/admin/tenants/components/organizations-table";

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
        <AdminPageHeader
          action={<AddOrganizationButton />}
          description="Manage tenant organizations."
          title="Organizations"
        />

        <OrganizationsTable data={orgs.data} total={orgs.total} />
      </div>
    </>
  );
}
