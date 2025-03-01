"use client";

import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit2Icon, Ellipsis, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { AlertModal } from "@/components/ui/alert-modal";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  onEdit?: (data: TData) => void;
  onDelete?: (data: TData) => Promise<{ success: boolean; message?: string }>;
}

export function DataTableRowActions<TData>({ 
  row, 
  onEdit, 
  onDelete 
}: DataTableRowActionsProps<TData>) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(row.original);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    try {
      setLoading(true);
      const result = await onDelete(row.original);

      if (!result.success && result.message) {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <Ellipsis />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          {onEdit && (
            <DropdownMenuItem onClick={handleEdit}>
              <Edit2Icon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Edit
            </DropdownMenuItem>
          )}
          {onEdit && onDelete && <DropdownMenuSeparator />}
          {onDelete && (
            <DropdownMenuItem
              onClick={() => setOpen(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2Icon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertModal
        loading={loading}
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        title="Are you sure?"
        description="This action cannot be undone."
      />
    </>
  );
}
