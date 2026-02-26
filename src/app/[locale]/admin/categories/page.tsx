import { getCategories } from "~/features/admin/actions/get-categories";
import { AdminHeader } from "~/features/admin/components/admin-header";
import { CategoriesTable } from "~/features/admin/components/categories-table";

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
