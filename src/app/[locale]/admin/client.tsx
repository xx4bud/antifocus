"use client";

import { IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { ChartAreaInteractive } from "@/app/[locale]/admin/chart-area-interactive";
import { SectionCards } from "@/app/[locale]/admin/section-cards";
import { useTRPC } from "@/components/providers/trpc-provider";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { columns, type ProductRowType } from "./columns";

export function AdminClient() {
  const trpc = useTRPC();

  // Fetch dashboard data
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
  } = useQuery(trpc.org.getDashboardData.queryOptions({}));

  // Fetch products
  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    ...trpc.catalog.listProducts.queryOptions({
      page: 1,
      limit: 100,
    }),
  });

  const isLoading = isDashboardLoading || isProductsLoading;

  if (isDashboardError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-12">
        <p className="text-red-500">Failed to load dashboard data</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="grid gap-4 px-4 md:grid-cols-4 lg:px-6">
          <Skeleton className="h-[120px] w-full rounded-lg" />
          <Skeleton className="h-[120px] w-full rounded-lg" />
          <Skeleton className="h-[120px] w-full rounded-lg" />
          <Skeleton className="h-[120px] w-full rounded-lg" />
        </div>
        <div className="px-4 lg:px-6">
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
        <div className="space-y-4 px-4 lg:px-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards metrics={dashboardData?.metrics} />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive data={dashboardData?.chartData ?? []} />
      </div>
      <DataTable
        actionButtons={
          <Button className="h-8" size="sm" variant="outline">
            <IconPlus className="mr-2 size-4" stroke={1.5} />
            Add Product
          </Button>
        }
        columns={columns}
        data={(productsData?.items as ProductRowType[]) ?? []}
        filterOptions={[
          {
            columnId: "status",
            title: "Status",
            options: [
              { label: "Active", value: "active" },
              { label: "Draft", value: "draft" },
            ],
          },
          {
            columnId: "type",
            title: "Type",
            options: [
              { label: "Product", value: "product" },
              { label: "Service", value: "service" },
            ],
          },
        ]}
        searchKey="name"
        searchPlaceholder="Search products..."
      />
    </div>
  );
}
