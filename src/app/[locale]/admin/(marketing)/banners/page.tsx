import { getBanners } from "~/features/admin/marketing/actions/get-banners";
import { BannersTable } from "~/features/admin/marketing/components/banners-table";
import { AdminHeader } from "~/features/admin/shared/components/admin-header";

export default async function AdminBannersPage() {
  const banners = await getBanners({ limit: 20 });

  return (
    <>
      <AdminHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Banners" },
        ]}
      />
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Banners</h1>
          <p className="text-muted-foreground">
            Manage homepage banner carousel.
          </p>
        </div>

        <BannersTable data={banners.data} total={banners.total} />
      </div>
    </>
  );
}
