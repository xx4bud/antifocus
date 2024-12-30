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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CampaignColumn } from "./columns";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { deleteCampaign } from "../[slug]/actions";

interface RowActionsProps<TData> {
  row: Row<TData>;
}

export function RowActions<TData>({
  row,
}: RowActionsProps<TData>) {
  const [isLoading, setIsLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const campaign = row.original as CampaignColumn;
  const baseUrl = process.env.AUTH_URL!;

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${baseUrl}/api/campaigns/${campaign.slug}`
    );
    toast({
      title: "Success",
      description: "Campaign slug copied to clipboard",
    });
  };

  const handleEdit = () => {
    router.push(`/admin/campaigns/${campaign.slug}`);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setOpenAlert(false);
    try {
      const res = await deleteCampaign(
        campaign!.id,
        campaign!.photos.map((photo) => ({
          url: photo.url,
          publicId: photo.publicId,
        }))
      );
      if (res.success) {
        toast({
          title: "Success",
          description: "Campaign deleted successfully",
        });
        localStorage.removeItem("tempPhotos");
        router.push("/admin/campaigns");
        router.refresh();
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      console.error(`Error deleting campaign:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
          Copy
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
      <AlertDialog
        open={openAlert}
        onOpenChange={setOpenAlert}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirm Deletion?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action is permanent. It will delete your
              campaign and remove data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenu>
  );
}
