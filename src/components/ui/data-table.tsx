"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconSearch } from "@tabler/icons-react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type Row,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { useEffect, useId, useMemo, useState } from "react";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";

interface DraggableRowProps<TData> {
  getRowIdVal: (row: TData) => string;
  row: Row<TData>;
}

function DraggableRow<TData>({ row, getRowIdVal }: DraggableRowProps<TData>) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: getRowIdVal(row.original),
  });

  return (
    <TableRow
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      data-dragging={isDragging}
      data-state={row.getIsSelected() && "selected"}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export interface DataTableProps<TData, TValue> {
  actionButtons?: React.ReactNode;
  activeTab?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filters?: {
    columnId: string;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
  getRowId?: (row: TData) => string;
  onTabChange?: (tab: string) => void;
  searchKey?: string;
  searchPlaceholder?: string;
  tabs?: {
    value: string;
    label: string;
    badgeCount?: number;
    filterFn?: (item: TData) => boolean;
  }[];
}

export function DataTable<TData, TValue>({
  data: initialData,
  columns,
  activeTab: controlledActiveTab,
  onTabChange,
  getRowId,
  searchKey,
  searchPlaceholder,
  tabs,
  filters,
  actionButtons,
}: DataTableProps<TData, TValue>) {
  const [internalTab, setInternalTab] = useState(() => {
    const tabList = tabs;
    if (tabList && tabList.length > 0 && tabList[0]) {
      return tabList[0].value;
    }
    return "";
  });

  const activeTab =
    controlledActiveTab === undefined ? internalTab : controlledActiveTab;

  const handleTabChange = (val: string) => {
    if (onTabChange) {
      onTabChange(val);
    } else {
      setInternalTab(val);
    }
  };

  const [data, setData] = useState(() => initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Filter data by active tab's filterFn if defined
  const filteredDataByTab = useMemo(() => {
    if (!(tabs && activeTab)) {
      return data;
    }
    const currentTab = tabs.find((t) => t.value === activeTab);
    if (!currentTab?.filterFn) {
      return data;
    }
    return data.filter(currentTab.filterFn);
  }, [data, tabs, activeTab]);

  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const sortableId = useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const getRowIdVal =
    getRowId ??
    ((row: TData) => (row as Record<string, unknown>).id?.toString() ?? "");

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => filteredDataByTab?.map((row) => getRowIdVal(row)) || [],
    [filteredDataByTab, getRowIdVal]
  );

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const handleColumnVisibilityChange: OnChangeFn<VisibilityState> = (
    updater
  ) => {
    setColumnVisibility(updater);
  };

  const table = useReactTable({
    data: filteredDataByTab,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: getRowIdVal,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((prevData) => {
        // Find indices in the full dataset, matching the filtered ids
        const activeItem = prevData.find(
          (item) => getRowIdVal(item) === active.id
        );
        const overItem = prevData.find((item) => getRowIdVal(item) === over.id);
        if (!(activeItem && overItem)) {
          return prevData;
        }

        const oldIndex = prevData.indexOf(activeItem);
        const newIndex = prevData.indexOf(overItem);
        return arrayMove(prevData, oldIndex, newIndex);
      });
    }
  }

  return (
    <Tabs
      className="w-full flex-col justify-start gap-6"
      onValueChange={handleTabChange}
      value={activeTab}
    >
      <DataTableToolbar
        actionButtons={actionButtons}
        activeTab={activeTab}
        filters={filters}
        onTabChange={handleTabChange}
        searchKey={searchKey}
        searchPlaceholder={searchPlaceholder}
        table={table}
        tabs={tabs}
      />

      <TabsContent
        className="relative flex flex-col gap-4 overflow-auto px-4 outline-none lg:px-6"
        value={activeTab ?? ""}
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            id={sortableId}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead colSpan={header.colSpan} key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow
                        getRowIdVal={getRowIdVal}
                        key={row.id}
                        row={row}
                      />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      className="h-64 text-center"
                      colSpan={columns.length}
                    >
                      <div className="flex flex-col items-center justify-center gap-2 py-4">
                        <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                          <IconSearch className="size-5 stroke-[1.5] text-muted-foreground" />
                        </div>
                        <p className="font-semibold text-foreground text-sm">
                          No sections found
                        </p>
                        <p className="max-w-[280px] text-muted-foreground text-xs">
                          Try adjusting your search query or clear the active
                          filters.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>

        <DataTablePagination table={table} />
      </TabsContent>
    </Tabs>
  );
}
