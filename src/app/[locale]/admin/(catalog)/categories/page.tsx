import { getCategories } from "~/features/admin/catalog/actions/get-categories";
import { CategoriesTable } from "~/features/admin/catalog/components/categories-table";
import { AdminHeader } from "~/features/admin/shared/components/admin-header";

export default async function AdminCategoriesPage() {
  const categories = await getCategories({ limit: 50 });

  return (
    <>
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Categories" },
        ]}
      />
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage product categories and hierarchy.
          </p>
        </div>

        <CategoriesTable data={categories.data} total={categories.total} />
      </div>
    </>
  );
}
