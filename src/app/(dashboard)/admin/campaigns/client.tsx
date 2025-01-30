"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { CampaignData } from "@/types";
import { Plus } from "lucide-react";
import Link from "next/link";
import * as React from "react";

interface CampaignsClientProps {
  campaigns: CampaignData[];
}

export function CampaignsClient({
  campaigns,
}: CampaignsClientProps) {
  return (
    <>
      <div className="flex flex-1 flex-col bg-red-50 px-4 py-2">
        <Heading
          title="Campaigns"
          amount={campaigns.length}
          description="Manage our campaigns"
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

        {campaigns.map((campaign) => (
          <div
            key={campaign.slug}
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              <span>{campaign.name}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
