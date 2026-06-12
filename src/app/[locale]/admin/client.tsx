"use client";

import { IconPlus } from "@tabler/icons-react";
import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";
import { SectionCards } from "@/components/dashboard/section-cards";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { columns, type TableRowType } from "./columns";
import data from "./data.json";

export function AdminDashboardClient() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable
        actionButtons={
          <Button className="h-8" size="sm" variant="outline">
            <IconPlus className="mr-2 h-4 w-4" stroke={1.5} />
            Add Section
          </Button>
        }
        columns={columns}
        data={data}
        searchKey="header"
        searchPlaceholder="Filter sections..."
        tabs={[
          { value: "outline", label: "Outline" },
          {
            value: "past-performance",
            label: "Past Performance",
            badgeCount: 3,
            filterFn: (item: TableRowType) => [13, 14, 15].includes(item.id),
          },
          {
            value: "key-personnel",
            label: "Key Personnel",
            badgeCount: 2,
            filterFn: (item: TableRowType) => [19, 20].includes(item.id),
          },
          {
            value: "focus-documents",
            label: "Focus Documents",
            filterFn: (item: TableRowType) => [21, 23].includes(item.id),
          },
        ]}
      />
    </div>
  );
}
