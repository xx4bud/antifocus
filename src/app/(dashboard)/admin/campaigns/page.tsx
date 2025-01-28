import prisma from "@/lib/prisma";
import { getCampaignDataInclude } from "@/types";
import { CampaignsClient } from "@/app/(dashboard)/admin/campaigns/client";

export default async function CampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    include: getCampaignDataInclude(),
    orderBy: {
      name: "asc",
    },
  });
  return <CampaignsClient campaigns={campaigns} />;
}
