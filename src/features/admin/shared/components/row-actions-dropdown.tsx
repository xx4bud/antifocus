"use client";

import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import { type ReactNode, useTransition } from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export interface RowActionItem {
  disabled?: boolean;
  icon?: ReactNode;
  label: string;
  onClick: () => void | Promise<void>;
  variant?: "default" | "destructive";
}

interface RowActionsDropdownProps {
  actions: RowActionItem[];
  deleteAction?: () => void | Promise<void>;
  editAction?: () => void;
}

export function RowActionsDropdown({
  actions,
  editAction,
  deleteAction,
}: RowActionsDropdownProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!deleteAction) {
      return;
    }
    startTransition(async () => {
      await deleteAction();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="size-8"
          disabled={isPending}
          size="icon"
          variant="ghost"
        >
          <IconDotsVertical className="size-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {editAction && (
          <DropdownMenuItem onClick={editAction}>
            <IconEdit className="mr-2 size-4" />
            Edit
          </DropdownMenuItem>
        )}

        {actions.map((action) => (
          <DropdownMenuItem
            disabled={action.disabled}
            key={action.label}
            onClick={() => {
              startTransition(async () => {
                await action.onClick();
              });
            }}
            variant={action.variant}
          >
            {action.icon}
            {action.label}
          </DropdownMenuItem>
        ))}

        {deleteAction && (
          <>
            {(editAction || actions.length > 0) && <DropdownMenuSeparator />}
            <DropdownMenuItem
              className="text-destructive"
              disabled={isPending}
              onClick={handleDelete}
              variant="destructive"
            >
              <IconTrash className="mr-2 size-4" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
