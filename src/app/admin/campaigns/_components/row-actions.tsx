"use client";

import { Row } from "@tanstack/react-table";
import {
  Copy,
  Edit,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CampaignColumn } from "./columns";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertModal } from "@/components/ui/alert-modal";
import { deleteCampaign } from "../[slug]/actions";

interface RowActionsProps<TData> {
  row: Row<TData>;
}

export function RowActions<TData>({
  row,
}: RowActionsProps<TData>) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const campaign = row.original as CampaignColumn;
  // const baseUrl = process.env.AUTH_URL!;

  const handleCopy = () => {
    navigator.clipboard.writeText(campaign.id);
    toast({
      title: "Success",
      description: "Campaign id copied to clipboard",
    });
  };

  const handleEdit = () => {
    router.push(`/admin/campaigns/${campaign.slug}`);
  };

  const handleDeleteConfirmation = () => {
    setOpenAlert(false);
    handleDelete();
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    if (!campaign) return;

    const res = await deleteCampaign(campaign.id);

    if (res.success) {
      toast({
        title: "Deleted",
        description: "Campaign deleted successfully.",
      });
      router.push("/admin/campaigns");
      router.refresh();
    } else {
      toast({
        title: "Error",
        description: res.message,
      });
    }
    setIsDeleting(false);
  };

  return (
    <>
      <AlertModal
        open={openAlert}
        title="Are you sure?"
        description="This action cannot be undone. It will permanently delete the campaign."
        loading={isDeleting}
        onClose={() => setOpenAlert(false)}
        onConfirm={handleDeleteConfirmation}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCopy}>
            <Copy />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            <Edit />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenAlert(true)}
          >
            <Trash />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
