"use client";
import {
  IconCopy,
  IconPencil,
  IconStar,
  IconTrash,
  IconTrendingUp,
} from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DataTableRowActions } from "@/components/ui/data-table-row-actions";
import { getSelectColumn } from "@/components/ui/data-table-row-selects";
import { DataTableSortable } from "@/components/ui/data-table-sortables";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

export interface ProductRowType {
  id: string;
  name: string;
  saleCount: number;
  slug: string;
  status: string;
  type: string;
  viewCount: number;
}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

function TableCellViewer({ item }: { item: ProductRowType }) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button
          className="w-fit px-0 text-start font-normal text-foreground hover:no-underline"
          variant="link"
        >
          {item.name}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.name}</DrawerTitle>
          <DrawerDescription>
            Showing total visitors for the last 6 months
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    axisLine={false}
                    dataKey="month"
                    hide
                    tickFormatter={(value) => value.slice(0, 3)}
                    tickLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent indicator="dot" />}
                    cursor={false}
                  />
                  <Area
                    dataKey="mobile"
                    fill="var(--color-mobile)"
                    fillOpacity={0.6}
                    stackId="a"
                    stroke="var(--color-mobile)"
                    type="natural"
                  />
                  <Area
                    dataKey="desktop"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stackId="a"
                    stroke="var(--color-desktop)"
                    type="natural"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 font-medium leading-none">
                  Trending up by 5.2% this month{" "}
                  <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Showing total visitors for the last 6 months. This is just
                  some random text to test the layout. It spans multiple lines
                  and should wrap around.
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="name">Name</Label>
              <Input defaultValue={item.name} id="name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="type">Type</Label>
                <Select defaultValue={item.type}>
                  <SelectTrigger className="w-full" id="type">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Table of Contents">
                        Table of Contents
                      </SelectItem>
                      <SelectItem value="Executive Summary">
                        Executive Summary
                      </SelectItem>
                      <SelectItem value="Technical Approach">
                        Technical Approach
                      </SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Capabilities">Capabilities</SelectItem>
                      <SelectItem value="Focus Documents">
                        Focus Documents
                      </SelectItem>
                      <SelectItem value="Narrative">Narrative</SelectItem>
                      <SelectItem value="Cover Page">Cover Page</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={item.status}>
                  <SelectTrigger className="w-full" id="status">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Done">Done</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="saleCount">Sales</Label>
                <Input
                  defaultValue={item.saleCount.toString()}
                  id="saleCount"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="viewCount">Views</Label>
                <Input
                  defaultValue={item.viewCount.toString()}
                  id="viewCount"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="slug">Slug</Label>
              <Input defaultValue={item.slug} id="slug" />
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export const columns: ColumnDef<ProductRowType>[] = [
  getSelectColumn<ProductRowType>(),
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableSortable column={column} title="Product Name" />
    ),
    cell: ({ row }) => <TableCellViewer item={row.original} />,
    enableHiding: false,
    meta: {
      className: "min-w-[250px] w-full",
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => <DataTableSortable column={column} title="Type" />,
    cell: ({ row }) => (
      <Badge
        className="px-1.5 text-muted-foreground capitalize"
        variant="secondary"
      >
        {row.original.type}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      if (!Array.isArray(value) || value.length === 0) {
        return true;
      }
      return value.includes(row.getValue(id));
    },
    meta: {
      className: "w-[120px]",
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableSortable column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          className="capitalize"
          variant={status === "active" ? "default" : "secondary"}
        >
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      if (!Array.isArray(value) || value.length === 0) {
        return true;
      }
      return value.includes(row.getValue(id));
    },
    meta: {
      className: "w-[120px]",
    },
  },
  {
    accessorKey: "saleCount",
    header: ({ column }) => (
      <DataTableSortable
        className="w-full justify-end"
        column={column}
        title="Sales"
      />
    ),
    cell: ({ row }) => (
      <div className="w-full text-end font-medium">
        {row.original.saleCount}
      </div>
    ),
    meta: {
      className: "w-[100px]",
    },
  },
  {
    accessorKey: "viewCount",
    header: ({ column }) => (
      <DataTableSortable
        className="w-full justify-end"
        column={column}
        title="Views"
      />
    ),
    cell: ({ row }) => (
      <div className="w-full text-end text-muted-foreground">
        {row.original.viewCount}
      </div>
    ),
    meta: {
      className: "w-[100px]",
    },
  },
  {
    accessorKey: "slug",
    header: ({ column }) => <DataTableSortable column={column} title="Slug" />,
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate font-mono text-muted-foreground text-xs">
        {row.original.slug}
      </div>
    ),
    meta: {
      className: "w-[150px]",
    },
  },

  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        actions={[
          {
            type: "action",
            label: "Edit",
            icon: IconPencil,
            onClick: (item) => {
              toast.info(`Editing ${item.name}`);
            },
          },
          {
            type: "action",
            label: "Make a copy",
            icon: IconCopy,
            onClick: (item) => {
              toast.success(`Copied ${item.name}`);
            },
          },
          {
            type: "action",
            label: "Favorite",
            icon: IconStar,
            onClick: (item) => {
              toast.success(`Favorited ${item.name}`);
            },
          },
          {
            type: "separator",
          },
          {
            type: "action",
            label: "Delete",
            icon: IconTrash,
            variant: "destructive",
            onClick: (item) => {
              toast.error(`Deleted ${item.name}`);
            },
          },
        ]}
        row={row.original}
      />
    ),
    meta: {
      className: "w-[50px]",
    },
  },
];
