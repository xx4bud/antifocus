import { getOrders } from "~/features/admin/sales/actions/get-orders";
import { OrdersTable } from "~/features/admin/sales/components/orders-table";
import { AdminHeader } from "~/features/admin/shared/components/admin-header";

export default async function AdminOrdersPage() {
  const orders = await getOrders({ limit: 20 });

  return (
    <>
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Orders" },
        ]}
      />
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Orders</h1>
          <p className="text-muted-foreground">View and manage all orders.</p>
        </div>

        <OrdersTable data={orders.data} total={orders.total} />
      </div>
    </>
  );
}
