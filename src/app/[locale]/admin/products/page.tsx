import { getProducts } from "~/features/admin/actions/get-products";
import { AdminHeader } from "~/features/admin/components/admin-header";
import { ProductsTable } from "~/features/admin/components/products-table";

export default async function AdminProductsPage() {
  const products = await getProducts({ limit: 20 });

  return (
    <>
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Products" },
        ]}
      />
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage all products across organizations.
          </p>
        </div>

        <ProductsTable
          data={products.data}
          page={0}
          pageSize={20}
          total={products.total}
        />
      </div>
    </>
  );
}
