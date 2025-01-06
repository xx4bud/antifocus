"use client";

import { CampaignData } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import Link from "next/link";

interface CampaignsClientProps {
  campaigns: CampaignData[];
}

export default function CampaignsClient({
  campaigns,
}: CampaignsClientProps) {
  return (
    <div className="flex h-full w-full flex-col overflow-auto rounded-lg border bg-card p-4">
    <Heading
      title="Campaigns"
      amount={campaigns.length}
      description="Manage our campaigns"
      button={
        <Button asChild>
          <Link href={"/admin/campaigns/add"}>
            <Plus className="mr-2 h-4 w-4" />
            Create
          </Link>
        </Button>
      }
    />
    <Separator className="my-3" />
  </div>
  )
}
