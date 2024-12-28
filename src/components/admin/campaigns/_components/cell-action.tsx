'use client';

import { Button } from '@/components/ui/button';
import { CampaignColumn } from './columns';
import { Edit, MoreHorizontal, Copy, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

interface CellActionProps {
  data: CampaignColumn;
}

export const CellAction = ({ data }: CellActionProps) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const onCopy = (slug: string) => {
    navigator.clipboard.writeText(`${baseUrl}/api/campaigns/${params.id}`);
    toast({
      title: 'Success',
      description: 'Campaign slug copied to clipboard',
    })
  };

  const onDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`/admin/campaigns/${data.id}`);
      router.refresh();
      // router.push('/admin/campaigns');
      toast({
        title: 'Campaign deleted',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/admin/campaigns/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion?</AlertDialogTitle>
              <AlertDialogDescription>
                This action is permanent. It will delete your campaign and remove
                data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} disabled={loading}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenu>
    </div>
  );
};
