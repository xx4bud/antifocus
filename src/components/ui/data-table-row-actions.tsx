"use client";

import { IconDotsVertical } from "@tabler/icons-react";
import type { ComponentType } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface TableRowActionItem<TData> {
  disabled?: boolean;
  icon?: ComponentType<{ className?: string }>;
  label: string;
  onClick: (row: TData) => void;
  variant?: "default" | "destructive";
}

export type TableRowAction<TData> =
  | ({ type: "action" } & TableRowActionItem<TData>)
  | { type: "separator" };

export interface DataTableRowActionsProps<TData> {
  actions: TableRowAction<TData>[];
  align?: "start" | "center" | "end";
  row: TData;
}

export function DataTableRowActions<TData>({
  row,
  actions,
  align = "end",
}: DataTableRowActionsProps<TData>) {
  const actionsWithKeys: (TableRowAction<TData> & { key: string })[] = [];
  let separatorCount = 0;
  for (const action of actions) {
    if (action.type === "action") {
      actionsWithKeys.push({
        ...action,
        key: action.label,
      });
    } else {
      separatorCount++;
      actionsWithKeys.push({
        ...action,
        key: `separator-${separatorCount}`,
      });
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
          size="icon"
          variant="ghost"
        >
          <IconDotsVertical />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-40">
        {actionsWithKeys.map((action) => {
          if (action.type === "separator") {
            return <DropdownMenuSeparator key={action.key} />;
          }

          const Icon = action.icon;
          return (
            <DropdownMenuItem
              disabled={action.disabled}
              key={action.key}
              onClick={() => action.onClick(row)}
              variant={action.variant}
            >
              {Icon && <Icon />}
              <span>{action.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
