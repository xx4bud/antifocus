import { prisma } from "@/lib/prisma";
import { getCampaignDataInclude } from "@/lib/queries";
import React from "react";
import CampaignsClient from "./client";
import { formatRelativeDate } from "@/lib/utils";

export default async function CampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    include: getCampaignDataInclude(),
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCampaigns = campaigns.map((campaign) => ({
    ...campaign,
    photo: campaign.photos[0].url,
    createdAt: formatRelativeDate(campaign.createdAt),
    updatedAt: formatRelativeDate(campaign.updatedAt),
  }));

  return (
    <div className="grid h-full w-full grid-cols-1 gap-4 md:p-3">
      <CampaignsClient campaigns={formattedCampaigns} />
    </div>
  );
}
