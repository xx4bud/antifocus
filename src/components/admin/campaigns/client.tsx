"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import Link from "next/link";
import { CampaignColumn, columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

interface CampaignsFormProps {
  initialData: CampaignColumn[]
}

export default function CampaignsClient({
  initialData,
}: CampaignsFormProps) {
  return (
    <div className="flex h-fit w-full flex-col items-center overflow-auto rounded-lg border bg-card p-4">
      <Heading
        title="Campaigns"
        amount={initialData.length}
        description="Manage your campaigns and categories"
        button={
          <Button asChild>
            <Link href={"/admin/campaigns/add"}>
              <Plus />
              Create
            </Link>
          </Button>
        }
      />
      <Separator className="my-4" />
      <DataTable columns={columns} data={initialData} />
    </div>
  );
}
