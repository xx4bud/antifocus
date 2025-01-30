import prisma from "@/lib/prisma";
import { CampaignsClient } from "./client";
import { getCampaignDataInclude } from "@/types";

export default async function CampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    include: getCampaignDataInclude(),
    orderBy: {
      createdAt: "desc",
    },
  });
  return <CampaignsClient campaigns={campaigns} />;
}
