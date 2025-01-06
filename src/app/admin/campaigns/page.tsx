import { prisma } from "@/lib/prisma";
import { getCampaignDataInclude } from "@/lib/queries";
import React from "react";
import CampaignsClient from "./client";

export default async function CampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    include: getCampaignDataInclude(),
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="grid h-full w-full grid-cols-1 gap-4 md:p-3">
      <CampaignsClient campaigns={campaigns} />
    </div>
  );
}
