import { getCustomers } from "~/features/admin/actions/get-customers";
import { AdminHeader } from "~/features/admin/components/admin-header";
import { CustomersTable } from "~/features/admin/components/customers-table";

export default async function AdminCustomersPage() {
  const customers = await getCustomers({ limit: 20 });

  return (
    <>
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Customers" },
        ]}
      />
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            View customer records across organizations.
          </p>
        </div>

        <CustomersTable data={customers.data} total={customers.total} />
      </div>
    </>
  );
}
